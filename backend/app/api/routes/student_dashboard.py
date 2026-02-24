from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.user import User

router = APIRouter(prefix="/student-dashboard", tags=["student-dashboard"])

@router.get("/stats")
def student_dashboard_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
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