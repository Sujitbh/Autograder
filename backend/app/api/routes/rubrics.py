from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_course_role
from app.models.assignment import Assignment
from app.models.rubric import Rubric
from app.models.user import User
from app.schemas.rubric import RubricCreate, RubricOut, RubricUpdate

router = APIRouter(prefix="/rubrics", tags=["rubrics"])


def _get_assignment_or_404(db: Session, assignment_id: int) -> Assignment:
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.get("/", response_model=List[RubricOut])
def list_rubrics(
    assignment_id: Optional[int] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Rubric)
    if assignment_id is not None:
        assignment = _get_assignment_or_404(db, assignment_id)
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta", "student"],
        )
        q = q.filter(Rubric.assignment_id == assignment_id)
    return q.order_by(Rubric.order.asc(), Rubric.id.asc()).all()


@router.post("/", response_model=RubricOut)
def create_rubric(
    payload: RubricCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = _get_assignment_or_404(db, payload.assignment_id)
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])
    r = Rubric(
        assignment_id=payload.assignment_id,
        name=payload.name,
        description=payload.description,
        weight=payload.weight,
        max_points=payload.max_points,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


@router.get("/{r_id}", response_model=RubricOut)
def get_rubric(r_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    r = db.query(Rubric).filter(Rubric.id == r_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Rubric not found")
    return r


@router.put("/{r_id}", response_model=RubricOut)
def update_rubric(
    r_id: int,
    payload: RubricUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    r = db.query(Rubric).filter(Rubric.id == r_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Rubric not found")
    assignment = _get_assignment_or_404(db, r.assignment_id)
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


@router.delete("/{r_id}")
def delete_rubric(
    r_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    r = db.query(Rubric).filter(Rubric.id == r_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Rubric not found")
    assignment = _get_assignment_or_404(db, r.assignment_id)
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])
    db.delete(r)
    db.commit()
    return {"ok": True}
