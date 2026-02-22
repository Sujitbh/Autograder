from sqlalchemy import Column, Integer, ForeignKey, String, Text, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Rubric(Base):
    __tablename__ = "rubrics"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False, index=True)
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    weight = Column(Float, nullable=True, default=1.0)
    max_points = Column(Integer, nullable=True, default=10)
    order = Column(Integer, nullable=True, default=0)  # Display order

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    assignment = relationship("Assignment", back_populates="rubrics")
