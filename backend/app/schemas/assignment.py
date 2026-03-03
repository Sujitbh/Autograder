"""
Assignment schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class AssignmentCreate(BaseModel):
    """Schema for creating an assignment."""
    title: str
    description: Optional[str] = None
    course_id: Optional[int] = None
    due_date: Optional[datetime] = None
    max_submissions: Optional[int] = None
    max_points: Optional[int] = 100
    allowed_languages: Optional[str] = None  # Comma-separated: "python,java,cpp"
    status: Optional[str] = "published"  # draft | published | closed


class AssignmentUpdate(BaseModel):
    """Schema for updating an assignment."""
    title: Optional[str] = None
    description: Optional[str] = None
    course_id: Optional[int] = None
    due_date: Optional[datetime] = None
    max_submissions: Optional[int] = None
    max_points: Optional[int] = None
    allowed_languages: Optional[str] = None
    status: Optional[str] = None
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
    max_points: Optional[int] = None
    allowed_languages: Optional[str] = None
    status: str = "published"
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AssignmentWithStats(AssignmentOut):
    """Assignment with submission statistics."""
    total_submissions: int = 0
    graded_submissions: int = 0
    average_score: Optional[float] = None
