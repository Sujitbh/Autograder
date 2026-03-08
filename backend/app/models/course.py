from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=True, index=True)
    enrollment_code = Column(String, nullable=True, unique=True, index=True)
    enrollment_code_active = Column(Boolean, nullable=False, default=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    assignments = relationship("Assignment", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="course", cascade="all, delete-orphan")
    faculty = relationship("User")

    @property
    def student_count(self) -> int:
        return sum(1 for e in self.enrollments if e.role == "student")

    @property
    def assignment_count(self) -> int:
        return len(self.assignments)

    @property
    def pending_grades(self) -> int:
        count = 0
        for a in self.assignments:
            count += sum(1 for sub in a.submissions if sub.status == "pending" or sub.status == "submitted")
        return count
