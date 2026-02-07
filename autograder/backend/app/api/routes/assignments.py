from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role
from app.models.assignment import Assignment
from app.models.user import User
from app.schemas.assignment import AssignmentCreate

router = APIRouter(prefix="/assignments", tags=["assignments"])

@router.post("")
def create_assignment(payload: AssignmentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    require_role(user.role, {"faculty", "admin"})

    a = Assignment(title=payload.title, description=payload.description)
    db.add(a)
    db.commit()
    db.refresh(a)
    return {"id": a.id, "title": a.title}
