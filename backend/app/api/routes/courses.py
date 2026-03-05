from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from typing import Annotated, List, Optional
import random

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role, require_course_role
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.user import User
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.group import Group, GroupMembership
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

# ── Shared error messages ──
COURSE_NOT_FOUND = "Course not found"

# ── Annotated dependency aliases ──
DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


def generate_enrollment_code(db: Session) -> str:
    """Generate a short unique course enrollment code."""
    for _ in range(20):
        candidate = "".join(random.choice(ENROLLMENT_CODE_CHARS) for _ in range(7))
        exists = db.query(Course).filter(Course.enrollment_code == candidate).first()
        if not exists:
            return candidate
    raise HTTPException(status_code=500, detail="Unable to generate unique enrollment code")


@router.get("/", response_model=List[CourseOut])
def list_courses(db: DbSession, user: CurrentUser):
    """
    Return courses scoped to the authenticated user:
      - admin: all courses
      - faculty: courses where user is enrolled as instructor
      - student: courses where user is enrolled as student or ta
    """
    if user.role == "admin":
        return db.query(Course).all()

    # For faculty and students, only return courses they are enrolled in
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
    course_ids = [e.course_id for e in enrollments]
    if not course_ids:
        return []
    return db.query(Course).filter(Course.id.in_(course_ids)).all()


@router.post("/", response_model=CourseOut, responses={500: {"description": "Internal server error"}})
def create_course(payload: CourseCreate, db: DbSession, user: CurrentUser):
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


@router.get("/{course_id}", response_model=CourseOut, responses={404: {"description": "Resource not found"}})
def get_course(course_id: int, db: DbSession):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail=COURSE_NOT_FOUND)
    return course


@router.put("/{course_id}", response_model=CourseOut, responses={404: {"description": "Resource not found"}})
def update_course(course_id: int, payload: CourseUpdate, db: DbSession, user: CurrentUser):
    require_role(user.role, {"faculty", "admin"})
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail=COURSE_NOT_FOUND)
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(course, k, v)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", responses={404: {"description": "Resource not found"}})
def delete_course(course_id: int, db: DbSession, user: CurrentUser):
    require_role(user.role, {"faculty", "admin"})
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail=COURSE_NOT_FOUND)
    db.delete(course)
    db.commit()
    return {"ok": True}


@router.get("/{course_id}/enrollments", response_model=List[EnrollmentOut], responses={404: {"description": "Resource not found"}})
def list_course_enrollments(
    course_id: int,
    db: DbSession,
    user: CurrentUser,
    role: Annotated[Optional[str], Query(description="Optional role filter: student | ta | instructor")] = None,
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail=COURSE_NOT_FOUND)

    # Roster visibility is instructor/admin-only.
    require_course_role(db=db, user=user, course_id=course_id, allowed_roles=["instructor"])

    query = db.query(Enrollment).options(joinedload(Enrollment.user)).filter(Enrollment.course_id == course_id)
    if role:
        query = query.filter(Enrollment.role == role)

    return query.all()


