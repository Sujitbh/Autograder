from datetime import datetime, timedelta

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
    now = datetime.utcnow()
    db.add_all([
        User(id=1, name="Instructor", email="inst@example.com", password_hash="x", role="faculty", is_active=True),
        User(id=2, name="Student A", email="a@example.com", password_hash="x", role="student", is_active=True),
        User(id=3, name="Student B", email="b@example.com", password_hash="x", role="student", is_active=True),
        Course(id=10, name="CS 101", code="CS101", faculty_id=1),
        Enrollment(course_id=10, user_id=1, role="instructor"),
        Enrollment(course_id=10, user_id=2, role="student"),
        Enrollment(course_id=10, user_id=3, role="student"),
        Assignment(id=20, title="Graded Assignment", course_id=10, max_points=100, due_date=now - timedelta(days=2)),
        Assignment(id=21, title="Ungraded Assignment", course_id=10, max_points=50, due_date=now - timedelta(days=1)),
        Assignment(id=22, title="Missing Assignment", course_id=10, max_points=75, due_date=now - timedelta(days=3)),
        Assignment(id=23, title="Future Assignment", course_id=10, max_points=20, due_date=now + timedelta(days=3)),
        Submission(id=30, assignment_id=20, student_id=2, status="graded", score=92, max_score=100),
        Submission(id=31, assignment_id=21, student_id=2, status="pending"),
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



def test_course_gradebook_returns_explicit_assignment_statuses(isolated_db):
    instructor = User(id=1, name="Instructor", email="inst@example.com", password_hash="x", role="faculty", is_active=True)
    client = _client(isolated_db, instructor)

    response = client.get("/api/courses/10/grades")
    assert response.status_code == 200

    data = response.json()
    student_a = next(student for student in data["students"] if student["id"] == 2)
    student_b = next(student for student in data["students"] if student["id"] == 3)

    assert student_a["grades"]["20"]["status"] == "graded"
    assert student_a["grades"]["20"]["score"] == 92.0
    assert student_a["grades"]["21"]["status"] == "ungraded"
    assert student_a["grades"]["21"]["score"] is None
    assert student_a["grades"]["22"]["status"] == "missing"
    assert student_a["grades"]["23"]["status"] == "not_submitted"

    assert student_b["grades"]["20"]["status"] == "missing"
    assert student_b["grades"]["23"]["status"] == "not_submitted"
