"""
Submission service for handling code submissions.
"""

import os
from pathlib import Path
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile

from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.user import User
from app.models.assignment import Assignment
from app.settings import settings


# Allowed file extensions for code submissions
ALLOWED_EXTENSIONS = {
    ".py", ".java", ".cpp", ".c", ".js", ".ts",
    ".rb", ".go", ".rs", ".swift", ".kt", ".scala",
    ".h", ".hpp", ".cs", ".php", ".pl", ".r",
    ".txt", ".json", ".xml", ".yaml", ".yml",
    ".md", ".sql", ".sh", ".bash",
}

# Maximum file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024


class SubmissionService:
    """Service for submission-related operations."""

    @staticmethod
    def get(db: Session, submission_id: int) -> Optional[Submission]:
        """Get submission by ID."""
        return db.query(Submission).filter(Submission.id == submission_id).first()

    @staticmethod
    def get_or_404(db: Session, submission_id: int) -> Submission:
        """Get submission by ID or raise 404."""
        submission = SubmissionService.get(db, submission_id)
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found",
            )
        return submission

    @staticmethod
    def get_by_assignment(
        db: Session,
        assignment_id: int,
        *,
        student_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Submission]:
        """Get submissions for an assignment."""
        query = db.query(Submission).filter(
            Submission.assignment_id == assignment_id
        )
        if student_id:
            query = query.filter(Submission.student_id == student_id)
        return query.order_by(Submission.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_student(
        db: Session,
        student_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Submission]:
        """Get all submissions by a student."""
        return (
            db.query(Submission)
            .filter(Submission.student_id == student_id)
            .order_by(Submission.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def validate_file(file: UploadFile) -> tuple[bool, str]:
        """
        Validate uploaded file.
        
        Returns:
            Tuple of (is_valid: bool, error_message: str)
        """
        if not file.filename:
            return False, "Filename is required"

        # Check extension
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            return False, f"File type '{ext}' not allowed. Allowed: {ALLOWED_EXTENSIONS}"

        # Check size (if content-length available)
        if file.size and file.size > MAX_FILE_SIZE:
            return False, f"File too large. Maximum size: {MAX_FILE_SIZE // 1024 // 1024}MB"

        return True, "OK"

    @staticmethod
    def _safe_folder_name(s: str) -> str:
        """Create safe folder name from string."""
        return "".join(
            ch if ch.isalnum() or ch in ("@", ".", "_", "-") else "_"
            for ch in s
        )

    @staticmethod
    async def create_with_files(
        db: Session,
        assignment: Assignment,
        student: User,
        files: List[UploadFile],
    ) -> dict:
        """
        Create a submission with uploaded files.
        
        Args:
            db: Database session
            assignment: Assignment to submit to
            student: Student making submission
            files: List of uploaded files
            
        Returns:
            Dict with submission details
            
        Raises:
            HTTPException: If validation fails
        """
        # Validate all files first
        for file in files:
            is_valid, error = SubmissionService.validate_file(file)
            if not is_valid:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid file '{file.filename}': {error}",
                )

        # Create submission record
        submission = Submission(
            assignment_id=assignment.id,
            student_id=student.id,
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)

        # Create storage directory
        root = Path(settings.DATA_ROOT)
        student_folder = SubmissionService._safe_folder_name(student.email)
        dest_dir = root / f"assignment_{assignment.id}" / student_folder / f"submission_{submission.id}"
        dest_dir.mkdir(parents=True, exist_ok=True)

        # Save files
        saved_files = []
        for file in files:
            if not file.filename:
                continue

            # Prevent path traversal attacks
            filename = os.path.basename(file.filename)
            dest_path = dest_dir / filename

            # Read and save content
            content = await file.read()
            
            # Double-check size after reading
            if len(content) > MAX_FILE_SIZE:
                # Rollback submission
                db.delete(submission)
                db.commit()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File '{filename}' exceeds maximum size",
                )

            dest_path.write_bytes(content)

            # Create file record
            file_record = SubmissionFile(
                submission_id=submission.id,
                filename=filename,
                path=str(dest_path),
            )
            db.add(file_record)
            saved_files.append(filename)

        db.commit()

        return {
            "submission_id": submission.id,
            "assignment_id": assignment.id,
            "student_email": student.email,
            "files_saved": saved_files,
            "submitted_at": submission.created_at,
            "folder": str(dest_dir),
        }

    @staticmethod
    def get_files(db: Session, submission_id: int) -> List[SubmissionFile]:
        """Get all files for a submission."""
        return (
            db.query(SubmissionFile)
            .filter(SubmissionFile.submission_id == submission_id)
            .all()
        )

    @staticmethod
    def delete(db: Session, submission_id: int) -> bool:
        """Delete a submission and its files."""
        submission = SubmissionService.get_or_404(db, submission_id)

        # Delete physical files
        files = SubmissionService.get_files(db, submission_id)
        for file in files:
            if os.path.exists(file.path):
                os.remove(file.path)
            db.delete(file)

        db.delete(submission)
        db.commit()
        return True

    @staticmethod
    def get_latest_submission(
        db: Session,
        assignment_id: int,
        student_id: int,
    ) -> Optional[Submission]:
        """Get the most recent submission for a student on an assignment."""
        return (
            db.query(Submission)
            .filter(
                Submission.assignment_id == assignment_id,
                Submission.student_id == student_id,
            )
            .order_by(Submission.created_at.desc())
            .first()
        )
