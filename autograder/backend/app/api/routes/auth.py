"""
Authentication and user management routes.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
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
)
from app.services.user_service import UserService

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
