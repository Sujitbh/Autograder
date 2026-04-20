from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.message import Message
from app.models.user import User

router = APIRouter(prefix="/faculty-dashboard", tags=["faculty-dashboard"])


def _iso(dt):
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat()


@router.get("/feed")
def faculty_dashboard_feed(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Dashboard payload for faculty: greeting, teaching stats, prioritized
    to-do list (submissions to grade, drafts to publish, closing assignments),
    time-grouped activity feed, and the faculty member's courses.
    """
    require_role(user.role, {"faculty", "admin"})
    now = datetime.now(timezone.utc)
    week_ahead = now + timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)

    # Courses taught by this user. Authoritative source is the Enrollment
    # table with role "instructor" (and "ta"); Course.faculty_id is kept as a
    # legacy fallback so courses from older data still surface. Admins see
    # every course.
    courses_map: dict[int, Course] = {}
    if user.role == "admin":
        for c in db.query(Course).all():
            courses_map[c.id] = c
    else:
        teaching_enrollments = (
            db.query(Enrollment)
            .filter(
                Enrollment.user_id == user.id,
                Enrollment.role.in_(("instructor", "ta")),
            )
            .all()
        )
        teaching_course_ids = [e.course_id for e in teaching_enrollments]
        if teaching_course_ids:
            for c in (
                db.query(Course).filter(Course.id.in_(teaching_course_ids)).all()
            ):
                courses_map[c.id] = c
        # Legacy fallback: Course.faculty_id for users that never got an
        # instructor enrollment row.
        for c in db.query(Course).filter(Course.faculty_id == user.id).all():
            courses_map.setdefault(c.id, c)
    courses = list(courses_map.values())
    course_ids = list(courses_map.keys())

    assignments = (
        db.query(Assignment).filter(Assignment.course_id.in_(course_ids)).all()
        if course_ids
        else []
    )
    assignments_by_id = {a.id: a for a in assignments}
    assignment_ids = list(assignments_by_id.keys())

    submissions = (
        db.query(Submission).filter(Submission.assignment_id.in_(assignment_ids)).all()
        if assignment_ids
        else []
    )

    # Roll counts of enrolled students per course.
    student_counts: dict[int, int] = {}
    if course_ids:
        rows = (
            db.query(Enrollment)
            .filter(
                Enrollment.course_id.in_(course_ids), Enrollment.role == "student"
            )
            .all()
        )
        for r in rows:
            student_counts[r.course_id] = student_counts.get(r.course_id, 0) + 1
    total_students = sum(student_counts.values())

    # Stats --------------------------------------------------------------
    to_grade = sum(
        1 for s in submissions if s.status in ("pending", "grading", "error")
    )
    drafts = sum(1 for a in assignments if a.status == "draft")
    closing_soon = 0
    for a in assignments:
        if a.status != "published":
            continue
        due = a.due_date
        if due is None:
            continue
        if due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)
        if now <= due <= week_ahead:
            closing_soon += 1

    # To-dos -------------------------------------------------------------
    todos: list[dict] = []
    # Group ungraded submissions by assignment so the to-do list isn't swamped
    # with one entry per submission.
    ungraded_by_assignment: dict[int, list[Submission]] = {}
    for s in submissions:
        if s.status in ("pending", "grading", "error"):
            ungraded_by_assignment.setdefault(s.assignment_id, []).append(s)
    for aid, subs in ungraded_by_assignment.items():
        a = assignments_by_id.get(aid)
        if not a:
            continue
        course = courses_map.get(a.course_id)
        todos.append({
            "kind": "to_grade",
            "assignment_id": a.id,
            "title": a.title,
            "course": {"id": course.id, "name": course.name, "code": course.code}
            if course
            else None,
            "count": len(subs),
            "due_date": _iso(a.due_date),
        })
    for a in assignments:
        if a.status == "draft":
            course = courses_map.get(a.course_id)
            todos.append({
                "kind": "draft",
                "assignment_id": a.id,
                "title": a.title,
                "course": {"id": course.id, "name": course.name, "code": course.code}
                if course
                else None,
                "due_date": _iso(a.due_date),
            })
        elif a.status == "published" and a.due_date is not None:
            due = a.due_date
            if due.tzinfo is None:
                due = due.replace(tzinfo=timezone.utc)
            if now <= due <= week_ahead:
                course = courses_map.get(a.course_id)
                todos.append({
                    "kind": "closing",
                    "assignment_id": a.id,
                    "title": a.title,
                    "course": {"id": course.id, "name": course.name, "code": course.code}
                    if course
                    else None,
                    "due_date": _iso(a.due_date),
                })

    def _todo_key(t):
        order = {"to_grade": 0, "closing": 1, "draft": 2}
        return (order.get(t["kind"], 3), t.get("due_date") or "")

    todos.sort(key=_todo_key)
    todos = todos[:12]

    # Activity feed ------------------------------------------------------
    activity: list[dict] = []
    # New submissions in the last 14 days
    for s in submissions:
        created = s.created_at
        if created is None:
            continue
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        if created < two_weeks_ago:
            continue
        a = assignments_by_id.get(s.assignment_id)
        if not a:
            continue
        course = courses_map.get(a.course_id)
        if s.status == "graded":
            activity.append({
                "kind": "graded",
                "title": f"{a.title} graded",
                "subtitle": f"Score: {s.score if s.score is not None else '—'} / {s.max_score or '—'}",
                "course": {"id": course.id, "name": course.name, "code": course.code}
                if course
                else None,
                "at": _iso(s.graded_at or s.created_at),
                "link": f"/courses/{a.course_id}/submissions/{s.id}/grade",
            })
        else:
            activity.append({
                "kind": "submission",
                "title": f"New submission for {a.title}",
                "subtitle": None,
                "course": {"id": course.id, "name": course.name, "code": course.code}
                if course
                else None,
                "at": _iso(s.created_at),
                "link": f"/courses/{a.course_id}/submissions/{s.id}/grade",
            })

    # Upcoming assignments (next 14 days)
    for a in assignments:
        due = a.due_date
        if due is None or a.status != "published":
            continue
        if due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)
        if now <= due <= now + timedelta(days=14):
            course = courses_map.get(a.course_id)
            activity.append({
                "kind": "assignment",
                "title": f"{a.title} due",
                "subtitle": None,
                "course": {"id": course.id, "name": course.name, "code": course.code}
                if course
                else None,
                "at": _iso(a.due_date),
                "link": f"/courses/{a.course_id}/assignments/{a.id}",
            })

    # Recent messages (sent or received)
    recent_msgs = (
        db.query(Message)
        .filter((Message.receiver_id == user.id) | (Message.sender_id == user.id))
        .order_by(Message.created_at.desc())
        .limit(10)
        .all()
    )
    for m in recent_msgs:
        course = courses_map.get(m.course_id) if m.course_id else None
        activity.append({
            "kind": "announcement",
            "title": m.content[:80] + ("…" if len(m.content) > 80 else ""),
            "subtitle": "Message",
            "course": {"id": course.id, "name": course.name, "code": course.code}
            if course
            else None,
            "at": _iso(m.created_at),
            "link": "/faculty/messages",
        })

    activity.sort(key=lambda x: x.get("at") or "", reverse=True)
    activity = activity[:30]

    # Course strip -------------------------------------------------------
    course_cards = []
    for c in courses:
        course_assignments = [a for a in assignments if a.course_id == c.id]
        published = [a for a in course_assignments if a.status == "published"]
        drafts_for_course = [a for a in course_assignments if a.status == "draft"]
        course_cards.append({
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "student_count": student_counts.get(c.id, 0),
            "published_count": len(published),
            "draft_count": len(drafts_for_course),
        })

    return {
        "greeting": {
            "name": (
                user.name.split(" ")[0]
                if user.name
                else (user.email.split("@")[0] if user.email else "there")
            ),
            "role": user.role,
        },
        "stats": {
            "to_grade": to_grade,
            "drafts": drafts,
            "closing_soon": closing_soon,
            "total_students": total_students,
        },
        "todos": todos,
        "activity": activity,
        "courses": course_cards,
        "generated_at": _iso(now),
    }
