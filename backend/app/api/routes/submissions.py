import os
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role, require_course_role, get_course_enrollment_role
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionOut, SubmissionWithStudent
from app.services.file_preview_service import FilePreviewService
from app.settings import settings

router = APIRouter(prefix="/submissions", tags=["submissions"])


def safe_folder_name(s: str) -> str:
    """Keep it simple + safe for folders."""
    return "".join(ch if ch.isalnum() or ch in ("@", ".", "_", "-") else "_" for ch in s)


@router.get("/", response_model=List[SubmissionOut])
def list_submissions(db: Session = Depends(get_db)):
    return db.query(Submission).all()


@router.post("/", response_model=SubmissionOut)
def create_submission(
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = db.query(Assignment).filter(Assignment.id == payload.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["student"])

    s = Submission(assignment_id=payload.assignment_id, student_id=user.id)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@router.get("/{s_id}", response_model=SubmissionOut)
def get_submission(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )
    return s


@router.delete("/{s_id}")
def delete_submission(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor"],
        )
    db.delete(s)
    db.commit()
    return {"ok": True}


@router.get("/courses/{course_id}/for-grading")
def get_submissions_for_grading(
    course_id: int,
    assignment_id: int | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get all submissions in a course for grading (TA/instructor view).
    
    Requires user to be TA or instructor for the course.
    Optionally filter by assignment_id.
    
    Returns submissions with student details, files, and grading info.
    """
    from app.models.course import Course as CourseModel
    
    # Verify course exists
    course = db.query(CourseModel).filter(CourseModel.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check user is TA or instructor for this course
    require_course_role(
        db=db,
        user=user,
        course_id=course_id,
        allowed_roles=["instructor", "ta"],
    )
    
    # Get all assignments in the course
    assignments = db.query(Assignment).filter(
        Assignment.course_id == course_id
    ).all()
    
    if not assignments:
        return []
    
    assignment_ids = [a.id for a in assignments]
    if assignment_id is not None:
        assignment_ids = [assignment_id]
    
    # Get all submissions for these assignments
    submissions = db.query(Submission).filter(
        Submission.assignment_id.in_(assignment_ids)
    ).all()
    
    # Enrich with student and file details
    result = []
    for sub in submissions:
        student = db.query(User).filter(User.id == sub.student_id).first()
        files = db.query(SubmissionFile).filter(
            SubmissionFile.submission_id == sub.id
        ).all()
        
        # Get the assignment
        assignment = db.query(Assignment).filter(
            Assignment.id == sub.assignment_id
        ).first()
        
        result.append({
            "id": sub.id,
            "assignment_id": sub.assignment_id,
            "assignment_name": assignment.title if assignment else "Unknown",
            "student_id": sub.student_id,
            "student_name": student.name if student else "Unknown",
            "student_email": student.email if student else None,
            "status": sub.status,
            "score": sub.score,
            "max_score": sub.max_score,
            "feedback": sub.feedback,
            "graded_at": sub.graded_at,
            "created_at": sub.created_at,
            "files": [
                {"id": f.id, "filename": f.filename, "file_size": f.file_size}
                for f in files
            ],
        })
    
    return result


@router.get("/assignments/{assignment_id}")
def get_submissions_by_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get all submissions for a specific assignment."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    query = db.query(Submission).filter(Submission.assignment_id == assignment_id)

    # IMPORTANT: global role may be "student" even for course-level TAs.
    # Prioritize course enrollment role for this assignment's course.
    course_role = get_course_enrollment_role(db=db, user_id=user.id, course_id=assignment.course_id)

    # If user is not admin/instructor/ta for this course, restrict to own submissions.
    if user.role != "admin" and course_role not in {"instructor", "ta"}:
        query = query.filter(Submission.student_id == user.id)
        return query.all()
    
    # For instructor/ta/admin, return submissions with student details and files
    submissions = query.all()
    result = []
    for sub in submissions:
        student = db.query(User).filter(User.id == sub.student_id).first()
        files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == sub.id).all()
        
        result.append({
            "id": sub.id,
            "assignment_id": sub.assignment_id,
            "student_id": sub.student_id,
            "status": sub.status,
            "score": sub.score,
            "max_score": sub.max_score,
            "feedback": sub.feedback,
            "graded_at": sub.graded_at,
            "created_at": sub.created_at,
            "student": {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "student_id": getattr(student, "student_id", None),
            } if student else None,
            "files": [{"id": f.id, "filename": f.filename, "file_size": f.file_size} for f in files]
        })
    
    return result


@router.get("/{s_id}/files")
def get_submission_files(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get files for a submission."""
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )

    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s_id).all()
    return [{"id": f.id, "filename": f.filename, "file_size": f.file_size} for f in files]


@router.get("/files/{file_id}/download")
def download_submission_file(
    file_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Download a single submission file."""
    file_record = db.query(SubmissionFile).filter(SubmissionFile.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    submission = db.query(Submission).filter(Submission.id == file_record.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Check permissions
    if user.role != "admin" and submission.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )
    
    # Check if file exists on disk
    if not os.path.exists(file_record.path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=file_record.path,
        filename=file_record.filename,
        media_type="application/octet-stream"
    )


@router.get("/files/{file_id}/preview")
def preview_submission_file(
    file_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Get file content for preview.
    Returns file content with metadata for supported text/code files.
    """
    file_record = db.query(SubmissionFile).filter(SubmissionFile.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    submission = db.query(Submission).filter(Submission.id == file_record.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Check permissions - student can preview own files, TAs/instructors can preview all
    if user.role != "admin" and submission.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )
    
    # Check if file exists on disk
    if not os.path.exists(file_record.path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    # Check if file can be previewed
    if not FilePreviewService.can_preview(file_record.filename):
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported for preview: {file_record.filename}"
        )
    
    # Get file content
    try:
        preview_data = FilePreviewService.get_file_content(
            file_path=file_record.path,
            filename=file_record.filename
        )
        return preview_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to preview file: {str(e)}")


@router.post("/assignments/{assignment_id}/upload")
async def upload_submission_files(
    assignment_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    require_role(user.role, {"student"})

    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["student"])

    submission = Submission(assignment_id=assignment_id, student_id=user.id)
    db.add(submission)
    db.commit()
    db.refresh(submission)

    # folder structure:
    # data/assignment_<id>/<student_email>/<original files>
    root = Path(settings.DATA_ROOT)
    student_folder = safe_folder_name(user.email)
    dest_dir = root / f"assignment_{assignment_id}" / student_folder
    dest_dir.mkdir(parents=True, exist_ok=True)

    saved = 0
    for f in files:
        if not f.filename:
            continue

        # prevent path tricks
        filename = os.path.basename(f.filename)
        dest_path = dest_dir / filename

        content = await f.read()
        dest_path.write_bytes(content)

        rec = SubmissionFile(
            submission_id=submission.id,
            filename=filename,
            path=str(dest_path),
        )
        db.add(rec)
        saved += 1

    db.commit()

    return {
        "submission_id": submission.id,
        "assignment_id": assignment_id,
        "student": user.email,
        "files_saved": saved,
        "folder": str(dest_dir),
    }
