import os
import re
import tempfile
import unicodedata
import zipfile

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_course_role
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.user import User

router = APIRouter(prefix="/faculty", tags=["faculty"])


def _sanitize_filename_part(value: str | None, fallback: str) -> str:
    """Return a filesystem-safe ASCII token for download filenames."""
    normalized = unicodedata.normalize("NFKD", value or "")
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    cleaned = re.sub(r"[^A-Za-z0-9]+", "_", ascii_only).strip("_")
    return cleaned or fallback


def _is_better_submission(candidate: Submission, existing: Submission | None) -> bool:
    """Compare two submissions under the 'best' strategy.

    Rules:
    1) Any scored submission beats an unscored one.
    2) Higher score wins.
    3) Tie-breaker: newer created_at, then larger id.
    """
    if existing is None:
        return True

    candidate_has_score = candidate.score is not None
    existing_has_score = existing.score is not None

    if candidate_has_score and not existing_has_score:
        return True
    if existing_has_score and not candidate_has_score:
        return False

    if candidate_has_score and existing_has_score:
        if candidate.score > existing.score:
            return True
        if candidate.score < existing.score:
            return False

    candidate_created = candidate.created_at
    existing_created = existing.created_at
    if candidate_created and existing_created:
        if candidate_created > existing_created:
            return True
        if candidate_created < existing_created:
            return False

    return (candidate.id or 0) > (existing.id or 0)


@router.get("/assignments/{assignment_id}/download-zip")
def download_assignment_zip(
    assignment_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(
        db=db,
        user=user,
        course_id=assignment.course_id,
        allowed_roles=["instructor", "ta"],
    )

    # Build submission set per student for this assignment according to
    # assignment grading policy: latest vs best.
    submissions = (
        db.query(Submission)
        .filter(Submission.assignment_id == assignment_id)
        .order_by(Submission.student_id.asc(), Submission.created_at.desc(), Submission.id.desc())
        .all()
    )
    if not submissions:
        raise HTTPException(status_code=404, detail="No submissions yet")

    policy = (assignment.grading_strategy or "latest").strip().lower()
    latest_by_student: dict[int, Submission] = {}
    best_by_student: dict[int, Submission] = {}
    for sub in submissions:
        if sub.student_id not in latest_by_student:
            latest_by_student[sub.student_id] = sub
        existing_best = best_by_student.get(sub.student_id)
        if _is_better_submission(sub, existing_best):
            best_by_student[sub.student_id] = sub

    selected_by_student = best_by_student if policy == "best" else latest_by_student
    selected_submissions = list(selected_by_student.values())
    submission_ids = [s.id for s in selected_submissions]
    student_ids = {s.student_id for s in selected_submissions}

    students = db.query(User).filter(User.id.in_(student_ids)).all()
    id_to_email = {u.id: u.email for u in students}

    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id.in_(submission_ids)).all()
    if not files:
        raise HTTPException(status_code=404, detail="No files for this assignment yet")

    # temporary zip file
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
    tmp.close()

    with zipfile.ZipFile(tmp.name, "w", compression=zipfile.ZIP_DEFLATED) as z:
        # build submission_id -> student_id
        sub_to_student = {s.id: s.student_id for s in selected_submissions}

        for f in files:
            student_id = sub_to_student.get(f.submission_id)
            student_email = id_to_email.get(student_id, f"student_{student_id}")
            arcname = f"{student_email}/{f.filename}"  # folder per student

            if os.path.exists(f.path):
                z.write(f.path, arcname=arcname)

    course_label = _sanitize_filename_part(
        assignment.course.name if assignment.course else None,
        f"course_{assignment.course_id or 'unknown'}",
    )
    assignment_label = _sanitize_filename_part(
        assignment.title,
        f"assignment_{assignment_id}",
    )
    download_name = f"{course_label}_{assignment_label}.zip"
    background_tasks.add_task(os.unlink, tmp.name)
    return FileResponse(tmp.name, filename=download_name, media_type="application/zip")
