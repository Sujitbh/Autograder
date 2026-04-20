"""
Assignment schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.rubric import RubricSectionOut


# ── Inline test-case / rubric schemas for nested creation ────────────

class TestCaseInline(BaseModel):
    """Test case embedded inside an assignment creation payload."""
    name: Optional[str] = None
    input: Optional[str] = None          # maps to input_data column
    expectedOutput: Optional[str] = None  # maps to expected_output column
    isPublic: Optional[bool] = False
    points: Optional[int] = 1

class RubricInline(BaseModel):
    """Rubric criterion embedded inside an assignment creation payload."""
    name: str
    description: Optional[str] = None
    maxPoints: Optional[int] = 10
    weight: Optional[float] = 1.0
    gradingMethod: Optional[str] = None
    defaultComments: Optional[dict[str, str]] = None


class RubricSectionInline(BaseModel):
    """Rubric section embedded inside assignment creation payload."""
    name: str
    description: Optional[str] = None
    weight: Optional[float] = 100.0
    criteria: List[RubricInline] = []


class AssignmentCreate(BaseModel):
    """Schema for creating an assignment."""
    title: str
    description: Optional[str] = None
    course_id: Optional[int] = None
    due_date: Optional[datetime] = None
    max_submissions: Optional[int] = None
    max_points: Optional[int] = 100
    rubric_mode: Optional[str] = "unweighted"
    grading_strategy: Optional[str] = "latest"  # latest | best
    allowed_languages: Optional[str] = None  # Comma-separated: "python,java,cpp"
    starter_code: Optional[str] = None  # Faculty-provided starter code template
    status: Optional[str] = "published"  # draft | published | closed
    ai_detection_enabled: Optional[bool] = True
    auto_flag_enabled: Optional[bool] = True
    # Stored as fraction [0.0, 1.0]
    auto_flag_threshold: Optional[float] = 0.70
    # Nested test cases & rubric (optional — sent from the assignment creation form)
    public_tests: Optional[List[TestCaseInline]] = None
    private_tests: Optional[List[TestCaseInline]] = None
    rubric: Optional[List[RubricSectionInline]] = None


class AssignmentUpdate(BaseModel):
    """Schema for updating an assignment."""
    title: Optional[str] = None
    description: Optional[str] = None
    course_id: Optional[int] = None
    due_date: Optional[datetime] = None
    max_submissions: Optional[int] = None
    max_points: Optional[int] = None
    rubric_mode: Optional[str] = None
    grading_strategy: Optional[str] = None
    allowed_languages: Optional[str] = None
    starter_code: Optional[str] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None
    ai_detection_enabled: Optional[bool] = None
    auto_flag_enabled: Optional[bool] = None
    auto_flag_threshold: Optional[float] = None


class AssignmentRubricOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    weight: Optional[float] = None
    max_points: Optional[int] = None
    order: Optional[int] = None

    class Config:
        from_attributes = True


class AssignmentOut(BaseModel):
    """Schema for assignment output."""
    id: int
    title: str
    description: Optional[str] = None
    course_id: Optional[int] = None
    created_by: Optional[int] = None
    due_date: Optional[datetime] = None
    max_submissions: Optional[int] = None
    max_points: Optional[int] = None
    rubric_mode: str = "unweighted"
    grading_strategy: str = "latest"
    allowed_languages: Optional[str] = None
    starter_code: Optional[str] = None
    status: str = "published"
    is_active: bool = True
    ai_detection_enabled: bool = True
    auto_flag_enabled: bool = True
    auto_flag_threshold: float = 0.70
    created_at: Optional[datetime] = None
    # Keep API key as "rubrics" but source data via Assignment.rubrics_out.
    rubrics: List[RubricSectionOut] = Field(default_factory=list, validation_alias="rubrics_out")

    class Config:
        from_attributes = True


class AssignmentWithStats(AssignmentOut):
    """Assignment with submission statistics."""
    total_submissions: int = 0
    graded_submissions: int = 0
    average_score: Optional[float] = None
