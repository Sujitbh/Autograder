from pydantic import BaseModel
from typing import Optional


class TestCaseBase(BaseModel):
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
        orm_mode = True
