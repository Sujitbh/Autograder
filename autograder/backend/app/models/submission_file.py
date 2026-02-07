from sqlalchemy import Column, Integer, ForeignKey, String
from app.core.database import Base

class SubmissionFile(Base):
    __tablename__ = "submission_files"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False, index=True)

    filename = Column(String, nullable=False)   # original filename
    path = Column(String, nullable=False)       # where we stored it on disk
