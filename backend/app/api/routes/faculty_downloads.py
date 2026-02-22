import os
import tempfile
import zipfile

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.user import User

router = APIRouter(prefix="/faculty", tags=["faculty"])

@router.get("/assignments/{assignment_id}/download-zip")
def download_assignment_zip(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    require_role(user.role, {"faculty", "admin"})

    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # join: submissions -> files; and map student_id -> email
    submissions = db.query(Submission).filter(Submission.assignment_id == assignment_id).all()
    if not submissions:
        raise HTTPException(status_code=404, detail="No submissions yet")

    student_ids = {s.student_id for s in submissions}
    students = db.query(User).filter(User.id.in_(student_ids)).all()
    id_to_email = {u.id: u.email for u in students}

    submission_ids = [s.id for s in submissions]
    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id.in_(submission_ids)).all()
    if not files:
        raise HTTPException(status_code=404, detail="No files for this assignment yet")

    # temporary zip file
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
    tmp.close()

    with zipfile.ZipFile(tmp.name, "w", compression=zipfile.ZIP_DEFLATED) as z:
        # build submission_id -> student_id
        sub_to_student = {s.id: s.student_id for s in submissions}

        for f in files:
            student_id = sub_to_student.get(f.submission_id)
            student_email = id_to_email.get(student_id, f"student_{student_id}")
            arcname = f"{student_email}/{f.filename}"  # folder per student

            if os.path.exists(f.path):
                z.write(f.path, arcname=arcname)

    download_name = f"assignment_{assignment_id}_submissions.zip"
    return FileResponse(tmp.name, filename=download_name, media_type="application/zip")
