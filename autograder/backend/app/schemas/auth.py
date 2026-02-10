from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    """Schema for user registration."""
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int = 3600  # seconds


class RefreshTokenRequest(BaseModel):
    """Schema for token refresh."""
    refresh_token: str


class UserOut(BaseModel):
    """Schema for user output (public info)."""
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class RoleUpdate(BaseModel):
    """Schema for updating user role (admin only)."""
    role: str  # student, faculty, admin


class PasswordChange(BaseModel):
    """Schema for changing password."""
    current_password: str
    new_password: str
