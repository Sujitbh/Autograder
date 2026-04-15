"""Schemas for course-level default rubric (JSON storage + API)."""

from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field, model_validator


class CourseDefaultRubricCriterion(BaseModel):
    name: str = Field(min_length=1)
    description: str = ""
    maxPoints: int = Field(default=5, ge=0, le=1000)
    weight: float = Field(default=10.0, ge=0, le=100)
    gradingMethod: Literal["auto", "manual", "hybrid"] = "manual"
    defaultComments: Optional[Dict[str, str]] = None


class CourseDefaultRubricSection(BaseModel):
    name: str = Field(min_length=1)
    description: str = ""
    weight: float = Field(ge=0, le=1000)
    criteria: List[CourseDefaultRubricCriterion] = Field(default_factory=list)


class CourseDefaultRubricPut(BaseModel):
    rubricMode: Literal["weighted", "unweighted"] = "weighted"
    weightPolicy: Literal["percent", "points"] = "percent"
    pointBudget: float = Field(default=100.0, gt=0, le=10_000)
    sections: List[CourseDefaultRubricSection]
    autoNormalize: bool = True

    @model_validator(mode="after")
    def require_sections(self):
        if not self.sections:
            raise ValueError("sections must contain at least one rubric section")
        for sec in self.sections:
            if not sec.criteria:
                raise ValueError(f'Section "{sec.name}" must include at least one criterion')
        return self


class CourseDefaultRubricOut(BaseModel):
    rubricMode: str = "weighted"
    weightPolicy: str = "percent"
    pointBudget: float = 100.0
    sections: List[CourseDefaultRubricSection]
    isBuiltin: bool = False
    updatedAt: Optional[datetime] = None
    updatedByUserId: Optional[int] = None
    updatedByName: Optional[str] = None


class AssignmentRubricReplaceBody(BaseModel):
    """Replace all rubric sections/criteria on an assignment."""

    rubricMode: Optional[Literal["weighted", "unweighted"]] = None
    rubric: List[CourseDefaultRubricSection] = Field(min_length=1)

    @model_validator(mode="after")
    def criteria_nonempty(self):
        for sec in self.rubric:
            if not sec.criteria:
                raise ValueError(f'Section "{sec.name}" must include at least one criterion')
        return self
