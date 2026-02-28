from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr


class CourseBase(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None


class CourseCreate(CourseBase):
    enrollment_code_active: bool = True


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    enrollment_code_active: Optional[bool] = None


class CourseOut(CourseBase):
    id: int
    enrollment_code: Optional[str] = None
    enrollment_code_active: bool = True
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EnrollmentUserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class EnrollmentCreate(BaseModel):
    user_id: Optional[int] = None
    email: Optional[EmailStr] = None
    role: Literal["student", "ta", "instructor"] = "student"


class EnrollmentUpdate(BaseModel):
    role: Literal["student", "ta", "instructor"]


class EnrollmentOut(BaseModel):
    id: int
    course_id: int
    user_id: int
    role: str
    created_at: Optional[datetime] = None
    user: Optional[EnrollmentUserOut] = None

    class Config:
        from_attributes = True


class CourseEnrollRequest(BaseModel):
    enrollmentCode: str
