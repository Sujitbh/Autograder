"""
Admin-only API routes for system management.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role
from app.core.security import hash_password
from app.models.user import User
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.enrollment import Enrollment
from app.models.language import Language
from app.models.semester import Semester
from app.models.audit_log import AuditLog
from app.models.system_setting import SystemSetting
from app.models.ta_invitation import TAInvitation
from app.models.ta_permission import TAPermission
from app.schemas.admin import SemesterCreate, SemesterUpdate, LanguageCreate, LanguageUpdate

router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(user: User):
    require_role(user.role, {"admin"})


# ==================== Dashboard Stats ====================

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _require_admin(user)

    total_users = db.query(func.count(User.id)).scalar() or 0
    total_courses = db.query(func.count(Course.id)).scalar() or 0
    total_assignments = db.query(func.count(Assignment.id)).scalar() or 0
    total_submissions = db.query(func.count(Submission.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0

    students = db.query(func.count(User.id)).filter(User.role == "student").scalar() or 0
    faculty = db.query(func.count(User.id)).filter(User.role == "faculty").scalar() or 0
    admins = db.query(func.count(User.id)).filter(User.role == "admin").scalar() or 0

    return {
        "total_users": total_users,
        "total_courses": total_courses,
        "total_assignments": total_assignments,
        "total_submissions": total_submissions,
        "active_users": active_users,
        "users_by_role": {"student": students, "faculty": faculty, "admin": admins},
    }


@router.get("/activity")
def get_recent_activity(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)

    # Combine recent users and submissions as activity items
    activities = []

    recent_users = db.query(User).order_by(desc(User.created_at)).limit(limit).all()
    for u in recent_users:
        activities.append({
            "id": f"user-{u.id}",
            "type": "registration",
            "description": f"{u.name} registered as {u.role}",
            "timestamp": u.created_at.isoformat() if u.created_at else None,
            "user_id": u.id,
            "user_name": u.name,
        })

    recent_submissions = db.query(Submission).order_by(desc(Submission.created_at)).limit(limit).all()
    for s in recent_submissions:
        student = db.query(User).filter(User.id == s.student_id).first()
        assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
        activities.append({
            "id": f"submission-{s.id}",
            "type": "submission",
            "description": f"{student.name if student else 'Unknown'} submitted {assignment.title if assignment else 'Unknown'}",
            "timestamp": s.created_at.isoformat() if s.created_at else None,
            "user_id": s.student_id,
            "user_name": student.name if student else None,
        })

    activities.sort(key=lambda x: x["timestamp"] or "", reverse=True)
    return activities[:limit]


# ==================== Admin Courses ====================

@router.get("/courses")
def list_all_courses(
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)

    q = db.query(Course)
    if search:
        q = q.filter(
            (Course.name.ilike(f"%{search}%")) | (Course.code.ilike(f"%{search}%"))
        )
    if is_active is not None:
        q = q.filter(Course.is_active == is_active)

    courses = q.order_by(desc(Course.created_at)).all()
    result = []
    for c in courses:
        student_count = db.query(func.count(Enrollment.id)).filter(
            Enrollment.course_id == c.id, Enrollment.role == "student"
        ).scalar() or 0
        assignment_count = db.query(func.count(Assignment.id)).filter(
            Assignment.course_id == c.id
        ).scalar() or 0
        faculty_enrollment = db.query(Enrollment).filter(
            Enrollment.course_id == c.id, Enrollment.role == "instructor"
        ).first()
        faculty_user = None
        if faculty_enrollment:
            faculty_user = db.query(User).filter(User.id == faculty_enrollment.user_id).first()

        result.append({
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "description": c.description,
            "enrollment_code": c.enrollment_code,
            "is_active": c.is_active,
            "student_count": student_count,
            "assignment_count": assignment_count,
            "faculty_name": faculty_user.name if faculty_user else None,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })

    return result


# ==================== Admin Users (enhanced) ====================

@router.get("/users")
def list_users_admin(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)

    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    if search:
        q = q.filter(
            (User.name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )
    if is_active is not None:
        q = q.filter(User.is_active == is_active)

    total = q.count()
    users = q.order_by(desc(User.created_at)).offset(skip).limit(limit).all()

    return {
        "users": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
            for u in users
        ],
        "total": total,
    }


# ==================== Semester Management ====================

@router.get("/semesters")
def list_semesters(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _require_admin(user)
    semesters = db.query(Semester).order_by(desc(Semester.start_date)).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "start_date": s.start_date.isoformat(),
            "end_date": s.end_date.isoformat(),
            "is_current": s.is_current,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in semesters
    ]


@router.post("/semesters", status_code=201)
def create_semester(
    payload: SemesterCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)
    semester = Semester(
        name=payload.name,
        start_date=payload.start_date,
        end_date=payload.end_date,
        is_current=payload.is_current,
    )
    if semester.is_current:
        db.query(Semester).filter(Semester.is_current == True).update({"is_current": False})
    db.add(semester)
    db.commit()
    db.refresh(semester)
    return {
        "id": semester.id,
        "name": semester.name,
        "start_date": semester.start_date.isoformat(),
        "end_date": semester.end_date.isoformat(),
        "is_current": semester.is_current,
    }


@router.put("/semesters/{semester_id}")
def update_semester(
    semester_id: int,
    payload: SemesterUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)
    semester = db.query(Semester).filter(Semester.id == semester_id).first()
    if not semester:
        raise HTTPException(status_code=404, detail="Semester not found")

    data = payload.model_dump(exclude_unset=True)
    if "name" in data:
        semester.name = data["name"]
    if "start_date" in data:
        semester.start_date = data["start_date"]
    if "end_date" in data:
        semester.end_date = data["end_date"]
    if "is_current" in data:
        if data["is_current"]:
            db.query(Semester).filter(Semester.is_current == True, Semester.id != semester_id).update({"is_current": False})
        semester.is_current = data["is_current"]

    db.commit()
    db.refresh(semester)
    return {
        "id": semester.id,
        "name": semester.name,
        "start_date": semester.start_date.isoformat(),
        "end_date": semester.end_date.isoformat(),
        "is_current": semester.is_current,
    }


@router.delete("/semesters/{semester_id}", status_code=204)
def delete_semester(
    semester_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)
    semester = db.query(Semester).filter(Semester.id == semester_id).first()
    if not semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    db.delete(semester)
    db.commit()


# ==================== Language Management ====================

@router.get("/languages")
def list_languages(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _require_admin(user)
    languages = db.query(Language).order_by(Language.name).all()
    return [
        {
            "id": l.id,
            "name": l.name,
            "file_extension": l.file_extension,
            "docker_image": l.docker_image,
            "created_at": l.created_at.isoformat() if l.created_at else None,
        }
        for l in languages
    ]


@router.post("/languages", status_code=201)
def create_language(
    payload: LanguageCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)
    lang = Language(
        name=payload.name,
        file_extension=payload.file_extension,
        docker_image=payload.docker_image,
    )
    db.add(lang)
    db.commit()
    db.refresh(lang)
    return {"id": lang.id, "name": lang.name, "file_extension": lang.file_extension, "docker_image": lang.docker_image}


@router.put("/languages/{language_id}")
def update_language(
    language_id: int,
    payload: LanguageUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)
    lang = db.query(Language).filter(Language.id == language_id).first()
    if not lang:
        raise HTTPException(status_code=404, detail="Language not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(lang, field, value)

    db.commit()
    db.refresh(lang)
    return {"id": lang.id, "name": lang.name, "file_extension": lang.file_extension, "docker_image": lang.docker_image}


@router.delete("/languages/{language_id}", status_code=204)
def delete_language(
    language_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)
    lang = db.query(Language).filter(Language.id == language_id).first()
    if not lang:
        raise HTTPException(status_code=404, detail="Language not found")
    db.delete(lang)
    db.commit()


# ==================== TA Management ====================

def _serialize_ta_assignment(e, ta_user, course, db):
    """Serialize a TA enrollment with its permissions."""
    perm = db.query(TAPermission).filter(TAPermission.enrollment_id == e.id).first()
    return {
        "enrollment_id": e.id,
        "user_id": e.user_id,
        "user_name": ta_user.name if ta_user else None,
        "user_email": ta_user.email if ta_user else None,
        "course_id": e.course_id,
        "course_name": course.name if course else None,
        "course_code": course.code if course else None,
        "permissions": {
            "can_grade": perm.can_grade if perm else True,
            "can_view_submissions": perm.can_view_submissions if perm else True,
            "can_manage_testcases": perm.can_manage_testcases if perm else False,
            "can_view_students": perm.can_view_students if perm else True,
            "can_manage_assignments": perm.can_manage_assignments if perm else False,
        } if perm else {
            "can_grade": True,
            "can_view_submissions": True,
            "can_manage_testcases": False,
            "can_view_students": True,
            "can_manage_assignments": False,
        },
    }


@router.get("/ta/assignments")
def list_ta_assignments(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _require_admin(user)
    enrollments = db.query(Enrollment).filter(Enrollment.role == "ta").all()
    result = []
    for e in enrollments:
        ta_user = db.query(User).filter(User.id == e.user_id).first()
        course = db.query(Course).filter(Course.id == e.course_id).first()
        result.append(_serialize_ta_assignment(e, ta_user, course, db))
    return result


@router.post("/ta/assign", status_code=201)
def assign_ta_to_course(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Admin manually assigns a user as TA to a course."""
    _require_admin(user)

    user_email = payload.get("user_email", "").strip()
    course_id = payload.get("course_id")

    if not user_email or not course_id:
        raise HTTPException(status_code=400, detail="user_email and course_id are required")

    # Find user
    target_user = db.query(User).filter(User.email == user_email).first()
    if not target_user:
        raise HTTPException(status_code=404, detail=f"User with email '{user_email}' not found")

    # Verify course exists
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Check for existing enrollment
    existing = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.user_id == target_user.id,
    ).first()

    if existing:
        if existing.role == "ta":
            raise HTTPException(status_code=409, detail="User is already a TA for this course")
        # Upgrade role to TA
        existing.role = "ta"
        db.commit()
        db.refresh(existing)
        enrollment = existing
    else:
        enrollment = Enrollment(
            course_id=course_id,
            user_id=target_user.id,
            role="ta",
        )
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)

    # Create default permissions for the TA
    perm = db.query(TAPermission).filter(TAPermission.enrollment_id == enrollment.id).first()
    if not perm:
        permissions = payload.get("permissions", {})
        perm = TAPermission(
            enrollment_id=enrollment.id,
            can_grade=permissions.get("can_grade", True),
            can_view_submissions=permissions.get("can_view_submissions", True),
            can_manage_testcases=permissions.get("can_manage_testcases", False),
            can_view_students=permissions.get("can_view_students", True),
            can_manage_assignments=permissions.get("can_manage_assignments", False),
        )
        db.add(perm)
        db.commit()

    return _serialize_ta_assignment(enrollment, target_user, course, db)


