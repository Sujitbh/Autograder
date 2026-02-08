from sqlalchemy import Column, Integer, ForeignKey, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class SubmissionResult(Base):
    __tablename__ = "submission_results"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False, index=True)
    testcase_id = Column(Integer, ForeignKey("testcases.id"), nullable=True, index=True)
    passed = Column(Boolean, nullable=False, default=False)
    output = Column(Text, nullable=True)
    points_awarded = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
