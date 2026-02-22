"""
Security utilities for authentication and authorization.
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Token types
TOKEN_TYPE_ACCESS = "access"
TOKEN_TYPE_REFRESH = "refresh"

# Refresh token expiry (7 days)
REFRESH_TOKEN_EXPIRE_DAYS = 7


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(password, password_hash)


def create_access_token(
    subject: str,
    role: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token.
    
    Args:
        subject: Token subject (typically user email)
        role: User role
        expires_delta: Custom expiration time
        
    Returns:
        Encoded JWT token
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_MINUTES)

    payload = {
        "sub": subject,
        "role": role,
        "exp": expire,
        "type": TOKEN_TYPE_ACCESS,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)


def create_refresh_token(subject: str, role: str) -> str:
    """
    Create a JWT refresh token with longer expiry.
    
    Args:
        subject: Token subject (typically user email)
        role: User role
        
    Returns:
        Encoded JWT refresh token
    """
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": subject,
        "role": role,
        "exp": expire,
        "type": TOKEN_TYPE_REFRESH,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload
        
    Raises:
        ValueError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALG],
        )
        return payload
    except JWTError as e:
        raise ValueError(f"Invalid token: {str(e)}") from e


def verify_refresh_token(token: str) -> dict:
    """
    Verify a refresh token.
    
    Args:
        token: Refresh token string
        
    Returns:
        Decoded token payload
        
    Raises:
        ValueError: If token is invalid or not a refresh token
    """
    payload = decode_token(token)
    if payload.get("type") != TOKEN_TYPE_REFRESH:
        raise ValueError("Invalid token type: expected refresh token")
    return payload