@router.delete("/ta/assignments/{enrollment_id}", status_code=200)
def remove_ta_from_course(
    enrollment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Admin removes a TA assignment (deletes the enrollment)."""
    _require_admin(user)

    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id, Enrollment.role == "ta"
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="TA enrollment not found")

    # Delete associated permissions (cascade should handle it, but be explicit)
    db.query(TAPermission).filter(TAPermission.enrollment_id == enrollment_id).delete()
    db.delete(enrollment)
    db.commit()
    return {"message": "TA removed from course"}


@router.get("/ta/assignments/{enrollment_id}/permissions")
def get_ta_permissions(
    enrollment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get permissions for a specific TA assignment."""
    _require_admin(user)

    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id, Enrollment.role == "ta"
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="TA enrollment not found")

    perm = db.query(TAPermission).filter(TAPermission.enrollment_id == enrollment_id).first()
    if not perm:
        return {
            "enrollment_id": enrollment_id,
            "can_grade": True,
            "can_view_submissions": True,
            "can_manage_testcases": False,
            "can_view_students": True,
            "can_manage_assignments": False,
        }

    return {
        "enrollment_id": enrollment_id,
        "can_grade": perm.can_grade,
        "can_view_submissions": perm.can_view_submissions,
        "can_manage_testcases": perm.can_manage_testcases,
        "can_view_students": perm.can_view_students,
        "can_manage_assignments": perm.can_manage_assignments,
    }


