"""
OTP (One-Time Password) model for email-based MFA.

Security notes:
- otp_hash stores an HMAC-SHA256 digest of the plaintext code, never the code itself.
- attempts tracks failed verifications; the row is invalidated after MAX_ATTEMPTS.
- used is flipped to True immediately on successful verification to prevent replay.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    otp_hash = Column(String, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, nullable=False, default=False)
    attempts = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
