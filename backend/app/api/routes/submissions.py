import os
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role, require_course_role
from app.models.assignment import Assignment
from app.models.rubric import Rubric
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult
from app.models.testcase import TestCase
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionOut, SubmissionWithStudent
from app.settings import settings

router = APIRouter(prefix="/submissions", tags=["submissions"])


def safe_folder_name(s: str) -> str:
    """Keep it simple + safe for folders."""
    return "".join(ch if ch.isalnum() or ch in ("@", ".", "_", "-") else "_" for ch in s)


@router.get("/", response_model=List[SubmissionOut])
def list_submissions(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role == "admin":
        return db.query(Submission).all()
    if user.role == "student":
        return db.query(Submission).filter(Submission.student_id == user.id).all()
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
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["student", "ta"])

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


@router.get("/{s_id}/detail")
def get_submission_detail(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get detailed submission with file contents and test results."""
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

    # Build files with content
    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s_id).all()
    files_out = []
    for f in files:
        content = None
        actual_path = f.path
        if actual_path and not os.path.isabs(actual_path) and actual_path.startswith("data/"):
            from app.settings import settings
            from pathlib import Path
            actual_path = str(Path(settings.DATA_ROOT) / actual_path[5:])

        if actual_path and os.path.exists(actual_path):
            try:
                with open(actual_path, "r", encoding="utf-8", errors="replace") as fh:
                    content = fh.read()
            except Exception:
                content = None
        files_out.append({
            "id": f.id,
            "filename": f.filename,
            "content": content,
        })

    # Build test results
    raw_results = (
        db.query(SubmissionResult)
        .filter(SubmissionResult.submission_id == s_id)
        .all()
    )
    results_out = []
    private_idx = 0
    for r in raw_results:
        tc = db.query(TestCase).filter(TestCase.id == r.testcase_id).first() if r.testcase_id else None
        is_private = tc and not tc.is_public
        is_student = user.role == "student"

        if is_student and is_private:
            # Students see that a private test exists and whether it passed,
            # but never see the name, expected output, or actual output.
            private_idx += 1
            results_out.append({
                "testcase_id": r.testcase_id or r.id,
                "test_name": f"Private Test {private_idx}",
                "passed": r.passed,
                "actual_output": "(hidden)",
                "expected_output": "(hidden)",
                "execution_time_ms": r.execution_time_ms or 0,
                "points": tc.points if tc else 0,
                "points_earned": r.points_awarded or 0,
                "error": None,
            })
        else:
            results_out.append({
                "testcase_id": r.testcase_id or r.id,
                "test_name": tc.name if tc else f"Test {r.id}",
                "passed": r.passed,
                "actual_output": r.output or "",
                "expected_output": tc.expected_output if tc else "",
                "execution_time_ms": r.execution_time_ms or 0,
                "points": tc.points if tc else 0,
                "points_earned": r.points_awarded or 0,
                "error": r.error_output,
            })

    return {
        "id": s.id,
        "status": s.status,
        "score": s.score,
        "max_score": s.max_score,
        "feedback": s.feedback,
        "submitted_at": s.created_at.isoformat() if s.created_at else None,
        "files": files_out,
        "results": results_out,
        "student": {
            "id": s.student_id,
            "name": student_obj.name if (student_obj := db.query(User).filter(User.id == s.student_id).first()) else "Unknown",
            "email": student_obj.email if (student_obj := db.query(User).filter(User.id == s.student_id).first()) else None,
        },
        "assignment": {
            "id": assignment.id,
            "title": assignment.name,
            "due_date": assignment.due_date.isoformat() if getattr(assignment, "due_date", None) else None,
            "language": getattr(assignment, "language", "python") or "python",
        },
        "rubrics": [
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
                "max_points": r.max_points or 0,
                "weight": r.weight,
                "order": r.order or 0,
            }
            for r in db.query(Rubric).filter(Rubric.assignment_id == s.assignment_id).order_by(Rubric.order).all()
        ],
        "attempt_number": db.query(Submission).filter(
            Submission.assignment_id == s.assignment_id,
            Submission.student_id == s.student_id,
            Submission.id <= s.id,
        ).count(),
    }


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
    if user.role == "student":
        query = query.filter(Submission.student_id == user.id)
        return query.all()
    elif user.role != "admin":
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )
    
    # For faculty/admin, return submissions with student details and files
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
    actual_path = file_record.path
    if actual_path and not os.path.isabs(actual_path) and actual_path.startswith("data/"):
        from app.settings import settings
        from pathlib import Path
        actual_path = str(Path(settings.DATA_ROOT) / actual_path[5:])

    if not actual_path or not os.path.exists(actual_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=actual_path,
        filename=file_record.filename,
        media_type="application/octet-stream"
    )


@router.post("/assignments/{assignment_id}/upload")
async def upload_submission_files(
    assignment_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Upload request received for assignment {assignment_id} by user {user.email}")
    logger.info(f"Number of files: {len(files) if files else 0}")
    
    require_role(user.role, {"student", "ta"})

    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["student", "ta"])

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
            file_size=len(content),
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
