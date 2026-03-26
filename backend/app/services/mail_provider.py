"""
Email abstraction layer.

Provides a unified interface for sending transactional emails.
The concrete provider (SendGrid, Mailgun, or console logger) is
selected by the MAIL_PROVIDER env var. Swapping providers requires
zero code changes — just update the config value and API key.

Why SendGrid as the recommended production provider:
  - Free tier: 100 emails/day with no time limit.
  - Mailgun's free "Flex" plan is trial-only (expires after first month).
  - SendGrid's Python SDK is lightweight and well-documented.
"""

import logging
from abc import ABC, abstractmethod

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
    "sendgrid": SendGridMailProvider,
    "mailgun": MailgunMailProvider,
}


def get_mail_provider() -> MailProvider:
    """Factory — returns the configured provider instance."""
    cls = _PROVIDERS.get(settings.MAIL_PROVIDER)
    if cls is None:
        raise ValueError(
            f"Unknown MAIL_PROVIDER '{settings.MAIL_PROVIDER}'. "
            f"Choose from: {', '.join(_PROVIDERS)}"
        )
    return cls()
