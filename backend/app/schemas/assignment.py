"""
Assignment schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class TestCaseData(BaseModel):
    """Nested test case in assignment creation."""
    name: Optional[str] = None
    input_data: Optional[str] = None
    expected_output: Optional[str] = None
    is_public: bool = False
    points: int = 1


class AssignmentCreate(BaseModel):
    """Schema for creating an assignment."""
    title: str
    description: Optional[str] = None
    course_id: Optional[int] = None
    due_date: Optional[datetime] = None
    max_submissions: Optional[int] = None  # None = unlimited
    allowed_languages: Optional[str] = None  # Comma-separated: "python,java,cpp"
    publicTests: Optional[List[TestCaseData]] = None
    privateTests: Optional[List[TestCaseData]] = None


class AssignmentUpdate(BaseModel):
    """Schema for updating an assignment."""
    title: Optional[str] = None
    description: Optional[str] = None
    course_id: Optional[int] = None
    due_date: Optional[datetime] = None
    max_submissions: Optional[int] = None
    allowed_languages: Optional[str] = None
    is_active: Optional[bool] = None


class AssignmentOut(BaseModel):
    """Schema for assignment output."""
    id: int
    title: str
    description: Optional[str] = None
    course_id: Optional[int] = None
    created_by: Optional[int] = None
    due_date: Optional[datetime] = None
    max_submissions: Optional[int] = None
    allowed_languages: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AssignmentWithStats(AssignmentOut):
    """Assignment with submission statistics."""
    total_submissions: int = 0
    graded_submissions: int = 0
    average_score: Optional[float] = None
