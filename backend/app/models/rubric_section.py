from sqlalchemy import Column, Integer, ForeignKey, String, Text, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class RubricSection(Base):
    __tablename__ = "rubric_sections"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False, index=True)

    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    weight = Column(Float, nullable=True, default=1.0)
    order = Column(Integer, nullable=True, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    assignment = relationship("Assignment", back_populates="rubric_sections")
    criteria = relationship("RubricCriterion", back_populates="section", cascade="all, delete-orphan")


class RubricCriterion(Base):
    __tablename__ = "rubric_criteria"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("rubric_sections.id"), nullable=False, index=True)

    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    weight = Column(Float, nullable=True, default=1.0)
    max_points = Column(Integer, nullable=True, default=10)
    grading_method = Column(String, nullable=False, default="manual")
    order = Column(Integer, nullable=True, default=0)
    # JSON map of grade level → default comment, e.g. {"5":"Excellent","4":"Good",...}
    default_comments = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    section = relationship("RubricSection", back_populates="criteria")
