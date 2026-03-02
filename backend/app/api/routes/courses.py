from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from typing import List
import random

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role, require_course_role
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.user import User
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.schemas.course import (
    CourseCreate,
    CourseOut,
    CourseUpdate,
    EnrollmentCreate,
    EnrollmentOut,
    EnrollmentUpdate,
    CourseEnrollRequest,
)

router = APIRouter(prefix="/courses", tags=["courses"])

ENROLLMENT_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def generate_enrollment_code(db: Session) -> str:
    """Generate a short unique course enrollment code."""
    for _ in range(20):
        candidate = "".join(random.choice(ENROLLMENT_CODE_CHARS) for _ in range(7))
        exists = db.query(Course).filter(Course.enrollment_code == candidate).first()
        if not exists:
            return candidate
    raise HTTPException(status_code=500, detail="Unable to generate unique enrollment code")


@router.get("/", response_model=List[CourseOut])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


@router.post("/", response_model=CourseOut)
def create_course(payload: CourseCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    require_role(user.role, {"faculty", "admin"})
    course = Course(
        name=payload.name,
        code=payload.code,
        description=payload.description,
        enrollment_code=generate_enrollment_code(db),
        enrollment_code_active=payload.enrollment_code_active,
    )
    try:
        db.add(course)
        db.flush()  # ensures course.id is generated before enrollment insert

        # Auto-enroll creator as course instructor in the same transaction.
        enrollment = Enrollment(course_id=course.id, user_id=user.id, role="instructor")
        db.add(enrollment)

        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to persist course")

    persisted = db.query(Course).filter(Course.id == course.id).first()
    if not persisted:
        raise HTTPException(status_code=500, detail="Course was not persisted")
    return persisted


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.put("/{course_id}", response_model=CourseOut)
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    require_role(user.role, {"faculty", "admin"})
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(course, k, v)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    require_role(user.role, {"faculty", "admin"})
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"ok": True}


