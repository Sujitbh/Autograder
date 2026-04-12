"""
Email abstraction layer.

Provides a unified interface for sending transactional emails.
The concrete provider (SMTP, SendGrid, Mailgun, or console logger) is
selected by the MAIL_PROVIDER env var. Swapping providers requires
zero code changes — just update the config value and API key.

Why SendGrid as the recommended production provider:
  - Free tier: 100 emails/day with no time limit.
  - Mailgun's free "Flex" plan is trial-only (expires after first month).
  - SendGrid's Python SDK is lightweight and well-documented.
"""

import logging
import smtplib
from abc import ABC, abstractmethod
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from functools import lru_cache

from app.settings import settings

logger = logging.getLogger(__name__)


class MailProvider(ABC):
    """Abstract base — every provider implements send()."""

    @abstractmethod
    def send(
        self,
        to: str,
        subject: str,
        html_body: str,
        plain_body: str | None = None,
    ) -> None:
        ...


class ConsoleMailProvider(MailProvider):
    """Logs emails to stdout. Used during local development."""

    def send(
        self,
        to: str,
        subject: str,
        html_body: str,
        plain_body: str | None = None,
    ) -> None:
        logger.info("=" * 60)
        logger.info(f"EMAIL TO: {to}")
        logger.info(f"FROM:     {settings.MAIL_FROM_ADDRESS}")
        logger.info(f"SUBJECT:  {subject}")
        if plain_body:
            logger.info("--- PLAIN ---\n%s", plain_body)
        logger.info("--- HTML ---\n%s", html_body)
        logger.info("=" * 60)


def _smtp_missing_config_fields() -> list[str]:
    missing: list[str] = []
    if not settings.SMTP_HOST.strip():
        missing.append("SMTP_HOST")
    if not settings.SMTP_USER.strip():
        missing.append("SMTP_USER")
    if not settings.SMTP_PASS.strip():
        missing.append("SMTP_PASS")

    from_address = (settings.SMTP_FROM or settings.MAIL_FROM_ADDRESS).strip()
    if not from_address:
        missing.append("SMTP_FROM (or MAIL_FROM_ADDRESS)")

    return missing


class SMTPMailProvider(MailProvider):
    """
    SMTP provider using Python stdlib only (smtplib + email.mime).
    Suitable for Gmail App Password auth with STARTTLS on port 587.
    """

    def send(
        self,
        to: str,
        subject: str,
        html_body: str,
        plain_body: str | None = None,
    ) -> None:
        missing = _smtp_missing_config_fields()
        if missing:
            logger.warning(
                "SMTP disabled: missing required settings (%s). Email to %s was not sent.",
                ", ".join(missing),
                to,
            )
            return

        smtp_host = settings.SMTP_HOST.strip()
        smtp_port = settings.SMTP_PORT
        smtp_user = settings.SMTP_USER.strip()
        smtp_pass = settings.SMTP_PASS
        from_addr = (settings.SMTP_FROM or settings.MAIL_FROM_ADDRESS).strip()
        from_name = (settings.MAIL_FROM_NAME or "Axiom").strip()

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = formataddr((from_name, from_addr))
        message["To"] = to.strip()

        plain_content = (
            plain_body
            or "Open the HTML version of this email for the full content."
        )
        message.attach(MIMEText(plain_content, "plain", "utf-8"))
        message.attach(MIMEText(html_body, "html", "utf-8"))

        smtp = None
        try:
            if settings.SMTP_USE_SSL:
                smtp = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20)
            else:
                smtp = smtplib.SMTP(smtp_host, smtp_port, timeout=20)
                smtp.ehlo()
                if settings.SMTP_USE_TLS:
                    smtp.starttls()
                    smtp.ehlo()

            smtp.login(smtp_user, smtp_pass)
            smtp.sendmail(from_addr, [to.strip()], message.as_string())
            logger.info("SMTP email sent successfully to %s", to)
        except Exception:
            logger.exception("SMTP email send failed to %s (subject=%s)", to, subject)
        finally:
            if smtp is not None:
                try:
                    smtp.quit()
                except Exception:
                    pass


