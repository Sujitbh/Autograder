"""
Schemas for TA Invitation API endpoints.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TAInvitationCreate(BaseModel):
    """Schema for creating a TA invitation."""
    student_id: int


class TAInvitationResponse(BaseModel):
    """Schema for TA invitation response."""
    action: str  # "accept" or "decline"


class TAInvitationOut(BaseModel):
    """Schema for TA invitation output."""
    id: int
    course_id: int
    student_id: int
    faculty_id: int
    status: str  # pending, accepted, declined
    created_at: datetime
    responded_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TAInvitationWithDetails(TAInvitationOut):
    """Extended schema with course and instructor details."""
    course_name: str
    course_code: str
    instructor_name: str
    student_name: str
