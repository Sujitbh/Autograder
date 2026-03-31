import os
import re
import difflib
from collections import Counter
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role, require_course_role
from app.models.assignment import Assignment
from app.models.rubric_section import RubricSection
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult
from app.models.testcase import TestCase
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionOut, SubmissionWithStudent
from app.services.ai_detector_service import predict_ai_likelihood
from app.settings import settings

router = APIRouter(prefix="/submissions", tags=["submissions"])


SOURCE_EXTENSIONS = {".py", ".java", ".cpp", ".c", ".js", ".ts", ".go", ".rs", ".kt", ".swift"}


def _resolve_submission_disk_path(stored: str | None) -> str | None:
    """Map DB path to a path that exists on this server (handles data/ relative and moved trees)."""
    if not stored or not str(stored).strip():
        return None
    p = str(stored).strip()
    candidates: list[str] = []
    if os.path.isabs(p):
        candidates.append(p)
    if p.startswith("data/"):
        candidates.append(str(Path(settings.DATA_ROOT) / p[5:]))
    if not os.path.isabs(p):
        candidates.append(str(Path(settings.DATA_ROOT) / p))
    candidates.append(p)
    seen: set[str] = set()
    for c in candidates:
        if c in seen:
            continue
        seen.add(c)
        if c and os.path.isfile(c):
            return c
    return None


def _extract_primary_source_file(files: list[SubmissionFile]) -> tuple[str | None, str | None]:
    """Return (filename, content) for the best candidate source file in a submission."""
    candidates: list[tuple[str, str]] = []
    for f in files:
        actual_path = _resolve_submission_disk_path(f.path)
        if not actual_path:
            continue
        try:
            with open(actual_path, "r", encoding="utf-8", errors="replace") as fh:
                content = fh.read()
            if content.strip():
                candidates.append((f.filename, content))
        except Exception:
            continue

    if not candidates:
        return None, None

    # Prefer source-like extensions, then longest file.
    candidates.sort(key=lambda item: ((Path(item[0]).suffix.lower() not in SOURCE_EXTENSIONS), -len(item[1])))
    return candidates[0]


def _strip_comments(code: str) -> str:
    # Remove Python/JS/C style line comments.
    no_line_comments = re.sub(r"(^|\s)#.*$|//.*$", "", code, flags=re.MULTILINE)
    # Remove block comments and docstrings.
    no_block_comments = re.sub(r"/\*.*?\*/|'''[\s\S]*?'''|\"\"\"[\s\S]*?\"\"\"", "", no_line_comments, flags=re.MULTILINE)
    return no_block_comments


def _normalize_code(code: str) -> str:
    code = _strip_comments(code)
    # Keep identifiers/keywords, remove punctuation to reduce superficial differences.
    tokens = re.findall(r"[A-Za-z_][A-Za-z0-9_]*|\d+", code.lower())
    return " ".join(tokens)


def _token_jaccard(a: str, b: str) -> float:
    a_tokens = set(a.split())
    b_tokens = set(b.split())
    if not a_tokens or not b_tokens:
        return 0.0
    inter = len(a_tokens & b_tokens)
    union = len(a_tokens | b_tokens)
    return inter / union if union else 0.0


def _similarity_percent(code_a: str, code_b: str) -> float:
    norm_a = _normalize_code(code_a)
    norm_b = _normalize_code(code_b)
    char_ratio = difflib.SequenceMatcher(None, norm_a, norm_b).ratio()
    token_ratio = _token_jaccard(norm_a, norm_b)
    score = (0.65 * char_ratio) + (0.35 * token_ratio)
    return round(score * 100, 2)


