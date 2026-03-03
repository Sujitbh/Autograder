from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
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
    q = db.query(Assignment)
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
    db.flush()  # Flush to get the assignment ID before creating test cases
    
    # Create public test cases
    if payload.publicTests:
        for test_data in payload.publicTests:
            test_case = TestCase(
                assignment_id=assignment.id,
                name=test_data.name,
                input_data=test_data.input_data,
                expected_output=test_data.expected_output,
                is_public=True,
                points=test_data.points,
            )
            db.add(test_case)
    
    # Create private test cases
    if payload.privateTests:
        for test_data in payload.privateTests:
            test_case = TestCase(
                assignment_id=assignment.id,
                name=test_data.name,
                input_data=test_data.input_data,
                expected_output=test_data.expected_output,
                is_public=False,
                points=test_data.points,
            )
            db.add(test_case)
    
    # Persist rubric criteria
    if hasattr(payload, 'rubric') and payload.rubric:
        for idx, rc in enumerate(payload.rubric):
            db.add(Rubric(
                assignment_id=assignment.id,
                name=rc.name,
                description=rc.description,
                max_points=getattr(rc, 'maxPoints', 10) or 10,
                weight=1.0,
                order=idx,
            ))
    
    db.commit()
    db.refresh(assignment)
    return assignment


@router.get("/{assignment_id}", response_model=AssignmentOut)
def get_assignment(assignment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
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
