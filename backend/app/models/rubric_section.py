from sqlalchemy import Column, Integer, ForeignKey, String, Text, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class RubricSection(Base):
    __tablename__ = "rubric_sections"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False, index=True)
    
    name = Column(String, nullable=False)  # e.g., "Correctness"
    description = Column(Text, nullable=True)
    weight = Column(Float, nullable=True, default=1.0)  # Section weight multiplier
    order = Column(Integer, nullable=True, default=0)  # Display order

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    assignment = relationship("Assignment", back_populates="rubric_sections")
    criteria = relationship("RubricCriterion", back_populates="section", cascade="all, delete-orphan")


class RubricCriterion(Base):
    __tablename__ = "rubric_criteria"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("rubric_sections.id"), nullable=False, index=True)
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    weight = Column(Float, nullable=True, default=1.0)  # Criterion weight multiplier
    max_points = Column(Integer, nullable=True, default=10)
    grading_method = Column(String, nullable=False, default="manual")  # auto, manual, hybrid
    order = Column(Integer, nullable=True, default=0)  # Display order

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    section = relationship("RubricSection", back_populates="criteria")
