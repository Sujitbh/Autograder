from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .auth import UserOut
from .course import CourseOut

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    receiver_id: int
    course_id: Optional[int] = None
    assignment_id: Optional[int] = None

class MessageUpdate(BaseModel):
    is_read: bool

class MessageOut(MessageBase):
    id: int
    sender_id: int
    receiver_id: int
    course_id: Optional[int] = None
    assignment_id: Optional[int] = None
    is_read: bool
    created_at: datetime
    updated_at: datetime
    
    sender: Optional[UserOut] = None
    receiver: Optional[UserOut] = None

    class Config:
        from_attributes = True

class ConversationThreadOut(BaseModel):
    interlocutor: UserOut
    course: Optional[CourseOut] = None
    last_message: MessageOut
    unread_count: int
