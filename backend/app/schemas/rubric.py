from pydantic import BaseModel
from typing import Optional, List


# ── Criterion Schema ────────────────────────────────────────────────

class RubricCriterionBase(BaseModel):
    name: str
    description: Optional[str] = None
    weight: Optional[float] = None
    max_points: Optional[int] = None
    grading_method: Optional[str] = "manual"  # auto, manual, hybrid


class RubricCriterionCreate(RubricCriterionBase):
    pass


class RubricCriterionUpdate(RubricCriterionBase):
    pass


class RubricCriterionOut(RubricCriterionBase):
    id: int
    section_id: int

    class Config:
        from_attributes = True


# ── Section Schema ────────────────────────────────────────────────

class RubricSectionBase(BaseModel):
    name: str
    description: Optional[str] = None
    weight: Optional[float] = None


class RubricSectionCreate(RubricSectionBase):
    assignment_id: int
    criteria: Optional[List[RubricCriterionCreate]] = None


class RubricSectionUpdate(RubricSectionBase):
    criteria: Optional[List[RubricCriterionCreate]] = None


class RubricSectionOut(RubricSectionBase):
    id: int
    assignment_id: int
    criteria: List[RubricCriterionOut] = []

    class Config:
        from_attributes = True


# ── Legacy Rubric Schema (for backward compatibility) ────────────────

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