@router.get("/{course_id}/enrollments", response_model=List[EnrollmentOut])
def list_course_enrollments(
    course_id: int,
    role: str | None = Query(None, description="Optional role filter: student | ta | instructor"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Roster visibility is instructor/admin-only.
    require_course_role(db=db, user=user, course_id=course_id, allowed_roles=["instructor"])

    query = db.query(Enrollment).options(joinedload(Enrollment.user)).filter(Enrollment.course_id == course_id)
    if role:
        query = query.filter(Enrollment.role == role)

    return query.all()


@router.post("/{course_id}/enrollments", response_model=EnrollmentOut)
def add_course_enrollment(
    course_id: int,
    payload: EnrollmentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    require_course_role(db=db, user=user, course_id=course_id, allowed_roles=["instructor"])

    if payload.user_id is None and payload.email is None:
        raise HTTPException(status_code=400, detail="Provide either user_id or email")

    target_user = None
    if payload.user_id is not None:
        target_user = db.query(User).filter(User.id == payload.user_id).first()
    elif payload.email is not None:
        target_user = db.query(User).filter(User.email == payload.email).first()

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.role == "student" and target_user.role != "student":
        raise HTTPException(status_code=400, detail="Only student users can be added as student")
    if payload.role in {"ta", "instructor"} and target_user.role not in {"faculty", "admin"}:
        raise HTTPException(
            status_code=400,
            detail="Only faculty/admin users can be added as ta or instructor",
        )

    existing = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.user_id == target_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User is already enrolled in this course")

    enrollment = Enrollment(course_id=course_id, user_id=target_user.id, role=payload.role)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.patch("/{course_id}/enrollments/{enrollment_id}", response_model=EnrollmentOut)
def update_course_enrollment(
    course_id: int,
    enrollment_id: int,
    payload: EnrollmentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.course_id == course_id,
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    require_course_role(db=db, user=user, course_id=course_id, allowed_roles=["instructor"])

    target_user = db.query(User).filter(User.id == enrollment.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.role == "student" and target_user.role != "student":
        raise HTTPException(status_code=400, detail="Only student users can be assigned role=student")
    if payload.role in {"ta", "instructor"} and target_user.role not in {"faculty", "admin"}:
        raise HTTPException(
            status_code=400,
            detail="Only faculty/admin users can be assigned role=ta or role=instructor",
        )

    enrollment.role = payload.role
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.delete("/{course_id}/enrollments/{enrollment_id}")
def delete_course_enrollment(
    course_id: int,
    enrollment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.course_id == course_id,
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    require_course_role(db=db, user=user, course_id=course_id, allowed_roles=["instructor"])

    db.delete(enrollment)
    db.commit()
    return {"ok": True}


@router.post("/enroll", response_model=EnrollmentOut)
def enroll_student_by_course_code(
    payload: CourseEnrollRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    require_role(user.role, {"student"})

    course = db.query(Course).filter(
        Course.enrollment_code == payload.enrollmentCode,
        Course.enrollment_code_active.is_(True),
    ).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for enrollment code")

    existing = db.query(Enrollment).filter(
        Enrollment.course_id == course.id,
        Enrollment.user_id == user.id,
    ).first()
    if existing:
        return existing

    enrollment = Enrollment(course_id=course.id, user_id=user.id, role="student")
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/{course_id}/classmates", response_model=List[dict])
def get_course_classmates(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get list of classmates (students) in a course. Only accessible to enrolled students."""
    require_role(user.role, {"student"})
    
    # Check if user is enrolled in the course
    user_enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.user_id == user.id,
        Enrollment.role == "student"
    ).first()
    
    if not user_enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course")
    
    # Get all students enrolled in the course
    enrollments = db.query(Enrollment).options(joinedload(Enrollment.user)).filter(
        Enrollment.course_id == course_id,
        Enrollment.role == "student"
    ).all()
    
    classmates = []
    for enrollment in enrollments:
        classmates.append({
            "id": enrollment.user.id,
            "name": enrollment.user.name,
            "email": enrollment.user.email,
        })
    
    return classmates


@router.get("/{course_id}/grades", response_model=dict)
def get_course_grades(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get student's grades and assignment performance in a course."""
    require_role(user.role, {"student"})
    
    # Check if user is enrolled in the course
    user_enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.user_id == user.id,
        Enrollment.role == "student"
    ).first()
    
    if not user_enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course")
    
    # Get all assignments for the course
    assignments = db.query(Assignment).filter(Assignment.course_id == course_id).all()
    assignment_ids = [a.id for a in assignments]
    
    if not assignment_ids:
        return {
            "assignments": [],
            "averageScore": None,
            "graded_count": 0,
            "total_count": 0
        }
    
    # Get student's submissions for these assignments
    submissions = db.query(Submission).filter(
        Submission.student_id == user.id,
        Submission.assignment_id.in_(assignment_ids)
    ).all()
    
    # Build submission map by assignment_id
    latest_submissions = {}
    for sub in submissions:
        if sub.assignment_id not in latest_submissions:
            latest_submissions[sub.assignment_id] = sub
    
    # Collect grades
    assignment_grades = []
    graded_scores = []
    
    for assignment in assignments:
        sub = latest_submissions.get(assignment.id)
        if sub and sub.status == "graded" and sub.score is not None and sub.max_score is not None and sub.max_score > 0:
            percentage = (sub.score / sub.max_score) * 100
            graded_scores.append(percentage)
            assignment_grades.append({
                "assignment_id": assignment.id,
                "assignment_name": assignment.name,
                "score": sub.score,
                "max_score": sub.max_score,
                "percentage": round(percentage, 1),
                "submitted": True
            })
        else:
            assignment_grades.append({
                "assignment_id": assignment.id,
                "assignment_name": assignment.name,
                "score": None,
                "max_score": assignment.maxPoints,
                "percentage": None,
                "submitted": sub is not None
            })
    
    average_score = None
    if graded_scores:
        average_score = round(sum(graded_scores) / len(graded_scores), 1)
    
    return {
        "assignments": assignment_grades,
        "averageScore": average_score,
        "graded_count": len(graded_scores),
        "total_count": len(assignments)
    }
