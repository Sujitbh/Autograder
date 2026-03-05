from pydantic import BaseModel
from typing import Optional


class TestCaseBase(BaseModel):
    name: Optional[str] = None
    input_data: Optional[str] = None
    expected_output: Optional[str] = None
    is_public: Optional[bool] = False
    points: Optional[int] = 1


class TestCaseCreate(TestCaseBase):
    assignment_id: int


class TestCaseUpdate(TestCaseBase):
    pass


class TestCaseOut(TestCaseBase):
    id: int
    assignment_id: int

    class Config:
        from_attributes = True


class TestCasePublicOut(BaseModel):
    """Schema for test cases visible to students — hides expected_output for public tests."""
    id: int
    assignment_id: int
    name: Optional[str] = None
    input_data: Optional[str] = None
    expected_output: Optional[str] = None
    is_public: bool = True
    points: Optional[int] = 1

    class Config:
        from_attributes = True
