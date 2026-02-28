from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.enrollment import Enrollment
from app.models.user import User

def require_role(user_role: str, allowed: set[str]) -> None:
    if user_role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: requires role in {sorted(list(allowed))}",
        )


def get_course_enrollment_role(db: Session, user_id: int, course_id: int) -> str | None:
    enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.user_id == user_id,
    ).first()
    return enrollment.role if enrollment else None


def require_course_role(
    db: Session,
    user: User,
    course_id: int,
    allowed_roles: list[str] | set[str],
) -> str:
    """
    Ensure the current user has one of the allowed course-level roles.
    Admin bypasses course enrollment checks.
    Returns the resolved role ("admin" or enrollment role) on success.
    """
    if user.role == "admin":
        return "admin"

    role = get_course_enrollment_role(db=db, user_id=user.id, course_id=course_id)
    if role and role in set(allowed_roles):
        return role

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=f"Forbidden: requires course role in {sorted(list(set(allowed_roles)))}",
    )
