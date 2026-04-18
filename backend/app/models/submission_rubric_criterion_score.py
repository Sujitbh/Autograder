from sqlalchemy import Column, Integer, ForeignKey, String, Text, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class SubmissionRubricCriterionScore(Base):
    """Score awarded for each rubric criterion when grading a submission."""
    __tablename__ = "submission_rubric_criterion_scores"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    criterion_id = Column(Integer, ForeignKey("rubric_criteria.id"), nullable=False, index=True)
    grader_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Grading values
    grade = Column(Integer, nullable=False, default=0)  # 0-5 scale
    percent_weight = Column(Float, nullable=False, default=0)  # 1-100%
    points_awarded = Column(Float, nullable=False, default=0)  # Calculated: (grade/5) * max_points * (weight/100)
    feedback = Column(Text, nullable=True)  # Instructor comment

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    submission = relationship("Submission", back_populates="rubric_criterion_scores")
    criterion = relationship("RubricCriterion")
    grader = relationship("User")
