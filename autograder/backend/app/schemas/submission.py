"""
Submission schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class SubmissionBase(BaseModel):
    """Base submission schema."""
    assignment_id: int
    student_id: int


class SubmissionCreate(SubmissionBase):
    """Schema for creating a submission."""
    pass


class SubmissionFileOut(BaseModel):
    """Schema for submission file output."""
    id: int
    filename: str
    file_size: Optional[int] = None

    class Config:
        from_attributes = True


class SubmissionOut(SubmissionBase):
    """Schema for submission output."""
    id: int
    status: Optional[str] = "pending"
    score: Optional[int] = None
    max_score: Optional[int] = None
    feedback: Optional[str] = None
    graded_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SubmissionWithFiles(SubmissionOut):
    """Submission with file details."""
    files: List[SubmissionFileOut] = []


class SubmissionResultOut(BaseModel):
    """Schema for individual test result."""
    id: int
    testcase_id: Optional[int] = None
    passed: bool
    output: Optional[str] = None
    error_output: Optional[str] = None
    points_awarded: Optional[int] = None
    execution_time_ms: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SubmissionGradingResult(BaseModel):
    """Schema for full grading result."""
    submission_id: int
    status: str
    score: Optional[int] = None
    max_score: Optional[int] = None
    percentage: Optional[float] = None
    feedback: List[str] = []
    test_results: Optional[dict] = None
    rubric_results: Optional[dict] = None
