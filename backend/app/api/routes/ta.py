"""
TA (Grading Assistant) routes.
"""
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role
from app.models.user import User
from app.schemas.ta_invitation import (
    TAInvitationCreate,
    TAInvitationOut,
    TAInvitationWithDetails,
    TAInvitationResponse,
)
from app.services.ta_service import TAService

router = APIRouter(prefix="/ta", tags=["ta"])

# ── Annotated dependency aliases ──
DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


# ==================== Faculty: Send TA Invitations ====================

@router.post("/courses/{course_id}/invite", response_model=TAInvitationOut)
def invite_ta(
    course_id: int,
    payload: TAInvitationCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    """
    Faculty invites a student to be a Grading Assistant for a course.
    
    Requires:
    - Current user must be the course instructor
    - Student must be enrolled in the course
    """
    require_role(current_user.role, {"faculty", "admin"})
    
    invitation = TAService.invite_ta(
        db,
        course_id=course_id,
        student_id=payload.student_id,
        faculty_id=current_user.id,
    )
    return invitation


@router.get("/courses/{course_id}/invitations")
def get_course_ta_invitations(
    course_id: int,
    db: DbSession,
    current_user: CurrentUser,
):
    """
    Get all TA invitations for a course (faculty view).

    Requires:
    - Current user must be the course instructor
    """
    require_role(current_user.role, {"faculty", "admin"})

    invitations = TAService.get_course_ta_invitations(
        db,
        course_id=course_id,
        faculty_id=current_user.id,
    )
    # Enrich with student names
    from app.models.user import User as UserModel
    result = []
    for inv in invitations:
        student = db.query(UserModel).filter(UserModel.id == inv.student_id).first()
        result.append({
            "id": inv.id,
            "course_id": inv.course_id,
            "student_id": inv.student_id,
            "faculty_id": inv.faculty_id,
            "status": inv.status,
            "created_at": inv.created_at,
            "responded_at": inv.responded_at,
            "student_name": student.name if student else "Unknown",
        })
    return result


# ==================== Student: View & Respond to Invitations ====================

@router.get("/me/invitations", response_model=List[TAInvitationWithDetails])
def get_my_ta_invitations(
    db: DbSession,
    current_user: CurrentUser,
):
    """
    Get all TA invitations for the current student.
    
    Returns invitations with course and instructor details.
    """
    require_role(current_user.role, {"student"})
    
    invitations = TAService.get_student_invitations(db, current_user.id)
    
    # Enrich with details
    detailed = []
    for inv in invitations:
        details = TAService.get_invitation_with_details(db, inv.id)
        if details:
            detailed.append(details)
    
    return detailed


@router.post("/invitations/{invitation_id}/respond", response_model=TAInvitationOut)
def respond_to_ta_invitation(
    invitation_id: int,
    payload: TAInvitationResponse,
    db: DbSession,
    current_user: CurrentUser,
):
    """
    Student accepts or declines a TA invitation.
    
    Body:
    {
        "action": "accept" | "decline"
    }
    
    When accepted:
    - Student's enrollment role is updated to 'ta'
    - Invitation status is set to 'accepted'
    
    When declined:
    - Invitation status is set to 'declined'
    """
    require_role(current_user.role, {"student"})
    
    invitation = TAService.respond_to_invitation(
        db,
        invitation_id=invitation_id,
        student_id=current_user.id,
        action=payload.action,
    )
    return invitation
