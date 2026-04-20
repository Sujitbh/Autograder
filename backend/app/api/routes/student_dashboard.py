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

router = APIRouter(prefix="/student-dashboard", tags=["student-dashboard"])


def _iso(dt):
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat()

@router.get("/stats")
def student_dashboard_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    require_role(user.role, {"student"})
    # Get courses where user is enrolled as student (exclude ta-role enrollments)
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == user.id,
        Enrollment.role == "student"
    ).all()
    course_ids = [e.course_id for e in enrollments]
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()

    # Assignment stats
    assignments = db.query(Assignment).filter(Assignment.course_id.in_(course_ids)).all()
    assignment_ids = [a.id for a in assignments]

    # Submissions
    submissions = db.query(Submission).filter(Submission.student_id == user.id, Submission.assignment_id.in_(assignment_ids)).all()

    total_assignments = len(assignments)
    completed = len({s.assignment_id for s in submissions})
    pending = sum(1 for s in submissions if s.status in ["pending", "grading"])

    # Calculate per-course progress
    course_data = []
    for c in courses:
        course_assignments = [a for a in assignments if a.course_id == c.id]
        course_assignment_ids = [a.id for a in course_assignments]
        course_submissions = [s for s in submissions if s.assignment_id in course_assignment_ids]
        
        submitted_assignment_ids = {s.assignment_id for s in course_submissions}
        completed_for_course = len(submitted_assignment_ids)
        graded_submissions_with_score = [s for s in course_submissions if s.status == "graded" and s.score is not None and s.max_score is not None and s.max_score > 0]
        
        average_score = None
        if graded_submissions_with_score:
            total_percentage = sum((s.score / s.max_score * 100) for s in graded_submissions_with_score)
            average_score = total_percentage / len(graded_submissions_with_score)
        
        course_data.append({
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "description": c.description,
            "assignments_count": len(course_assignments),
            "completed_count": completed_for_course,
            "average_score": round(average_score, 1) if average_score is not None else None,
        })

    return {
        "courses": course_data,
        "total_assignments": total_assignments,
        "completed_assignments": completed,
        "pending_assignments": pending,
    }


@router.get("/results")
def student_assignment_results(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """List student assignments with latest submission status + score."""
    require_role(user.role, {"student"})
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == user.id,
        Enrollment.role == "student"
    ).all()
    course_ids = [e.course_id for e in enrollments]
    if not course_ids:
        return {"results": []}

    assignments = db.query(Assignment).filter(Assignment.course_id.in_(course_ids)).all()
    assignment_ids = [a.id for a in assignments]
    submissions = db.query(Submission).filter(
        Submission.student_id == user.id,
        Submission.assignment_id.in_(assignment_ids),
    ).order_by(Submission.id.desc()).all()

    latest_by_assignment: dict[int, Submission] = {}
    for s in submissions:
        if s.assignment_id not in latest_by_assignment:
            latest_by_assignment[s.assignment_id] = s

    course_by_id = {c.id: c for c in db.query(Course).filter(Course.id.in_(course_ids)).all()}

    results = []
    for a in assignments:
        sub = latest_by_assignment.get(a.id)
        course = course_by_id.get(a.course_id)
        results.append({
            "assignment_id": a.id,
            "assignment_title": a.title,
            "course_id": a.course_id,
            "course_name": course.name if course else None,
            "due_date": a.due_date,
            "status": sub.status if sub else "not_submitted",
            "submission_id": sub.id if sub else None,
            "score": sub.score if sub else None,
            "max_score": sub.max_score if sub else None,
            "graded_at": sub.graded_at if sub else None,
        })

    return {"results": results}


