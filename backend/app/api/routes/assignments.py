from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional

from app.api.deps import get_db, get_current_user, get_current_user_optional
from app.core.permissions import require_role, require_course_role
from app.models.assignment import Assignment
from app.models.testcase import TestCase
from app.models.rubric import Rubric
from app.models.user import User
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentOut

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("/", response_model=List[AssignmentOut])
def list_assignments(
    course_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
):
    q = db.query(Assignment).options(selectinload(Assignment.rubrics))
    if course_id is not None:
        q = q.filter(Assignment.course_id == course_id)

    # Students should only see active assignments
    if user and user.role == "student":
        q = q.filter(Assignment.is_active == True)

    return q.all()


@router.post("/", response_model=AssignmentOut)
def create_assignment(
    payload: AssignmentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    require_role(user.role, {"faculty", "admin"})
    require_course_role(db=db, user=user, course_id=payload.course_id, allowed_roles=["instructor"])

    assignment = Assignment(
        title=payload.title,
        description=payload.description,
        course_id=payload.course_id,
        created_by=user.id,
        due_date=payload.due_date,
        max_submissions=payload.max_submissions,
        max_points=payload.max_points,
        allowed_languages=payload.allowed_languages,
        starter_code=payload.starter_code,
        status=payload.status or "published",
    )
    db.add(assignment)
    db.flush()  # get assignment.id before committing so we can create children

    # ── Persist test cases ──────────────────────────────────────────
    for tc in (payload.public_tests or []):
        db.add(TestCase(
            assignment_id=assignment.id,
            name=tc.name,
            input_data=tc.input,
            expected_output=tc.expectedOutput,
            is_public=True,
            points=tc.points or 1,
        ))
    for tc in (payload.private_tests or []):
        db.add(TestCase(
            assignment_id=assignment.id,
            name=tc.name,
            input_data=tc.input,
            expected_output=tc.expectedOutput,
            is_public=False,
            points=tc.points or 1,
        ))

    # ── Persist rubric criteria ─────────────────────────────────────
    for idx, rc in enumerate(payload.rubric or []):
        db.add(Rubric(
            assignment_id=assignment.id,
            name=rc.name,
            description=rc.description,
            max_points=rc.maxPoints or 10,
            weight=1.0,
            order=idx,
        ))

    db.commit()
    db.refresh(assignment)
    return assignment


@router.get("/{assignment_id}", response_model=AssignmentOut)
def get_assignment(assignment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    assignment = (
        db.query(Assignment)
        .options(selectinload(Assignment.rubrics))
        .filter(Assignment.id == assignment_id)
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.put("/{assignment_id}", response_model=AssignmentOut)
def update_assignment(
    assignment_id: int,
    payload: AssignmentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(assignment, k, v)
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])

    db.delete(assignment)
    db.commit()
    return {"ok": True}