@router.put("/ta/assignments/{enrollment_id}/permissions")
def update_ta_permissions(
    enrollment_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Admin updates granular permissions for a TA."""
    _require_admin(user)

    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id, Enrollment.role == "ta"
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="TA enrollment not found")

    perm = db.query(TAPermission).filter(TAPermission.enrollment_id == enrollment_id).first()
    if not perm:
        perm = TAPermission(enrollment_id=enrollment_id)
        db.add(perm)

    for field in ["can_grade", "can_view_submissions", "can_manage_testcases", "can_view_students", "can_manage_assignments"]:
        if field in payload:
            setattr(perm, field, bool(payload[field]))

    db.commit()
    db.refresh(perm)

    return {
        "enrollment_id": enrollment_id,
        "can_grade": perm.can_grade,
        "can_view_submissions": perm.can_view_submissions,
        "can_manage_testcases": perm.can_manage_testcases,
        "can_view_students": perm.can_view_students,
        "can_manage_assignments": perm.can_manage_assignments,
    }


@router.get("/ta/invitations")
def list_ta_invitations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _require_admin(user)
    invitations = db.query(TAInvitation).order_by(desc(TAInvitation.created_at)).all()
    result = []
    for inv in invitations:
        student = db.query(User).filter(User.id == inv.student_id).first()
        faculty = db.query(User).filter(User.id == inv.faculty_id).first()
        course = db.query(Course).filter(Course.id == inv.course_id).first()
        result.append({
            "id": inv.id,
            "student_name": student.name if student else None,
            "student_email": student.email if student else None,
            "faculty_name": faculty.name if faculty else None,
            "course_name": course.name if course else None,
            "course_code": course.code if course else None,
            "status": inv.status,
            "created_at": inv.created_at.isoformat() if inv.created_at else None,
            "responded_at": inv.responded_at.isoformat() if inv.responded_at else None,
        })
    return result


# ==================== Audit Log ====================

@router.get("/audit-logs")
def list_audit_logs(
    skip: int = 0,
    limit: int = 50,
    action: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)

    q = db.query(AuditLog)
    if action:
        q = q.filter(AuditLog.action.ilike(f"%{action}%"))
    if user_id:
        q = q.filter(AuditLog.user_id == user_id)

    total = q.count()
    logs = q.order_by(desc(AuditLog.created_at)).offset(skip).limit(limit).all()

    result = []
    for log in logs:
        log_user = db.query(User).filter(User.id == log.user_id).first() if log.user_id else None
        result.append({
            "id": log.id,
            "user_id": log.user_id,
            "user_name": log_user.name if log_user else "System",
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "details": log.details,
            "ip_address": log.ip_address,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        })

    return {"logs": result, "total": total}


# ==================== System Settings ====================

@router.get("/settings")
def get_system_settings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _require_admin(user)
    settings = db.query(SystemSetting).all()
    grouped = {}
    for s in settings:
        if s.category not in grouped:
            grouped[s.category] = {}
        grouped[s.category][s.key] = s.value
    return grouped


@router.put("/settings")
def update_system_settings(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)

    for key, value in payload.items():
        existing = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if existing:
            existing.value = str(value)
        else:
            db.add(SystemSetting(key=key, value=str(value), category="general"))

    db.commit()
    return {"message": "Settings updated"}


# ==================== Password Management ====================

@router.post("/users/{user_id}/reset-password")
def reset_user_password(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    new_password = payload.get("new_password", "TempPass123!")
    target.password_hash = hash_password(new_password)
    db.commit()
    return {"message": f"Password reset for {target.email}", "temporary_password": new_password}