@router.get("/feed")
def student_dashboard_feed(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Canvas-style dashboard payload for students: greeting, top-line stats,
    a prioritized to-do list, a time-grouped activity feed, and the set of
    courses they're enrolled in.
    """
    require_role(user.role, {"student"})
    now = datetime.now(timezone.utc)
    week_ahead = now + timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)

    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == user.id, Enrollment.role == "student")
        .all()
    )
    course_ids = [e.course_id for e in enrollments]
    courses = (
        db.query(Course).filter(Course.id.in_(course_ids)).all() if course_ids else []
    )
    course_by_id = {c.id: c for c in courses}

    assignments = (
        db.query(Assignment)
        .filter(
            Assignment.course_id.in_(course_ids),
            Assignment.status != "draft",
        )
        .all()
        if course_ids
        else []
    )
    assignments_by_id = {a.id: a for a in assignments}
    assignment_ids = list(assignments_by_id.keys())

    submissions = (
        db.query(Submission)
        .filter(
            Submission.student_id == user.id,
            Submission.assignment_id.in_(assignment_ids),
        )
        .all()
        if assignment_ids
        else []
    )
    latest_submission_by_assignment: dict[int, Submission] = {}
    for s in sorted(submissions, key=lambda x: x.id, reverse=True):
        latest_submission_by_assignment.setdefault(s.assignment_id, s)

    # Stats -----------------------------------------------------------------
    due_this_week = 0
    missing = 0
    graded_recently = 0
    percent_total = 0.0
    percent_count = 0
    for a in assignments:
        sub = latest_submission_by_assignment.get(a.id)
        due = a.due_date
        if due is not None:
            if due.tzinfo is None:
                due = due.replace(tzinfo=timezone.utc)
            if sub is None and now <= due <= week_ahead:
                due_this_week += 1
            if sub is None and due < now:
                missing += 1
        if sub and sub.status == "graded":
            if sub.graded_at and sub.graded_at.replace(
                tzinfo=sub.graded_at.tzinfo or timezone.utc
            ) >= two_weeks_ago:
                graded_recently += 1
            if sub.score is not None and sub.max_score and sub.max_score > 0:
                percent_total += (sub.score / sub.max_score) * 100
                percent_count += 1
    avg_grade = round(percent_total / percent_count, 1) if percent_count else None

    # To-dos ---------------------------------------------------------------
    todos: list[dict] = []
    for a in assignments:
        sub = latest_submission_by_assignment.get(a.id)
        course = course_by_id.get(a.course_id)
        course_ref = (
            {"id": course.id, "name": course.name, "code": course.code}
            if course
            else None
        )
        due = a.due_date
        if due is not None and due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)

        if sub is None:
            if due is not None and now <= due <= week_ahead:
                todos.append({
                    "kind": "upcoming",
                    "assignment_id": a.id,
                    "title": a.title,
                    "course": course_ref,
                    "due_date": _iso(a.due_date),
                })
            elif due is not None and due < now:
                todos.append({
                    "kind": "missing",
                    "assignment_id": a.id,
                    "title": a.title,
                    "course": course_ref,
                    "due_date": _iso(a.due_date),
                })
        elif sub.status == "graded":
            if sub.graded_at and sub.graded_at.replace(
                tzinfo=sub.graded_at.tzinfo or timezone.utc
            ) >= two_weeks_ago:
                todos.append({
                    "kind": "graded",
                    "assignment_id": a.id,
                    "title": a.title,
                    "course": course_ref,
                    "submission_id": sub.id,
                    "score": sub.score,
                    "max_score": sub.max_score,
                    "graded_at": _iso(sub.graded_at),
                })

    def _todo_key(t):
        # Upcoming first (by due date asc), then missing, then graded.
        order = {"upcoming": 0, "missing": 1, "graded": 2}
        bucket = order.get(t["kind"], 3)
        when = t.get("due_date") or t.get("graded_at") or ""
        return (bucket, when)

    todos.sort(key=_todo_key)
    todos = todos[:12]

    # Activity feed -------------------------------------------------------
    activity: list[dict] = []
    # Recently graded submissions
    for s in submissions:
        if s.status == "graded" and s.graded_at:
            a = assignments_by_id.get(s.assignment_id)
            if not a:
                continue
            course = course_by_id.get(a.course_id)
            graded_at_aware = s.graded_at.replace(
                tzinfo=s.graded_at.tzinfo or timezone.utc
            )
            if graded_at_aware >= two_weeks_ago:
                activity.append({
                    "kind": "grade",
                    "title": f"{a.title} was graded",
                    "subtitle": f"{s.score if s.score is not None else '—'} / {s.max_score or '—'}",
                    "course": {"id": course.id, "name": course.name, "code": course.code}
                    if course
                    else None,
                    "at": _iso(s.graded_at),
                    "link": f"/student/courses/{a.course_id}/assignments/{a.id}",
                })
    # Upcoming assignments (next 14 days)
    for a in assignments:
        due = a.due_date
        if due is None:
            continue
        if due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)
        if now <= due <= now + timedelta(days=14):
            course = course_by_id.get(a.course_id)
            activity.append({
                "kind": "assignment",
                "title": f"{a.title} due",
                "subtitle": None,
                "course": {"id": course.id, "name": course.name, "code": course.code}
                if course
                else None,
                "at": _iso(a.due_date),
                "link": f"/student/courses/{a.course_id}/assignments/{a.id}",
            })
    # Recent messages (announcements)
    recent_msgs = (
        db.query(Message)
        .filter(Message.receiver_id == user.id)
        .order_by(Message.created_at.desc())
        .limit(10)
        .all()
    )
    for m in recent_msgs:
        course = course_by_id.get(m.course_id) if m.course_id else None
        activity.append({
            "kind": "announcement",
            "title": m.content[:80] + ("…" if len(m.content) > 80 else ""),
            "subtitle": "Message",
            "course": {"id": course.id, "name": course.name, "code": course.code}
            if course
            else None,
            "at": _iso(m.created_at),
            "link": "/student/messages",
        })

    activity.sort(key=lambda x: x.get("at") or "", reverse=True)
    activity = activity[:30]

    # Course strip --------------------------------------------------------
    course_cards = []
    for c in courses:
        course_assignments = [a for a in assignments if a.course_id == c.id]
        course_submissions = [
            s for s in submissions if s.assignment_id in {a.id for a in course_assignments}
        ]
        graded = [
            s for s in course_submissions
            if s.status == "graded" and s.score is not None and s.max_score and s.max_score > 0
        ]
        avg = None
        if graded:
            avg = round(
                sum((s.score / s.max_score) * 100 for s in graded) / len(graded), 1
            )
        course_cards.append({
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "assignments_count": len(course_assignments),
            "completed_count": len({s.assignment_id for s in course_submissions}),
            "average_score": avg,
        })

    return {
        "greeting": {
            "name": (user.name.split(" ")[0] if user.name else (user.email.split("@")[0] if user.email else "there")),
            "role": user.role,
        },
        "stats": {
            "due_this_week": due_this_week,
            "missing": missing,
            "graded_recently": graded_recently,
            "average_grade": avg_grade,
        },
        "todos": todos,
        "activity": activity,
        "courses": course_cards,
        "generated_at": _iso(now),
    }
