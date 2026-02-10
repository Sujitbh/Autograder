from sqlalchemy import Column, Integer, ForeignKey, Boolean, Text, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class SubmissionResult(Base):
    __tablename__ = "submission_results"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False, index=True)
    testcase_id = Column(Integer, ForeignKey("testcases.id"), nullable=True, index=True)
    
    passed = Column(Boolean, nullable=False, default=False)
    output = Column(Text, nullable=True)  # Actual output from execution
    error_output = Column(Text, nullable=True)  # stderr
    points_awarded = Column(Integer, nullable=True)
    execution_time_ms = Column(Float, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    submission = relationship("Submission", back_populates="results")
    testcase = relationship("TestCase", back_populates="results")
