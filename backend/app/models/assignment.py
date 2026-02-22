from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Assignment configuration
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    max_submissions = Column(Integer, nullable=True)  # None = unlimited
    allowed_languages = Column(String, nullable=True)  # Comma-separated: "python,java,cpp"
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    course = relationship("Course", back_populates="assignments")
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")
    testcases = relationship("TestCase", back_populates="assignment", cascade="all, delete-orphan")
    rubrics = relationship("Rubric", back_populates="assignment", cascade="all, delete-orphan")
