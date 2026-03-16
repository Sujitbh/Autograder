from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class SubmissionRubricScore(Base):
    __tablename__ = "submission_rubric_scores"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    rubric_id = Column(Integer, ForeignKey("rubrics.id", ondelete="CASCADE"), nullable=False, index=True)
    grader_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    score_awarded = Column(Integer, nullable=False, default=0)
    feedback = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    submission = relationship("Submission", back_populates="rubric_scores")
    rubric = relationship("Rubric", back_populates="submission_scores")
    grader = relationship("User")
