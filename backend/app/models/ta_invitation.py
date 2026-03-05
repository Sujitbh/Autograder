"""
TA Invitation model for grading assistant feature.
"""
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class TAInvitation(Base):
    __tablename__ = "ta_invitations"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String, nullable=False, default="pending")  # pending, accepted, declined

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    responded_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    course = relationship("Course", foreign_keys=[course_id])
    student = relationship("User", foreign_keys=[student_id])
    faculty = relationship("User", foreign_keys=[faculty_id])
