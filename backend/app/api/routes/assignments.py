from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional

from app.api.deps import get_db, get_current_user, get_current_user_optional
from app.core.permissions import require_role, require_course_role, get_course_enrollment_role
from app.models.assignment import Assignment
from app.models.testcase import TestCase
from app.models.rubric_section import RubricSection, RubricCriterion
from app.models.user import User
from app.models.enrollment import Enrollment
from app.models.ta_permission import TAPermission
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentOut
from app.settings import settings

router = APIRouter(prefix="/assignments", tags=["assignments"])

MAX_DESCRIPTION_PDF_BYTES = 25 * 1024 * 1024  # 25 MB


def _assignment_description_dir() -> Path:
    path = Path(settings.DATA_ROOT) / "assignment_descriptions"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _assignment_description_pdf_path(assignment_id: int) -> Path:
    return _assignment_description_dir() / f"{assignment_id}.pdf"


def _assignment_description_download_name(assignment: Assignment) -> str:
    title = "".join(ch if ch.isalnum() else "-" for ch in (assignment.title or "assignment"))
    title = "-".join(chunk for chunk in title.split("-") if chunk).strip("-")
    if not title:
        title = f"assignment-{assignment.id}"
    return f"{title}-description.pdf"


@router.get("/", response_model=List[AssignmentOut])
def list_assignments(
    course_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
):
    q = db.query(Assignment).options(selectinload(Assignment.rubric_sections).selectinload(RubricSection.criteria))
    if course_id is not None:
        q = q.filter(Assignment.course_id == course_id)

    # Students should only see active assignments
    if user and user.role == "student":
        q = q.filter(Assignment.is_active == True)

    return q.all()


@router.post("/", response_model=AssignmentOut)
def create_assignment(
    payload: AssignmentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    require_role(user.role, {"faculty", "admin"})
    require_course_role(db=db, user=user, course_id=payload.course_id, allowed_roles=["instructor"])

    assignment = Assignment(
        title=payload.title,
        description=payload.description,
        course_id=payload.course_id,
        created_by=user.id,
        due_date=payload.due_date,
        max_submissions=payload.max_submissions,
        max_points=payload.max_points,
        rubric_mode=payload.rubric_mode or "unweighted",
        allowed_languages=payload.allowed_languages,
        starter_code=payload.starter_code,
        status=payload.status or "published",
        ai_detection_enabled=payload.ai_detection_enabled if payload.ai_detection_enabled is not None else True,
        auto_flag_enabled=payload.auto_flag_enabled if payload.auto_flag_enabled is not None else True,
        auto_flag_threshold=payload.auto_flag_threshold if payload.auto_flag_threshold is not None else 0.70,
    )
    db.add(assignment)
    db.flush()  # get assignment.id before committing so we can create children

    # ── Persist test cases ──────────────────────────────────────────
    for tc in (payload.public_tests or []):
        db.add(TestCase(
            assignment_id=assignment.id,
            name=tc.name,
            input_data=tc.input,
            expected_output=tc.expectedOutput,
            is_public=True,
            points=tc.points or 1,
        ))
    for tc in (payload.private_tests or []):
        db.add(TestCase(
            assignment_id=assignment.id,
            name=tc.name,
            input_data=tc.input,
            expected_output=tc.expectedOutput,
            is_public=False,
            points=tc.points or 1,
        ))

    # ── Persist rubric sections + criteria ──────────────────────────
    for section_idx, rs in enumerate(payload.rubric or []):
        section = RubricSection(
            assignment_id=assignment.id,
            name=rs.name,
            description=rs.description,
            weight=rs.weight if rs.weight is not None else 100.0,
            order=section_idx,
        )
        db.add(section)
        db.flush()

        sec_w = float(rs.weight if rs.weight is not None else 100.0)
        for crit_idx, rc in enumerate(rs.criteria or []):
            dc = json.dumps(rc.defaultComments) if rc.defaultComments else None
            db.add(RubricCriterion(
                section_id=section.id,
                name=rc.name,
                description=rc.description,
                max_points=rc.maxPoints or 5,
                weight=_criterion_payload_weight_to_db(rc.weight, sec_w),
                grading_method=rc.gradingMethod or "manual",
                order=crit_idx,
                default_comments=dc,
            ))

    db.commit()
    db.refresh(assignment)
    return assignment


@router.post("/{assignment_id}/description-pdf")
async def upload_assignment_description_pdf(
    assignment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])

    filename = (file.filename or "").lower()
    if not filename.endswith(".pdf") and file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported for assignment descriptions.",
        )

    contents = await file.read()
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )
    if len(contents) > MAX_DESCRIPTION_PDF_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Description PDF is too large. Maximum size is 25 MB.",
        )

    _assignment_description_pdf_path(assignment_id).write_bytes(contents)
    return {"ok": True}


