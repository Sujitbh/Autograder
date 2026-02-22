from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, BigInteger
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class SubmissionFile(Base):
    __tablename__ = "submission_files"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False, index=True)

    filename = Column(String, nullable=False)   # Original filename
    path = Column(String, nullable=False)       # Storage path on disk
    file_size = Column(BigInteger, nullable=True)  # Size in bytes
    content_type = Column(String, nullable=True)   # MIME type

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    submission = relationship("Submission", back_populates="files")
