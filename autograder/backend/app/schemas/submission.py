from pydantic import BaseModel
from typing import Optional, List


class SubmissionBase(BaseModel):
    assignment_id: int
    student_id: int


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionOut(SubmissionBase):
    id: int
    created_at: Optional[str]

    class Config:
        orm_mode = True
