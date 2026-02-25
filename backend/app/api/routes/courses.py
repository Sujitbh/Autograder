from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from pydantic import BaseModel

from app.api.deps import get_db, get_current_user
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.user import User
from app.schemas.course import CourseCreate, CourseOut, CourseUpdate

router = APIRouter(prefix="/courses", tags=["courses"])


# ── Enrollment request schema ─────────────────────────────────────


class AddMemberRequest(BaseModel):
    email: str
    role: str = "student"  # student | ta | instructor


class MemberOut(BaseModel):
    user_id: int
    name: str
    email: str
    role: str


# ── Course CRUD ───────────────────────────────────────────────────


@router.get("/", response_model=List[CourseOut])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


@router.post("/", response_model=CourseOut)
def create_course(payload: CourseCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    course = Course(name=payload.name, code=payload.code, description=payload.description)
    db.add(course)
    db.commit()
    db.refresh(course)
    # Auto-enroll the creator as instructor
    enrollment = Enrollment(course_id=course.id, user_id=user.id, role="instructor")
    db.add(enrollment)
    db.commit()
    return course


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.put("/{course_id}", response_model=CourseOut)
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(course, k, v)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"ok": True}


# ── Enrollment / Members ──────────────────────────────────────────


@router.get("/{course_id}/members", response_model=List[MemberOut])
def list_members(
    course_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """List all enrolled users for a course with their roles."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.course_id == course_id)
        .all()
    )
    return [
        MemberOut(
            user_id=e.user_id,
            name=e.user.name,
            email=e.user.email,
            role=e.role,
        )
        for e in enrollments
    ]


@router.post("/{course_id}/members")
def add_member(
    course_id: int,
    payload: AddMemberRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Add a user to a course by email. Role must be: student, ta, or instructor."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if payload.role not in ("student", "ta", "instructor"):
        raise HTTPException(status_code=400, detail="Role must be student, ta, or instructor")

    target = db.query(User).filter(User.email == payload.email).first()
    if not target:
        raise HTTPException(status_code=404, detail=f"No user found with email: {payload.email}")

    enrollment = Enrollment(course_id=course_id, user_id=target.id, role=payload.role)
    db.add(enrollment)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Update role if already enrolled
        existing = db.query(Enrollment).filter(
            Enrollment.course_id == course_id,
            Enrollment.user_id == target.id,
        ).first()
        if existing:
            existing.role = payload.role
            db.commit()

    return {"ok": True, "user_id": target.id, "email": target.email, "role": payload.role}


@router.delete("/{course_id}/members/{user_id}")
def remove_member(
    course_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Remove a user from a course."""
    enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.user_id == user_id,
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    db.delete(enrollment)
    db.commit()
    return {"ok": True}
