"""
Authentication and user management routes.
"""

import secrets
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
)
from app.core.permissions import require_role
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    UserOut,
    UserUpdate,
    RoleUpdate,
    PasswordChange,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.services.user_service import UserService
from app.services.email_service import EmailService
from app.settings import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

def _photo_dir() -> Path:
    d = Path(settings.DATA_ROOT) / "profile_photos"
    d.mkdir(parents=True, exist_ok=True)
    return d

router = APIRouter(prefix="/auth", tags=["auth"])


# ==================== Authentication ====================

@router.post("/register", response_model=UserOut)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user account.
    
    - Default role is 'student'
    - Email must be unique
    """
    user = UserService.register(db, payload)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email and password.
    
    Returns access token and refresh token.
    """
    user = UserService.authenticate(db, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(subject=user.email, role=user.role)
    refresh_token = create_refresh_token(subject=user.email, role=user.role)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=3600,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh access token using a valid refresh token.
    """
    try:
        token_data = verify_refresh_token(payload.refresh_token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

    # Verify user still exists and is active
    user = UserService.get_by_email(db, token_data["sub"])
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    # Issue new tokens
    access_token = create_access_token(subject=user.email, role=user.role)
    new_refresh_token = create_refresh_token(subject=user.email, role=user.role)

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=3600,
    )


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    """Get current authenticated user's profile."""
    return user


@router.put("/me", response_model=UserOut)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Update current user's profile."""
    update_data = payload.model_dump(exclude_unset=True)

    # Check if email is being changed and is unique
    if "email" in update_data and update_data["email"] != user.email:
        existing = UserService.get_by_email(db, update_data["email"])
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use",
            )

    for field, value in update_data.items():
        setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/change-password")
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Change current user's password."""
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    user.password_hash = hash_password(payload.new_password)
    db.add(user)
    db.commit()
    return {"message": "Password changed successfully"}


# ==================== Password Reset ====================

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Request a password reset. Generates a one-time token and emails a reset
    link. Always returns 200 to avoid leaking whether the email exists.
    """
    user = UserService.get_by_email(db, payload.email)
    if user and user.is_active:
        token = secrets.token_urlsafe(48)
        user.password_reset_token = token
        user.password_reset_expires = datetime.now(timezone.utc) + timedelta(
            minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES
        )
        db.add(user)
        db.commit()

        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        EmailService.send_password_reset_email(user.email, reset_url)

    return {"message": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset a password using a valid reset token.
    """
    user = (
        db.query(User)
        .filter(User.password_reset_token == payload.token)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    if (
        user.password_reset_expires is None
        or user.password_reset_expires.replace(tzinfo=timezone.utc)
        < datetime.now(timezone.utc)
    ):
        user.password_reset_token = None
        user.password_reset_expires = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired. Please request a new one.",
        )

    if len(payload.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters.",
        )

    user.password_hash = hash_password(payload.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.add(user)
    db.commit()

    return {"message": "Password has been reset successfully. You can now sign in."}


# ==================== Profile Photo ====================

@router.post("/me/photo", response_model=UserOut)
async def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Upload or replace the current user's profile photo."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{ext}' not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5 MB.",
        )

    # Delete old photo file if it exists
    if user.profile_photo:
        old_path = _photo_dir() / user.profile_photo
        old_path.unlink(missing_ok=True)

    filename = f"{user.id}_{uuid.uuid4().hex[:8]}{ext}"
    (_photo_dir() / filename).write_bytes(contents)

    user.profile_photo = filename
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/me/photo", response_model=UserOut)
def delete_profile_photo(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Remove the current user's profile photo."""
    if user.profile_photo:
        (path := _photo_dir() / user.profile_photo) and path.unlink(missing_ok=True)
        user.profile_photo = None
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.get("/photos/{filename}")
def serve_profile_photo(filename: str):
    """Serve a profile photo by filename."""
    path = _photo_dir() / filename
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Photo not found")
    return FileResponse(path)


# ==================== User Management (Admin) ====================

@router.get("/users", response_model=List[UserOut])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    List all users (admin only).
    """
    require_role(user.role, {"admin"})
    return UserService.get_all(db, skip=skip, limit=limit)


@router.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Get a specific user by ID (admin only).
    """
    require_role(user.role, {"admin"})
    target_user = UserService.get_by_id(db, user_id)
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return target_user


@router.put("/users/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: int,
    payload: RoleUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Update a user's role (admin only).
    
    Valid roles: student, faculty, admin
    """
    require_role(user.role, {"admin"})
    return UserService.update_role(db, user_id, payload.role)


@router.post("/users/{user_id}/deactivate", response_model=UserOut)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Deactivate a user account (admin only).
    """
    require_role(user.role, {"admin"})
    if user_id == user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account",
        )
    return UserService.deactivate(db, user_id)


@router.post("/users/{user_id}/activate", response_model=UserOut)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Activate a user account (admin only).
    """
    require_role(user.role, {"admin"})
    return UserService.activate(db, user_id)
