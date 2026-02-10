from sqlalchemy import Column, Integer, ForeignKey, Text, Boolean, DateTime, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class TestCase(Base):
    __tablename__ = "testcases"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False, index=True)
    
    name = Column(String, nullable=True)  # Optional name for the test case
    input_data = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    is_public = Column(Boolean, nullable=False, default=False)  # Visible to students?
    points = Column(Integer, nullable=False, default=1)
    timeout_seconds = Column(Integer, nullable=True, default=10)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    assignment = relationship("Assignment", back_populates="testcases")
    results = relationship("SubmissionResult", back_populates="testcase")
