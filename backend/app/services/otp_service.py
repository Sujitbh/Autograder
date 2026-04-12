"""
OTP generation, verification, rate-limiting, and email delivery.

Security decisions documented inline.
"""

import hashlib
import hmac
import logging
import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.otp import OTP
from app.services.mail_provider import get_mail_provider
from app.settings import settings

logger = logging.getLogger(__name__)

# HMAC key derived from the server's JWT secret — keeps OTP hashes
# unpredictable even if the database is leaked.
_HMAC_KEY = settings.JWT_SECRET.encode()


def _hash_otp(code: str) -> str:
    """
    HMAC-SHA256 the plaintext OTP with the server secret.
    This lets us use secrets.compare_digest on fixed-length hex strings
    to prevent timing-based side-channel attacks.
    """
    return hmac.new(_HMAC_KEY, code.encode(), hashlib.sha256).hexdigest()


def generate_otp() -> str:
    """
    Cryptographically secure 6-digit numeric code.
    Uses secrets.randbelow (CSPRNG) — never random().
    """
    return str(secrets.randbelow(900_000) + 100_000)


def create_and_send_otp(db: Session, user_id: int, email: str) -> None:
    """
    Generate a new OTP, persist its hash, and email the plaintext code.
    Any previous unused OTPs for this user are invalidated first.
    """
    # Invalidate any outstanding OTPs so only the latest one is valid
    db.query(OTP).filter(
        OTP.user_id == user_id, OTP.used == False  # noqa: E712
    ).update({"used": True})

    code = generate_otp()

    otp = OTP(
        user_id=user_id,
        otp_hash=_hash_otp(code),
        expires_at=datetime.now(timezone.utc)
        + timedelta(minutes=settings.OTP_TTL_MINUTES),
    )
    db.add(otp)
    db.commit()

    _send_otp_email(email, code)


def can_resend(db: Session, user_id: int) -> bool:
    """
    Rate-limit: user must wait OTP_RESEND_COOLDOWN_SECONDS between requests.
    Returns True if a new OTP may be sent.
    """
    cooldown_boundary = datetime.now(timezone.utc) - timedelta(
        seconds=settings.OTP_RESEND_COOLDOWN_SECONDS
    )
    recent = (
        db.query(OTP)
        .filter(OTP.user_id == user_id, OTP.created_at > cooldown_boundary)
        .first()
    )
    return recent is None


def verify_otp(db: Session, user_id: int, submitted_code: str) -> str:
    """
    Validate a submitted OTP.

    Returns:
        "ok"              — code is correct
        "invalid"         — wrong code (attempt counted)
        "expired"         — code has expired
        "max_attempts"    — too many failed tries, OTP invalidated
        "no_otp"          — no pending OTP found
    """
    otp: OTP | None = (
        db.query(OTP)
        .filter(OTP.user_id == user_id, OTP.used == False)  # noqa: E712
        .order_by(OTP.created_at.desc())
        .first()
    )

    if not otp:
        return "no_otp"

    # Check expiry
    expires = otp.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < datetime.now(timezone.utc):
        otp.used = True
        db.commit()
        return "expired"

    # Check max attempts
    if otp.attempts >= settings.OTP_MAX_ATTEMPTS:
        otp.used = True
        db.commit()
        return "max_attempts"

    # Constant-time comparison to prevent timing attacks
    submitted_hash = _hash_otp(submitted_code)
    if not secrets.compare_digest(submitted_hash, otp.otp_hash):
        otp.attempts += 1
        if otp.attempts >= settings.OTP_MAX_ATTEMPTS:
            otp.used = True
        db.commit()
        return "invalid"

    # Success — mark used immediately to prevent replay
    otp.used = True
    db.commit()
    return "ok"


def cleanup_expired(db: Session) -> int:
    """
    Purge expired/used OTP rows older than 1 hour.
    Can be called from a cron job or on each login.
    Returns the number of rows deleted.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(hours=1)
    count = (
        db.query(OTP)
        .filter(OTP.created_at < cutoff, OTP.used == True)  # noqa: E712
        .delete(synchronize_session=False)
    )
    db.commit()
    return count


# ── Email template ───────────────────────────────────────────────────

def _send_otp_email(to: str, code: str) -> None:
    html = f"""\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:'Outfit',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:12px;padding:40px;
                    box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr><td align="center" style="padding-bottom:24px;">
          <h1 style="margin:0;font-size:24px;color:#7B0D0D;font-weight:700;">
            Axiom Verification Code
          </h1>
        </td></tr>
        <tr><td align="center" style="padding-bottom:8px;">
          <p style="margin:0;font-size:14px;color:#555;">
            Enter this code to complete your sign-in:
          </p>
        </td></tr>
        <tr><td align="center" style="padding:24px 0;">
          <div style="display:inline-block;padding:16px 40px;
                      background:#FDF2F2;border-radius:8px;
                      letter-spacing:12px;font-size:36px;font-weight:700;
                      color:#7B0D0D;border:2px dashed #7B0D0D;">
            {code}
          </div>
        </td></tr>
        <tr><td align="center" style="padding-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#888;">
            This code expires in <strong>5 minutes</strong>.
          </p>
        </td></tr>
        <tr><td align="center" style="border-top:1px solid #eee;padding-top:20px;">
          <p style="margin:0;font-size:12px;color:#aaa;">
            If you did not request this code, you can safely ignore this email.<br>
            <strong>Do not share this code with anyone.</strong>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    plain = (
        f"Your Axiom verification code is: {code}\n\n"
        f"This code expires in 5 minutes. Do not share it with anyone.\n\n"
        f"If you did not request this email, you can ignore it.\n"
    )

    provider = get_mail_provider()
    provider.send(to, "Your Axiom Verification Code", html, plain_body=plain)
