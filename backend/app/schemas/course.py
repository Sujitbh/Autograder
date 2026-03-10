from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, field_validator


class CourseBase(BaseModel):
    name: str
    code: Optional[str] = None
    section: Optional[str] = None
    description: Optional[str] = None


class CourseCreate(CourseBase):
    enrollment_code_active: bool = True


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    section: Optional[str] = None
    description: Optional[str] = None
    enrollment_code_active: Optional[bool] = None
    enrollment_policy: Optional[Literal['invite', 'code', 'both']] = None


class CourseOut(CourseBase):
    id: int
    enrollment_code: Optional[str] = None
    enrollment_code_active: bool = True
    enrollment_policy: str = 'invite'
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    student_count: int = 0
    assignment_count: int = 0
    pending_grades: int = 0

    class Config:
        from_attributes = True


class EnrollmentUserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    sis_user_id: Optional[str] = None

    @field_validator('sis_user_id', mode='before')
    @classmethod
    def strip_float_suffix(cls, v: object) -> object:
        if isinstance(v, str) and v.endswith('.0') and v[:-2].lstrip('-').isdigit():
            return v[:-2]
        return v

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


class EnrollmentImportRowOut(BaseModel):
    row_number: int
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    sis_login_id: Optional[str] = None
    sis_user_id: Optional[str] = None
    external_id: Optional[str] = None
    status: Literal["enrolled", "already_enrolled", "created_and_enrolled", "skipped", "error"]
    message: Optional[str] = None


class EnrollmentImportResult(BaseModel):
    total_rows: int
    enrolled_count: int
    already_enrolled_count: int
    created_users_count: int
    skipped_count: int
    rows: list[EnrollmentImportRowOut]