def _heuristic_ai_likelihood(code: str) -> dict:
    """Heuristic AI-likelihood estimator (advisory only, not a definitive detector)."""
    lowered = code.lower()
    lines = [ln for ln in code.splitlines() if ln.strip()]
    words = re.findall(r"[A-Za-z_][A-Za-z0-9_]*", code)

    comment_lines = sum(1 for ln in code.splitlines() if ln.strip().startswith(("#", "//", "*")))
    comment_ratio = (comment_lines / len(lines)) if lines else 0.0

    avg_identifier_len = (sum(len(w) for w in words) / len(words)) if words else 0.0
    avg_line_len = (sum(len(ln) for ln in lines) / len(lines)) if lines else 0.0

    phrase_markers = [
        "edge case", "time complexity", "space complexity", "robust", "optimize",
        "readability", "best practice", "input validation", "error handling",
    ]
    marker_hits = sum(1 for p in phrase_markers if p in lowered)

    generic_name_markers = [
        "processdata", "calculateresult", "handleinput", "mainlogic", "performoperation",
    ]
    joined_identifiers = " ".join(w.lower() for w in words)
    generic_hits = sum(1 for p in generic_name_markers if p in joined_identifiers)

    score = 18.0
    signals: list[str] = []

    if comment_ratio > 0.22:
        score += 16
        signals.append("High explanatory-comment ratio")
    if marker_hits >= 2:
        score += 18
        signals.append("Contains multiple polished explanatory phrases")
    if "/**" in code or "@param" in lowered or "@return" in lowered:
        score += 10
        signals.append("Uses formal documentation style")
    if 35 <= avg_line_len <= 80:
        score += 8
        signals.append("Consistent medium-length lines")
    if avg_identifier_len > 8.5:
        score += 8
        signals.append("Long descriptive identifier naming")
    if generic_hits > 0:
        score += 8
        signals.append("Uses generic helper-style naming")

    score = max(5.0, min(95.0, score))
    band = "low"
    if score >= 65:
        band = "high"
    elif score >= 40:
        band = "medium"

    return {
        "score": round(score, 1),
        "band": band,
        "signals": signals,
        "disclaimer": "AI detection is advisory only; use instructor judgement and corroborating evidence.",
    }


def _estimate_ai_likelihood(code: str) -> dict:
    model_result = predict_ai_likelihood(code)
    if model_result is not None:
        return model_result
    return _heuristic_ai_likelihood(code)


def _build_integrity_report(
    db: Session,
    submission: Submission,
    *,
    match_limit: int | None = 5,
) -> dict:
    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == submission.id).all()
    _, current_code = _extract_primary_source_file(files)
    if not current_code:
        return {
            "plagiarism": {
                "checked_against": 0,
                "top_matches": [],
                "note": "No source code found for current submission.",
                "peers_with_latest_submission": 0,
                "peers_skipped_no_file_rows": 0,
                "peers_skipped_unreadable_on_disk": 0,
            },
            "ai_detection": _estimate_ai_likelihood(""),
        }

    # Compare against latest submission from each *other* student in the same assignment.
    all_subs = db.query(Submission).filter(Submission.assignment_id == submission.assignment_id).order_by(Submission.created_at.desc()).all()
    latest_by_student: dict[int, Submission] = {}
    for sub in all_subs:
        if sub.student_id == submission.student_id:
            continue
        if sub.student_id not in latest_by_student:
            latest_by_student[sub.student_id] = sub

    peers_with_latest = len(latest_by_student)
    peers_skipped_no_file_rows = 0
    peers_skipped_unreadable_on_disk = 0
    matches = []
    for other in latest_by_student.values():
        other_files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == other.id).all()
        if not other_files:
            peers_skipped_no_file_rows += 1
            continue
        other_filename, other_code = _extract_primary_source_file(other_files)
        if not other_code:
            peers_skipped_unreadable_on_disk += 1
            continue

        similarity = _similarity_percent(current_code, other_code)
        other_student = db.query(User).filter(User.id == other.student_id).first()
        matches.append({
            "submission_id": other.id,
            "student_id": other.student_id,
            "student_name": other_student.name if other_student else f"Student {other.student_id}",
            "student_email": other_student.email if other_student else None,
            "status": other.status,
            "submitted_at": other.created_at.isoformat() if other.created_at else None,
            "filename": other_filename,
            "similarity_percent": similarity,
            "risk": "high" if similarity >= 75 else "medium" if similarity >= 55 else "low",
        })

    matches.sort(key=lambda m: m["similarity_percent"], reverse=True)
    if match_limit is None:
        top = matches
    else:
        top = matches[:match_limit]

    return {
        "plagiarism": {
            "checked_against": len(matches),
            "top_matches": top,
            "note": "Similarity is based on normalized code/token overlap and should be reviewed manually.",
            "peers_with_latest_submission": peers_with_latest,
            "peers_skipped_no_file_rows": peers_skipped_no_file_rows,
            "peers_skipped_unreadable_on_disk": peers_skipped_unreadable_on_disk,
        },
        "ai_detection": _estimate_ai_likelihood(current_code),
    }


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
        actual_path = _resolve_submission_disk_path(f.path)
        if actual_path:
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
                "input_data": tc.input_data if tc else "",
                "passed": r.passed,
                "actual_output": r.output or "",
                "expected_output": tc.expected_output if tc else "",
                "execution_time_ms": r.execution_time_ms or 0,
                "points": tc.points if tc else 0,
                "points_earned": r.points_awarded or 0,
                "error": r.error_output,
            })

    student_obj = db.query(User).filter(User.id == s.student_id).first()

    integrity_report = None
    # Only instructors/TAs/admin should see integrity diagnostics.
    if user.role != "student":
        integrity_report = _build_integrity_report(db, s)

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
            "name": student_obj.name if student_obj else "Unknown",
            "email": student_obj.email if student_obj else None,
        },
        "assignment": {
            "id": assignment.id,
            "title": assignment.title,
            "max_points": assignment.max_points,
            "due_date": assignment.due_date.isoformat() if getattr(assignment, "due_date", None) else None,
            "language": (assignment.allowed_languages.split(",")[0].strip().lower() if assignment.allowed_languages else "python"),
            "rubric_mode": assignment.rubric_mode,
        },
        "rubrics": [
            {
                "id": section.id,
                "assignment_id": section.assignment_id,
                "name": section.name,
                "description": section.description,
                "weight": section.weight,
                "criteria": [
                    {
                        "id": crit.id,
                        "section_id": crit.section_id,
                        "name": crit.name,
                        "description": crit.description,
                        "weight": crit.weight,
                        "max_points": crit.max_points or 0,
                        "grading_method": crit.grading_method,
                        "order": crit.order or 0,
                    }
                    for crit in sorted(section.criteria or [], key=lambda c: (c.order or 0, c.id))
                ],
            }
            for section in db.query(RubricSection)
                .filter(RubricSection.assignment_id == s.assignment_id)
                .order_by(RubricSection.order.asc(), RubricSection.id.asc())
                .all()
        ],
        "attempt_number": db.query(Submission).filter(
            Submission.assignment_id == s.assignment_id,
            Submission.student_id == s.student_id,
            Submission.id <= s.id,
        ).count(),
        "integrity": integrity_report,
    }


