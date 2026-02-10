from pydantic import BaseModel
from typing import Optional


class CourseBase(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(CourseBase):
    pass


class CourseOut(CourseBase):
    id: int

    class Config:
        from_attributes = True