class SendGridMailProvider(MailProvider):
    """
    SendGrid Web API v3 via the official sendgrid package.

    Security / deliverability:
    - Multipart (plain + HTML): many university filters score HTML-only mail lower.
    - Disable click/open tracking: reduces \"marketing\" signals that trigger quarantine.
    - Log X-Message-Id so you can correlate with SendGrid Activity.
    """

    def send(
        self,
        to: str,
        subject: str,
        html_body: str,
        plain_body: str | None = None,
    ) -> None:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import ClickTracking, Email, Mail, OpenTracking, To, TrackingSettings

        from_addr = settings.MAIL_FROM_ADDRESS.strip()
        from_name = (settings.MAIL_FROM_NAME or "Axiom").strip()

        # From must match a verified Single Sender or Domain Auth in SendGrid exactly.
        message = Mail(
            from_email=Email(from_addr, from_name),
            to_emails=To(to.strip()),
            subject=subject,
            plain_text_content=plain_body or "Open the HTML version of this email for your verification code.",
            html_content=html_body,
        )

        # Reduce chance of aggressive spam/quarantine filters (esp. Microsoft 365 / .edu).
        try:
            ts = TrackingSettings()
            ts.click_tracking = ClickTracking(enable=False, enable_text=False)
            ts.open_tracking = OpenTracking(enable=False)
            message.tracking_settings = ts
        except Exception:
            logger.warning("Could not disable SendGrid tracking settings", exc_info=True)

        client = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = client.send(message)

        msg_id = response.headers.get("X-Message-Id") if response.headers else None
        logger.info(
            "SendGrid: status=%s X-Message-Id=%s body=%s",
            response.status_code,
            msg_id,
            (response.body or b"")[:500],
        )

        if response.status_code not in (200, 202):
            logger.error(
                "SendGrid rejected the message — check API key, sender verification, "
                "and SendGrid dashboard Activity. Response: %s",
                response.body,
            )


class MailgunMailProvider(MailProvider):
    """Mailgun HTTP API — no SDK needed, just requests."""

    def send(
        self,
        to: str,
        subject: str,
        html_body: str,
        plain_body: str | None = None,
    ) -> None:
        import requests

        data = {
            "from": settings.MAIL_FROM_ADDRESS,
            "to": [to],
            "subject": subject,
            "html": html_body,
        }
        if plain_body:
            data["text"] = plain_body

        response = requests.post(
            f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
            auth=("api", settings.MAILGUN_API_KEY),
            data=data,
            timeout=10,
        )
        response.raise_for_status()
        logger.info("Mailgun response: status=%s", response.status_code)


_PROVIDERS = {
    "console": ConsoleMailProvider,
    "smtp": SMTPMailProvider,
    "sendgrid": SendGridMailProvider,
    "mailgun": MailgunMailProvider,
}


def _resolve_mail_provider_name() -> str:
    provider = (settings.MAIL_PROVIDER or "console").strip().lower()
    smtp_missing = _smtp_missing_config_fields()
    smtp_ready = len(smtp_missing) == 0

    if provider == "console" and smtp_ready:
        logger.info(
            "SMTP enabled via environment (host=%s, port=%s, tls=%s, ssl=%s). "
            "Using SMTP mail provider.",
            settings.SMTP_HOST.strip(),
            settings.SMTP_PORT,
            settings.SMTP_USE_TLS,
            settings.SMTP_USE_SSL,
        )
        return "smtp"

    if provider == "smtp":
        if smtp_ready:
            logger.info(
                "SMTP enabled (host=%s, port=%s, tls=%s, ssl=%s).",
                settings.SMTP_HOST.strip(),
                settings.SMTP_PORT,
                settings.SMTP_USE_TLS,
                settings.SMTP_USE_SSL,
            )
        else:
            logger.warning(
                "SMTP provider selected but configuration is incomplete (%s). "
                "Emails will be skipped until SMTP settings are completed.",
                ", ".join(smtp_missing),
            )
        return "smtp"

    if provider == "console":
        logger.info("SMTP disabled. Using console mail provider.")
    else:
        logger.info("Using mail provider: %s", provider)

    return provider


@lru_cache(maxsize=1)
def get_mail_provider() -> MailProvider:
    """Factory — returns the configured provider instance."""
    provider_name = _resolve_mail_provider_name()
    cls = _PROVIDERS.get(provider_name)
    if cls is None:
        raise ValueError(
            f"Unknown MAIL_PROVIDER '{provider_name}'. "
            f"Choose from: {', '.join(_PROVIDERS)}"
        )
    return cls()