@router.post("/{course_id}/enrollments", response_model=EnrollmentOut, responses={400: {"description": "Bad request"}, 404: {"description": "Resource not found"}})
def add_course_enrollment(
    course_id: int,
    payload: EnrollmentCreate,
    db: DbSession,
    user: CurrentUser,
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail=COURSE_NOT_FOUND)
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

    if payload.role in {"student", "ta"} and target_user.role != "student":
        raise HTTPException(
            status_code=400,
            detail="Only student users can be added as student or ta",
        )
    if payload.role == "instructor" and target_user.role not in {"faculty", "admin"}:
        raise HTTPException(
            status_code=400,
            detail="Only faculty/admin users can be added as instructor",
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


@router.patch("/{course_id}/enrollments/{enrollment_id}", response_model=EnrollmentOut, responses={400: {"description": "Bad request"}, 404: {"description": "Resource not found"}})
def update_course_enrollment(
    course_id: int,
    enrollment_id: int,
    payload: EnrollmentUpdate,
    db: DbSession,
    user: CurrentUser,
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

    if payload.role in {"student", "ta"} and target_user.role != "student":
        raise HTTPException(
            status_code=400,
            detail="Only student users can be assigned role=student or role=ta",
        )
    if payload.role == "instructor" and target_user.role not in {"faculty", "admin"}:
        raise HTTPException(
            status_code=400,
            detail="Only faculty/admin users can be assigned role=instructor",
        )

    enrollment.role = payload.role
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.delete("/{course_id}/enrollments/{enrollment_id}", responses={404: {"description": "Resource not found"}})
def delete_course_enrollment(
    course_id: int,
    enrollment_id: int,
    db: DbSession,
    user: CurrentUser,
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


@router.post("/enroll", response_model=EnrollmentOut, responses={404: {"description": "Resource not found"}})
def enroll_student_by_course_code(
    payload: CourseEnrollRequest,
    db: DbSession,
    user: CurrentUser,
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


@router.get("/{course_id}/classmates", response_model=List[dict], responses={403: {"description": "Forbidden"}})
def get_course_classmates(
    course_id: int,
    db: DbSession,
    user: CurrentUser,
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


@router.get("/{course_id}/grades", response_model=dict, responses={403: {"description": "Forbidden"}})
def get_course_grades(
    course_id: int,
    db: DbSession,
    user: CurrentUser,
):
    """Get grades for a course.
    
    - Faculty/Instructors: Get all students' grades
    - Students: Get their own grades
    """
    # Check if user is faculty/instructor for this course (can see all grades)
    if user.role in {"faculty", "admin"}:
        faculty_enrollment = db.query(Enrollment).filter(
            Enrollment.course_id == course_id,
            Enrollment.user_id == user.id,
            Enrollment.role.in_(["instructor", "ta"])
        ).first()
        
        if faculty_enrollment:
            # Faculty can see all students' grades
            # Get all enrollments in course
            enrollments = db.query(Enrollment).filter(
                Enrollment.course_id == course_id,
                Enrollment.role == "student"
            ).all()
            
            # Get all assignments and submissions
            assignments = db.query(Assignment).filter(Assignment.course_id == course_id).all()
            assignment_ids = [a.id for a in assignments]
            
            if not assignment_ids:
                return {
                    "students": [],
                    "assignments": [],
                }
            
            # Build response with all students' grades
            students = []
            for enrollment in enrollments:
                student = enrollment.user
                
                # Get submissions for this student
                submissions = db.query(Submission).filter(
                    Submission.student_id == student.id,
                    Submission.assignment_id.in_(assignment_ids)
                ).all()
                
                # Build submission map
                latest_submissions = {}
                for sub in submissions:
                    if sub.assignment_id not in latest_submissions:
                        latest_submissions[sub.assignment_id] = sub
                
                # Build grades
                grades = {}
                for assignment in assignments:
                    sub = latest_submissions.get(assignment.id)
                    if sub and sub.status == "graded" and sub.score is not None:
                        grades[str(assignment.id)] = sub.score
                    else:
                        grades[str(assignment.id)] = None
                
                students.append({
                    "id": student.id,
                    "student_id": student.id,
                    "name": f"{student.first_name} {student.last_name}".strip(),
                    "email": student.email,
                    "grades": grades
                })
            
            # Build assignment definitions
            assignment_defs = [
                {
                    "id": a.id,
                    "name": a.title,
                    "max_points": a.max_points or 100,
                    "due_date": a.due_date.isoformat() if a.due_date else None
                }
                for a in assignments
            ]
            
            return {
                "students": students,
                "assignments": assignment_defs,
            }
        else:
            raise HTTPException(status_code=403, detail="Not an instructor for this course")
    
    # Student view - check if enrolled as student
    if user.role == "student":
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
                    "assignment_name": assignment.title,
                    "score": sub.score,
                    "max_score": sub.max_score,
                    "percentage": round(percentage, 1),
                    "submitted": True
                })
            else:
                assignment_grades.append({
                    "assignment_id": assignment.id,
                    "assignment_name": assignment.title,
                    "score": None,
                    "max_score": assignment.max_points,
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
    
    raise HTTPException(status_code=403, detail="Forbidden")


@router.get("/{course_id}/my-groups", response_model=List[dict], responses={403: {"description": "Forbidden"}})
def get_student_groups(
    course_id: int,
    db: DbSession,
    user: CurrentUser,
):
    """Get groups the current student belongs to in a course."""
    # Check enrollment
    user_enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.user_id == user.id,
    ).first()

    if not user_enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course")

    # Get assignments in this course
    assignment_ids = [a.id for a in db.query(Assignment).filter(Assignment.course_id == course_id).all()]

    # Get groups the student is a member of for this course's assignments (or reusable)
    memberships = db.query(GroupMembership).filter(GroupMembership.user_id == user.id).all()
    group_ids = [m.group_id for m in memberships]

    if not group_ids:
        return []

    groups = db.query(Group).filter(
        Group.id.in_(group_ids),
        (Group.assignment_id.in_(assignment_ids)) | (Group.assignment_id.is_(None))
    ).all()

    result = []
    for group in groups:
        # Get assignment name if linked
        assignment_name = None
        if group.assignment_id:
            assignment = db.query(Assignment).filter(Assignment.id == group.assignment_id).first()
            if assignment:
                assignment_name = assignment.title

        # Get all members
        all_memberships = db.query(GroupMembership).filter(GroupMembership.group_id == group.id).all()
        members = []
        for m in all_memberships:
            member_user = db.query(User).filter(User.id == m.user_id).first()
            if member_user:
                members.append({
                    "id": member_user.id,
                    "name": member_user.name,
                    "email": member_user.email,
                    "role": m.role,
                })

        result.append({
            "id": group.id,
            "name": group.name,
            "assignment_name": assignment_name,
            "is_reusable": group.is_reusable,
            "members": members,
        })

    return result
