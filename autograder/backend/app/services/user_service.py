"""
User service for authentication and user management.
"""

from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse


class UserService:
    """Service for user-related operations."""

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email address."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Get all users with pagination."""
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def register(db: Session, payload: RegisterRequest) -> User:
        """
        Register a new user.
        
        Raises:
            HTTPException: If email already exists
        """
        existing = UserService.get_by_email(db, payload.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Auto-assign faculty role for @ulm.edu domain
        role = "faculty" if payload.email.lower().endswith("@ulm.edu") else "student"

        user = User(
            name=payload.name,
            email=payload.email,
            password_hash=hash_password(payload.password),
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password.
        
        Returns:
            User if credentials valid, None otherwise
        """
        user = UserService.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        if not user.is_active:
            return None
        return user

    @staticmethod
    def login(db: Session, payload: LoginRequest) -> TokenResponse:
        """
        Login user and return JWT token.
        
        Raises:
            HTTPException: If credentials invalid
        """
        user = UserService.authenticate(db, payload.email, payload.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        access_token = create_access_token(subject=user.email, role=user.role)
        return TokenResponse(access_token=access_token)

    @staticmethod
    def create_tokens(user: User) -> dict:
        """Create access and refresh tokens for a user."""
        access_token = create_access_token(subject=user.email, role=user.role)
        # Refresh token has longer expiry (handled in security.py)
        refresh_token = create_access_token(
            subject=user.email,
            role=user.role,
        )
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    @staticmethod
    def update_role(db: Session, user_id: int, new_role: str) -> User:
        """
        Update user role.
        
        Args:
            db: Database session
            user_id: User ID to update
            new_role: New role (student, faculty, admin)
            
        Raises:
            HTTPException: If user not found or invalid role
        """
        valid_roles = {"student", "faculty", "admin"}
        if new_role not in valid_roles:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid role. Must be one of: {valid_roles}",
            )

        user = UserService.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        user.role = new_role
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def deactivate(db: Session, user_id: int) -> User:
        """Deactivate a user account."""
        user = UserService.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        user.is_active = False
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def activate(db: Session, user_id: int) -> User:
        """Activate a user account."""
        user = UserService.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        user.is_active = True
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
