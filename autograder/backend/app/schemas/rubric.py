from pydantic import BaseModel
from typing import Optional


class RubricBase(BaseModel):
    name: str
    description: Optional[str] = None
    weight: Optional[float] = None
    max_points: Optional[int] = None


class RubricCreate(RubricBase):
    assignment_id: int


class RubricUpdate(RubricBase):
    pass


class RubricOut(RubricBase):
    id: int
    assignment_id: int

    class Config:
        from_attributes = True
