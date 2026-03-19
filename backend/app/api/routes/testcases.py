from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role, require_course_role
from app.models.assignment import Assignment
from app.models.testcase import TestCase
from app.models.user import User
from app.schemas.testcase import TestCaseCreate, TestCaseOut, TestCasePublicOut, TestCaseUpdate

router = APIRouter(prefix="/testcases", tags=["testcases"])


def _get_assignment_or_404(db: Session, assignment_id: int) -> Assignment:
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.get("/", response_model=List[TestCaseOut])
def list_testcases(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(TestCase)
    if user.role == "student":
        query = query.filter(TestCase.is_public == True)
    return query.all()


@router.get("/by-assignment/{assignment_id}", response_model=List[TestCaseOut])
def get_assignment_testcases(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get test cases for an assignment. Students only see public test cases."""
    query = db.query(TestCase).filter(TestCase.assignment_id == assignment_id)
    if user.role == "student":
        query = query.filter(TestCase.is_public == True)
    return query.all()


@router.post("/", response_model=TestCaseOut)
def create_testcase(
    payload: TestCaseCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = _get_assignment_or_404(db, payload.assignment_id)
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])
    tc = TestCase(
        assignment_id=payload.assignment_id,
        name=payload.name,
        input_data=payload.input_data,
        expected_output=payload.expected_output,
        is_public=payload.is_public,
        points=payload.points,
    )
    db.add(tc)
    db.commit()
    db.refresh(tc)
    return tc


@router.get("/{tc_id}", response_model=TestCaseOut)
def get_testcase(tc_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tc = db.query(TestCase).filter(TestCase.id == tc_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="TestCase not found")
    # Students cannot view private test cases
    if user.role == "student" and not tc.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    return tc


@router.put("/{tc_id}", response_model=TestCaseOut)
def update_testcase(
    tc_id: int,
    payload: TestCaseUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    tc = db.query(TestCase).filter(TestCase.id == tc_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="TestCase not found")
    assignment = _get_assignment_or_404(db, tc.assignment_id)
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(tc, k, v)
    db.add(tc)
    db.commit()
    db.refresh(tc)
    return tc


@router.delete("/{tc_id}")
def delete_testcase(
    tc_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    tc = db.query(TestCase).filter(TestCase.id == tc_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="TestCase not found")
    assignment = _get_assignment_or_404(db, tc.assignment_id)
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])
    db.delete(tc)
    db.commit()
    return {"ok": True}
