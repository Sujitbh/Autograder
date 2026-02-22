from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.testcase import TestCase
from app.schemas.testcase import TestCaseCreate, TestCaseOut, TestCaseUpdate

router = APIRouter(prefix="/testcases", tags=["testcases"])


@router.get("/", response_model=List[TestCaseOut])
def list_testcases(db: Session = Depends(get_db)):
    return db.query(TestCase).all()


@router.post("/", response_model=TestCaseOut)
def create_testcase(payload: TestCaseCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tc = TestCase(
        assignment_id=payload.assignment_id,
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
def get_testcase(tc_id: int, db: Session = Depends(get_db)):
    tc = db.query(TestCase).filter(TestCase.id == tc_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="TestCase not found")
    return tc


@router.put("/{tc_id}", response_model=TestCaseOut)
def update_testcase(tc_id: int, payload: TestCaseUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tc = db.query(TestCase).filter(TestCase.id == tc_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="TestCase not found")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(tc, k, v)
    db.add(tc)
    db.commit()
    db.refresh(tc)
    return tc


@router.delete("/{tc_id}")
def delete_testcase(tc_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tc = db.query(TestCase).filter(TestCase.id == tc_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="TestCase not found")
    db.delete(tc)
    db.commit()
    return {"ok": True}
