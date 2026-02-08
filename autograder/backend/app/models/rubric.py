from sqlalchemy import Column, Integer, ForeignKey, String, Text, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Rubric(Base):
    __tablename__ = "rubrics"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    weight = Column(Float, nullable=True)
    max_points = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
