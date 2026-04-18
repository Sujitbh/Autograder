import json as _json
from pydantic import BaseModel, field_validator
from typing import Dict, Optional, List
from datetime import datetime


# ── Criterion Score Schema (for submission grading) ─────────────────

class RubricCriterionScoreBase(BaseModel):
    grade: int  # 0-5
    percent_weight: float  # 1-100%
    points_awarded: float
    feedback: Optional[str] = None


class RubricCriterionScoreCreate(RubricCriterionScoreBase):
    criterion_id: int


class RubricCriterionScoreUpdate(RubricCriterionScoreBase):
    pass


class RubricCriterionScoreOut(RubricCriterionScoreBase):
    id: int
    submission_id: int
    criterion_id: int
    grader_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Criterion Schema ────────────────────────────────────────────────

class RubricCriterionBase(BaseModel):
    name: str
    description: Optional[str] = None
    weight: Optional[float] = None
    max_points: Optional[int] = None
    grading_method: Optional[str] = "manual"
    default_comments: Optional[Dict[str, str]] = None


class RubricCriterionCreate(RubricCriterionBase):
    pass


class RubricCriterionUpdate(RubricCriterionBase):
    pass


class RubricCriterionOut(RubricCriterionBase):
    id: int
    section_id: int

    @field_validator("default_comments", mode="before")
    @classmethod
    def _parse_json_string(cls, v):
        if isinstance(v, str):
            try:
                return _json.loads(v)
            except _json.JSONDecodeError:
                return None
        return v

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

