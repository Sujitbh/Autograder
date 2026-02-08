from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.rubric import Rubric
from app.schemas.rubric import RubricCreate, RubricOut, RubricUpdate

router = APIRouter(prefix="/rubrics", tags=["rubrics"])


@router.get("/", response_model=List[RubricOut])
def list_rubrics(db: Session = Depends(get_db)):
    return db.query(Rubric).all()


@router.post("/", response_model=RubricOut)
def create_rubric(payload: RubricCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
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
def get_rubric(r_id: int, db: Session = Depends(get_db)):
    r = db.query(Rubric).filter(Rubric.id == r_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Rubric not found")
    return r


@router.put("/{r_id}", response_model=RubricOut)
def update_rubric(r_id: int, payload: RubricUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    r = db.query(Rubric).filter(Rubric.id == r_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Rubric not found")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(r, k, v)
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


@router.delete("/{r_id}")
def delete_rubric(r_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    r = db.query(Rubric).filter(Rubric.id == r_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Rubric not found")
    db.delete(r)
    db.commit()
    return {"ok": True}
