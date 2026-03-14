"""
Admin-only API routes for system management.
"""

from typing import Optional
from pathlib import Path
import json
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload, selectinload
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
from app.settings import settings

router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(user: User):
    require_role(user.role, {"admin"})


# ==================== Dashboard Stats ====================

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _require_admin(user)

    # Single query for all user role/active breakdowns (replaces 5 separate COUNT queries)
    role_counts = (
        db.query(User.role, User.is_active, func.count(User.id))
        .group_by(User.role, User.is_active)
        .all()
    )
    total_users = 0
    active_users = 0
    students = faculty = admins = 0
    for role, is_active, count in role_counts:
        total_users += count
        if is_active:
            active_users += count
        if role == "student":
            students += count
        elif role == "faculty":
            faculty += count
        elif role == "admin":
            admins += count

    total_courses = db.query(func.count(Course.id)).scalar() or 0
    total_assignments = db.query(func.count(Assignment.id)).scalar() or 0
    total_submissions = db.query(func.count(Submission.id)).scalar() or 0

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

    # Eagerly load student and assignment to avoid N+1 queries
    recent_submissions = (
        db.query(Submission)
        .options(joinedload(Submission.student), joinedload(Submission.assignment))
        .order_by(desc(Submission.created_at))
        .limit(limit)
        .all()
    )
    for s in recent_submissions:
        activities.append({
            "id": f"submission-{s.id}",
            "type": "submission",
            "description": f"{s.student.name if s.student else 'Unknown'} submitted {s.assignment.title if s.assignment else 'Unknown'}",
            "timestamp": s.created_at.isoformat() if s.created_at else None,
            "user_id": s.student_id,
            "user_name": s.student.name if s.student else None,
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

    # Eagerly load relationships to avoid N+1 queries per course
    q = db.query(Course).options(
        selectinload(Course.enrollments).joinedload(Enrollment.user),
        selectinload(Course.assignments),
        joinedload(Course.faculty),
    )
    if search:
        q = q.filter(
            (Course.name.ilike(f"%{search}%")) | (Course.code.ilike(f"%{search}%"))
        )
    if is_active is not None:
        q = q.filter(Course.is_active == is_active)

    courses = q.order_by(desc(Course.created_at)).all()
    result = []
    for c in courses:
        # Use model properties (iterate already-loaded collections)
        student_count = c.student_count
        assignment_count = c.assignment_count

        # Use direct faculty relationship; fall back to instructor enrollment (faculty only, not admin)
        faculty_name = None
        if c.faculty and c.faculty.role == "faculty":
            faculty_name = c.faculty.name
        else:
            for e in c.enrollments:
                if e.role == "instructor" and e.user and e.user.role == "faculty":
                    faculty_name = e.user.name
                    break

        result.append({
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "section": c.section,
            "description": c.description,
            "enrollment_code": c.enrollment_code,
            "is_active": c.is_active,
            "student_count": student_count,
            "assignment_count": assignment_count,
            "faculty_name": faculty_name,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })

    return result


@router.delete("/courses/{course_id}", status_code=204)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _require_admin(user)
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    # The SQLAlchemy relationships with cascade="all, delete-orphan" on the Course model 
    # should automatically handle deleting associated Enrollments, Assignments, etc., 
    # assuming the backend models are configured correctly.
    db.delete(course)
    db.commit()


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
    # Eagerly load user and course to avoid N+1 queries per enrollment
    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.role == "ta")
        .options(joinedload(Enrollment.user), joinedload(Enrollment.course))
        .all()
    )

    # Batch-load all TA permissions in one query
    enrollment_ids = [e.id for e in enrollments]
    permissions_map = {}
    if enrollment_ids:
        perms = db.query(TAPermission).filter(TAPermission.enrollment_id.in_(enrollment_ids)).all()
        permissions_map = {p.enrollment_id: p for p in perms}

    result = []
    for e in enrollments:
        perm = permissions_map.get(e.id)
        result.append({
            "enrollment_id": e.id,
            "user_id": e.user_id,
            "user_name": e.user.name if e.user else None,
            "user_email": e.user.email if e.user else None,
            "course_id": e.course_id,
            "course_name": e.course.name if e.course else None,
            "course_code": e.course.code if e.course else None,
            "permissions": {
                "can_grade": perm.can_grade if perm else True,
                "can_view_submissions": perm.can_view_submissions if perm else True,
                "can_manage_testcases": perm.can_manage_testcases if perm else False,
                "can_view_students": perm.can_view_students if perm else True,
                "can_manage_assignments": perm.can_manage_assignments if perm else False,
            },
        })
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
    # Eagerly load student, faculty, and course to avoid N+1 queries
    invitations = (
        db.query(TAInvitation)
        .options(
            joinedload(TAInvitation.student),
            joinedload(TAInvitation.faculty),
            joinedload(TAInvitation.course),
        )
        .order_by(desc(TAInvitation.created_at))
        .all()
    )
    return [
        {
            "id": inv.id,
            "student_name": inv.student.name if inv.student else None,
            "student_email": inv.student.email if inv.student else None,
            "faculty_name": inv.faculty.name if inv.faculty else None,
            "course_name": inv.course.name if inv.course else None,
            "course_code": inv.course.code if inv.course else None,
            "status": inv.status,
            "created_at": inv.created_at.isoformat() if inv.created_at else None,
            "responded_at": inv.responded_at.isoformat() if inv.responded_at else None,
        }
        for inv in invitations
    ]


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

    # Batch-load all referenced users in one query instead of per-log
    log_user_ids = {log.user_id for log in logs if log.user_id}
    users_map = {}
    if log_user_ids:
        users = db.query(User).filter(User.id.in_(log_user_ids)).all()
        users_map = {u.id: u for u in users}

    result = []
    for log in logs:
        log_user = users_map.get(log.user_id) if log.user_id else None
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


@router.get("/integrity-detector")
def get_integrity_detector_status(user: User = Depends(get_current_user)):
    _require_admin(user)

    model_path = Path(settings.DATA_ROOT) / "models" / "ai_code_detector.joblib"
    metrics_path = Path(settings.DATA_ROOT) / "models" / "ai_code_detector_metrics.json"

    metrics_payload = None
    if metrics_path.exists():
        try:
            with open(metrics_path, "r", encoding="utf-8") as fh:
                metrics_payload = json.load(fh)
        except Exception:
            metrics_payload = None

    return {
        "model_available": model_path.exists(),
        "model_path": str(model_path),
        "model_size_bytes": model_path.stat().st_size if model_path.exists() else None,
        "model_last_modified": model_path.stat().st_mtime if model_path.exists() else None,
        "metrics_available": metrics_payload is not None,
        "metrics": metrics_payload,
    }


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