@router.get("/{assignment_id}/description-pdf/status")
def get_assignment_description_pdf_status(
    assignment_id: int,
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
        allowed_roles=["student", "ta", "instructor"],
    )

    path = _assignment_description_pdf_path(assignment_id)
    return {"available": path.is_file()}


@router.get("/{assignment_id}/description-pdf")
def download_assignment_description_pdf(
    assignment_id: int,
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
        allowed_roles=["student", "ta", "instructor"],
    )

    path = _assignment_description_pdf_path(assignment_id)
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Description PDF not found")

    return FileResponse(
        path,
        media_type="application/pdf",
        filename=_assignment_description_download_name(assignment),
    )


@router.get("/{assignment_id}", response_model=AssignmentOut)
def get_assignment(assignment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    assignment = (
        db.query(Assignment)
        .options(selectinload(Assignment.rubric_sections).selectinload(RubricSection.criteria))
        .filter(Assignment.id == assignment_id)
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.post("/{assignment_id}/rubric", response_model=AssignmentOut)
def replace_assignment_rubric(
    assignment_id: int,
    payload: AssignmentRubricReplaceBody,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Replace all rubric sections and criteria on an assignment.
    Instructors may always edit; TAs need `can_edit_rubrics` on their enrollment.
    """
    assignment = (
        db.query(Assignment)
        .options(selectinload(Assignment.rubric_sections).selectinload(RubricSection.criteria))
        .filter(Assignment.id == assignment_id)
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    _require_assignment_rubric_editor(db, user, assignment)

    mode = payload.rubricMode or assignment.rubric_mode or "unweighted"
    if mode == "weighted":
        ssum = sum(s.weight for s in payload.rubric)
        if abs(ssum - 100.0) > _WEIGHT_SUM_TOLERANCE:
            raise HTTPException(
                status_code=400,
                detail=f"Weighted rubric section weights must sum to 100 (±{_WEIGHT_SUM_TOLERANCE}); got {ssum:.2f}",
            )
        for sec in payload.rubric:
            csum = sum(c.weight or 0 for c in sec.criteria)
            if abs(csum - sec.weight) > _WEIGHT_SUM_TOLERANCE:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f'Section "{sec.name}": criterion weights must sum to the section weight '
                        f"({sec.weight:.2f}); got {csum:.2f}"
                    ),
                )

    if payload.rubricMode is not None:
        assignment.rubric_mode = payload.rubricMode

    for sec in list(assignment.rubric_sections):
        db.delete(sec)
    db.flush()

    for section_idx, rs in enumerate(payload.rubric):
        section = RubricSection(
            assignment_id=assignment.id,
            name=rs.name,
            description=rs.description,
            weight=float(rs.weight) if rs.weight is not None else 100.0,
            order=section_idx,
        )
        db.add(section)
        db.flush()

        sec_w = float(section.weight)
        for crit_idx, rc in enumerate(rs.criteria or []):
            dc = json.dumps(rc.defaultComments) if rc.defaultComments else None
            db.add(
                RubricCriterion(
                    section_id=section.id,
                    name=rc.name,
                    description=rc.description,
                    max_points=rc.maxPoints or 5,
                    weight=_criterion_payload_weight_to_db(rc.weight, sec_w),
                    grading_method=rc.gradingMethod or "manual",
                    order=crit_idx,
                    default_comments=dc,
                )
            )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return (
        db.query(Assignment)
        .options(selectinload(Assignment.rubric_sections).selectinload(RubricSection.criteria))
        .filter(Assignment.id == assignment_id)
        .first()
    )


@router.put("/{assignment_id}", response_model=AssignmentOut)
def update_assignment(
    assignment_id: int,
    payload: AssignmentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(assignment, k, v)
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["instructor"])

    _assignment_description_pdf_path(assignment_id).unlink(missing_ok=True)
    db.delete(assignment)
    db.commit()
    return {"ok": True}
