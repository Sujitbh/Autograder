import os
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult
from app.models.testcase import TestCase
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionOut
from app.settings import settings

router = APIRouter(prefix="/submissions", tags=["submissions"])


# ── Schema ────────────────────────────────────────────────────────────

class CodeSubmitRequest(BaseModel):
    assignment_id: int
    language: str          # "python" | "java" | "cpp" | "javascript"
    code: str


# ── Code submission endpoint ──────────────────────────────────────────

@router.post("/code")
def submit_code(
    body: CodeSubmitRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Accept raw code from a student, run it against all public test cases
    for the assignment, persist results, and return them immediately.
    """
    from app.services.execution_service import ExecutionService

    # Validate assignment exists
    assignment = db.query(Assignment).filter(
        Assignment.id == body.assignment_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Validate language
    language = body.language.lower()
    supported = {"python", "java", "cpp", "c", "javascript"}
    if language not in supported:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language. Choose from: {', '.join(sorted(supported))}",
        )

    # Create submission record
    submission = Submission(
        assignment_id=body.assignment_id,
        student_id=user.id,
        status="grading",
    )
    db.add(submission)
    db.flush()   # get submission.id without committing

    # Persist code as a virtual file so grading history is preserved
    import tempfile, os
    ext_map = {"python": ".py", "java": ".java", "cpp": ".cpp", "c": ".c", "javascript": ".js"}
    filename = f"submission{ext_map.get(language, '.txt')}"
    upload_dir = Path(settings.upload_dir) / f"submission_{submission.id}"
    upload_dir.mkdir(parents=True, exist_ok=True)
    code_path = upload_dir / filename
    code_path.write_text(body.code, encoding="utf-8")

    sub_file = SubmissionFile(
        submission_id=submission.id,
        filename=filename,
        path=str(code_path),
        file_size=len(body.code.encode()),
    )
    db.add(sub_file)

    # Fetch all test cases for the assignment
    testcases = db.query(TestCase).filter(
        TestCase.assignment_id == body.assignment_id
    ).all()

    test_results: list = []
    passed_count = 0
    total_points = 0
    earned_points = 0

    if testcases:
        execution_output = ExecutionService.run_all_testcases(
            code=body.code,
            language=language,
            testcases=testcases,
        )
        for r in execution_output.get("results", []):
            db_result = SubmissionResult(
                submission_id=submission.id,
                testcase_id=r.get("testcase_id"),
                passed=r.get("passed", False),
                output=r.get("actual_output", ""),
                error_output=r.get("error_output", ""),
                points_awarded=r.get("points_earned", 0),
                execution_time_ms=r.get("execution_time_ms", 0),
            )
            db.add(db_result)

            tc = next((t for t in testcases if t.id == r.get("testcase_id")), None)
            passed_count += 1 if r.get("passed") else 0
            pts = r.get("points_earned", 0) or 0
            max_pts = (tc.points if tc and tc.points else 0) or 0
            earned_points += pts
            total_points += max_pts

            test_results.append({
                "testcase_id": r.get("testcase_id"),
                "testcase_name": f"Test {len(test_results) + 1}",
                "input": tc.input_data if tc else None,
                "expected_output": tc.expected_output if tc else None,
                "is_public": tc.is_public if tc else True,
                "points": max_pts,
                "passed": r.get("passed", False),
                "actual_output": r.get("actual_output", ""),
                "error_output": r.get("error_output", ""),
                "execution_time_ms": r.get("execution_time_ms", 0),
                "points_earned": pts,
            })

    # Update submission status + score
    submission.status = "graded"
    submission.score = earned_points
    submission.max_score = total_points
    db.commit()
    db.refresh(submission)

    return {
        "submission_id": submission.id,
        "total_testcases": len(testcases),
        "passed": passed_count,
        "failed": len(testcases) - passed_count,
        "score": earned_points,
        "max_score": total_points,
        "percentage": round(passed_count / len(testcases) * 100, 1) if testcases else 0,
        "results": test_results,
    }


@router.get("/{s_id}/results")
def get_submission_results(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Return test-case results for a specific submission."""
    from app.models.submission_result import SubmissionResult
    from app.models.testcase import TestCase
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    results = db.query(SubmissionResult).filter(SubmissionResult.submission_id == s_id).all()
    out = []
    for r in results:
        tc = db.query(TestCase).filter(TestCase.id == r.testcase_id).first() if r.testcase_id else None
        out.append({
            "id": r.id,
            "testcase_id": r.testcase_id,
            "testcase_input": tc.input_data if tc else None,
            "testcase_expected": tc.expected_output if tc else None,
            "testcase_is_public": tc.is_public if tc else None,
            "testcase_points": tc.points if tc else None,
            "passed": r.passed,
            "output": r.output,
            "error_output": r.error_output,
            "points_awarded": r.points_awarded,
            "execution_time_ms": r.execution_time_ms,
        })
    return out


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
    s = Submission(assignment_id=payload.assignment_id, student_id=user.id)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@router.get("/{s_id}", response_model=SubmissionOut)
def get_submission(s_id: int, db: Session = Depends(get_db)):
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
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
    db.delete(s)
    db.commit()
    return {"ok": True}


@router.get("/assignments/{assignment_id}")
def get_submissions_by_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get all submissions for a specific assignment. Includes student name and email."""
    query = db.query(Submission).filter(Submission.assignment_id == assignment_id)
    if user.role == "student":
        query = query.filter(Submission.student_id == user.id)
    subs = query.all()

    result = []
    for s in subs:
        student = db.query(User).filter(User.id == s.student_id).first()
        files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s.id).all()
        result.append({
            "id": s.id,
            "assignment_id": s.assignment_id,
            "student_id": s.student_id,
            "student_name": student.name if student else "Unknown",
            "student_email": student.email if student else "",
            "status": s.status,
            "score": s.score,
            "max_score": s.max_score,
            "feedback": s.feedback,
            "graded_at": s.graded_at.isoformat() if s.graded_at else None,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "files": [{"id": f.id, "filename": f.filename, "file_size": f.file_size} for f in files],
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
    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s_id).all()
    return [{"id": f.id, "filename": f.filename, "file_size": f.file_size} for f in files]


@router.get("/files/{file_id}/content")
def get_file_content(
    file_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Read the text content of a submitted file.
    Restricted to faculty, ta, and admin roles.
    """
    require_role(user.role, {"faculty", "ta", "admin"})

    sf = db.query(SubmissionFile).filter(SubmissionFile.id == file_id).first()
    if not sf:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = Path(sf.path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")

    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        content = "[Binary file — cannot display as text]"

    return {
        "id": sf.id,
        "filename": sf.filename,
        "content": content,
        "file_size": sf.file_size,
    }


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
