from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.user import User

router = APIRouter(prefix="/student-dashboard", tags=["student-dashboard"])

@router.get("/stats")
def student_dashboard_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    require_role(user.role, {"student"})
    # Get enrolled courses
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
    course_ids = [e.course_id for e in enrollments]
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()

    # Assignment stats
    assignments = db.query(Assignment).filter(Assignment.course_id.in_(course_ids)).all()
    assignment_ids = [a.id for a in assignments]

    # Submissions
    submissions = db.query(Submission).filter(Submission.student_id == user.id, Submission.assignment_id.in_(assignment_ids)).all()

    total_assignments = len(assignments)
    completed = sum(1 for s in submissions if s.status == "graded")
    pending = sum(1 for s in submissions if s.status in ["pending", "grading"])

    return {
        "courses": [
            {
                "id": c.id,
                "name": c.name,
                "code": c.code,
                "description": c.description,
            } for c in courses
        ],
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
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
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