@router.get("/{s_id}/plagiarism-scan")
def plagiarism_scan(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Full plagiarism-style similarity scan for this submission vs classmates' latest attempts.
    Instructors/TAs only; returns all matches (not capped like submission detail).
    """
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

    if user.role == "student":
        raise HTTPException(status_code=403, detail="Not available for students")

    return _build_integrity_report(db, s, match_limit=None)


@router.get("/{s_id}/plagiarism-compare/{other_id}")
def plagiarism_compare(
    s_id: int,
    other_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Side-by-side source comparison between two submissions on the same assignment."""
    s = db.query(Submission).filter(Submission.id == s_id).first()
    other = db.query(Submission).filter(Submission.id == other_id).first()
    if not s or not other:
        raise HTTPException(status_code=404, detail="Submission not found")
    if s.assignment_id != other.assignment_id:
        raise HTTPException(status_code=400, detail="Submissions must belong to the same assignment")

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
    if user.role == "student":
        raise HTTPException(status_code=403, detail="Not available for students")

    base_files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s.id).all()
    peer_files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == other.id).all()
    base_fn, base_code = _extract_primary_source_file(base_files)
    peer_fn, peer_code = _extract_primary_source_file(peer_files)

    if not base_code or not peer_code:
        raise HTTPException(
            status_code=400,
            detail="Both submissions need readable primary source files for comparison.",
        )

    similarity = _similarity_percent(base_code, peer_code)
    risk = "high" if similarity >= 75 else "medium" if similarity >= 55 else "low"

    base_student = db.query(User).filter(User.id == s.student_id).first()
    peer_student = db.query(User).filter(User.id == other.student_id).first()

    diff_lines = difflib.unified_diff(
        base_code.splitlines(keepends=True),
        peer_code.splitlines(keepends=True),
        fromfile=f"{base_fn or 'submission_a'} (submission #{s.id})",
        tofile=f"{peer_fn or 'submission_b'} (submission #{other.id})",
        lineterm="",
    )
    unified_diff = "".join(diff_lines)

    return {
        "similarity_percent": similarity,
        "risk": risk,
        "base": {
            "submission_id": s.id,
            "student_id": s.student_id,
            "student_name": base_student.name if base_student else f"Student {s.student_id}",
            "filename": base_fn,
            "content": base_code,
        },
        "peer": {
            "submission_id": other.id,
            "student_id": other.student_id,
            "student_name": peer_student.name if peer_student else f"Student {other.student_id}",
            "student_email": peer_student.email if peer_student else None,
            "filename": peer_fn,
            "content": peer_code,
        },
        "unified_diff": unified_diff,
        "note": "Review the diff and both files in context; similarity is heuristic only.",
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
    assignment_testcases = db.query(TestCase).filter(TestCase.assignment_id == assignment_id).all()
    testcase_points_total = sum((tc.points or 0) for tc in assignment_testcases)
    resolved_assignment_max = testcase_points_total or assignment.max_points or 100
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
            "display_max_score": sub.max_score if sub.max_score is not None else resolved_assignment_max,
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
    
    actual_path = _resolve_submission_disk_path(file_record.path)
    if not actual_path:
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
