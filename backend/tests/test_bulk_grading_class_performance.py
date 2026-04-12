import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.api.deps import get_db, get_current_user
from app.core.database import Base
from app.models.user import User
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.enrollment import Enrollment
from app.models.testcase import TestCase
from app.models.submission_result import SubmissionResult
from app.services.grading_service import GradingService


@pytest.fixture()
def isolated_db():
    import app.models as app_models  # noqa: F401

    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    db.add_all([
        User(id=1, name="Instructor", email="inst@example.com", password_hash="x", role="faculty", is_active=True),
        User(id=3, name="Student A", email="a@example.com", password_hash="x", role="student", is_active=True),
        User(id=4, name="Student B", email="b@example.com", password_hash="x", role="student", is_active=True),
        Course(id=10, name="CS 101", code="CS101", faculty_id=1),
        Assignment(id=20, title="A1", course_id=10, max_points=10),
        Enrollment(course_id=10, user_id=1, role="instructor"),
        Enrollment(course_id=10, user_id=3, role="student"),
        Enrollment(course_id=10, user_id=4, role="student"),
        Submission(id=30, assignment_id=20, student_id=3, status="pending"),
        Submission(id=31, assignment_id=20, student_id=3, status="graded", score=1, max_score=10),
        Submission(id=40, assignment_id=20, student_id=4, status="pending"),
    ])
    db.commit()
    db.close()

    try:
        yield SessionLocal
    finally:
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=engine)


def _client(session_local, user: User) -> TestClient:
    def _override_get_db():
        db = session_local()
        try:
            yield db
        finally:
            db.close()

    def _override_current_user() -> User:
        return user

    app.dependency_overrides[get_db] = _override_get_db
    app.dependency_overrides[get_current_user] = _override_current_user
    return TestClient(app)


def test_grade_all_reexecutes_latest_submission_per_student(isolated_db, monkeypatch):
    calls: list[int] = []

    def fake_grade_submission(db, submission_id: int, *, run_tests: bool = True, apply_rubric: bool = True, grader_id=None):
        calls.append(submission_id)
        return {
            "total_score": submission_id,
            "max_score": 100,
        }

    monkeypatch.setattr(GradingService, "grade_submission", staticmethod(fake_grade_submission))

    instructor = User(id=1, name="Instructor", email="inst@example.com", password_hash="x", role="faculty", is_active=True)
    client = _client(isolated_db, instructor)

    response = client.post("/api/grading/assignments/20/grade-all")
    assert response.status_code == 200

    data = response.json()
    assert data["total_considered"] == 2
    assert data["total_graded"] == 2
    assert data["total_errors"] == 0
    assert sorted(calls) == [31, 40]

    db = isolated_db()
    latest_a = db.query(Submission).filter(Submission.id == 31).first()
    latest_b = db.query(Submission).filter(Submission.id == 40).first()
    older_a = db.query(Submission).filter(Submission.id == 30).first()
    db.close()

    assert latest_a.status == "graded"
    assert latest_a.score == 31
    assert latest_b.status == "graded"
    assert latest_b.score == 40
    assert older_a.score is None


def test_run_tests_replaces_previous_submission_results(isolated_db, monkeypatch):
    db = isolated_db()
    db.add(TestCase(id=50, assignment_id=20, name="tc1", input_data="", expected_output="ok", points=5, is_public=True))
    db.add(SubmissionResult(submission_id=31, testcase_id=50, passed=False, output="old", points_awarded=0))
    submission = db.query(Submission).filter(Submission.id == 31).first()
    db.commit()

    monkeypatch.setattr(
        "app.services.execution_service.ExecutionService.run_all_testcases",
        lambda code, language, testcases: {
            "total_testcases": 1,
            "passed_testcases": 1,
            "total_points": 5,
            "earned_points": 5,
            "score_percentage": 100,
            "results": [
                {
                    "testcase_id": 50,
                    "passed": True,
                    "actual_output": "ok",
                    "points_earned": 5,
                }
            ],
        },
    )

    result = GradingService._run_tests(db, submission, "print('ok')", "python")
    rows = db.query(SubmissionResult).filter(SubmissionResult.submission_id == 31).all()
    db.close()

    assert result["earned_points"] == 5
    assert len(rows) == 1
    assert rows[0].passed is True
    assert rows[0].output == "ok"
