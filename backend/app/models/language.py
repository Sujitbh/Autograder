from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    file_extension = Column(String, nullable=True)
    docker_image = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
