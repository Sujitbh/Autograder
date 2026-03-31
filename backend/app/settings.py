from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = "postgresql+psycopg2://autograder_user:autograder_pass@127.0.0.1:5432/autograder"
    ALLOW_ADMIN_REGISTRATION: bool = False
    JWT_SECRET: str = "change-me-now"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 60
    PASSWORD_RESET_EXPIRE_MINUTES: int = 60

    FRONTEND_URL: str = "http://localhost:3000"

    # MFA / OTP settings
    MFA_ENABLED: bool = True
    MFA_BYPASS_ENABLED: bool = True
    MFA_BYPASS_ACCOUNTS: str = ""
    OTP_TTL_MINUTES: int = 5
    OTP_MAX_ATTEMPTS: int = 5
    OTP_RESEND_COOLDOWN_SECONDS: int = 60

    # Email provider: "smtp", "sendgrid", "mailgun", or "console" (dev logging)
    MAIL_PROVIDER: str = "console"
    MAIL_FROM_ADDRESS: str = "noreply@axiom.ulm.edu"
    # Display name in inbox (must still match a verified SendGrid sender identity)
    MAIL_FROM_NAME: str = "Axiom"
    SENDGRID_API_KEY: str = ""
    MAILGUN_API_KEY: str = ""
    MAILGUN_DOMAIN: str = ""
    # SMTP (e.g., Gmail App Password auth)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    SMTP_FROM: str = ""
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False
    
    # Store data relative to the backend folder robustly
    DATA_ROOT: str = str(Path(__file__).parent.parent / "data")
    # AI detector configuration
    AI_DETECTOR_MODEL_ROOT: str = str(Path(__file__).resolve().parents[3] / "ai_detector" / "models")
    AI_DETECTOR_DEFAULT_THRESHOLD: float = 0.65
    # CORS origins for frontend development
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://orange-waddle-qjjqjjrrg5w3j65-5173.app.github.dev",
        "https://orange-waddle-qjjqjjrrg5w3j65-8000.app.github.dev",
    ]


settings = Settings()
