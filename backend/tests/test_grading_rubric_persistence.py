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
from app.models.ta_permission import TAPermission
from app.models.rubric import Rubric
from app.models.submission_rubric_score import SubmissionRubricScore


@pytest.fixture()
def isolated_db():
    import app.models as app_models  # noqa: F401  # Ensure models are registered on Base metadata.

    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    seed = {
        "course_id": 10,
        "assignment_id": 20,
        "submission_id": 30,
        "rubric_ids": [101, 102],
    }

    db = SessionLocal()
    db.add_all([
        User(id=1, name="Instructor", email="inst@example.com", password_hash="x", role="faculty", is_active=True),
        User(id=2, name="TA", email="ta@example.com", password_hash="x", role="student", is_active=True),
        User(id=3, name="Student", email="student@example.com", password_hash="x", role="student", is_active=True),
        Course(id=seed["course_id"], name="CS 101", code="CS101", faculty_id=1),
        Assignment(id=seed["assignment_id"], title="A1", course_id=seed["course_id"], max_points=25),
        Submission(
            id=seed["submission_id"],
            assignment_id=seed["assignment_id"],
            student_id=3,
            status="pending",
            max_score=25,
        ),
        Enrollment(course_id=seed["course_id"], user_id=1, role="instructor"),
        Enrollment(course_id=seed["course_id"], user_id=2, role="ta"),
        Rubric(id=seed["rubric_ids"][0], assignment_id=seed["assignment_id"], name="Correctness", max_points=10, order=1),
        Rubric(id=seed["rubric_ids"][1], assignment_id=seed["assignment_id"], name="Style", max_points=15, order=2),
    ])
    db.commit()
    db.close()

    try:
        yield SessionLocal, seed
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


def test_manual_score_persists_rubric_breakdown_and_returns_in_detail(isolated_db):
    session_local, seed = isolated_db
    instructor = User(id=1, name="Instructor", email="inst@example.com", password_hash="x", role="faculty", is_active=True)
    client = _client(session_local, instructor)

    patch_resp = client.patch(
        f"/api/grading/submissions/{seed['submission_id']}/score",
        json={
            "score": 22,
            "max_score": 25,
            "feedback": "Solid work",
            "rubric_breakdown": [
                {"rubric_id": seed["rubric_ids"][0], "score_awarded": 9, "feedback": "Great logic"},
                {"rubric_id": seed["rubric_ids"][1], "score_awarded": 99, "feedback": "Clamped to max"},
            ],
        },
    )

    assert patch_resp.status_code == 200

    db = session_local()
    rows = db.query(SubmissionRubricScore).filter(
        SubmissionRubricScore.submission_id == seed["submission_id"]
    ).order_by(SubmissionRubricScore.rubric_id.asc()).all()
    db.close()

    assert len(rows) == 2
    assert rows[0].rubric_id == seed["rubric_ids"][0]
    assert rows[0].score_awarded == 9
    assert rows[1].rubric_id == seed["rubric_ids"][1]
    assert rows[1].score_awarded == 15

    detail_resp = client.get(f"/api/submissions/{seed['submission_id']}/detail")
    assert detail_resp.status_code == 200
    detail = detail_resp.json()

    scores_by_rubric = {item["rubric_id"]: item["score_awarded"] for item in detail["rubric_scores"]}
    assert scores_by_rubric[seed["rubric_ids"][0]] == 9
    assert scores_by_rubric[seed["rubric_ids"][1]] == 15


def test_ta_without_can_grade_is_blocked_on_shared_manual_score(isolated_db):
    session_local, seed = isolated_db

    db = session_local()
    ta_enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == seed["course_id"],
        Enrollment.user_id == 2,
        Enrollment.role == "ta",
    ).first()
    db.add(TAPermission(enrollment_id=ta_enrollment.id, can_grade=False))
    db.commit()
    db.close()

    ta_user = User(id=2, name="TA", email="ta@example.com", password_hash="x", role="student", is_active=True)
    client = _client(session_local, ta_user)

    resp = client.patch(
        f"/api/grading/submissions/{seed['submission_id']}/score",
        json={"score": 10, "max_score": 25, "feedback": "Attempted grade"},
    )

    assert resp.status_code == 403
    assert "cannot grade submissions" in resp.json()["detail"].lower()
