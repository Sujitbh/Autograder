"""
TA Service for managing grading assistant invitations and roles.
"""
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.ta_invitation import TAInvitation
from app.models.enrollment import Enrollment
from app.models.user import User
from app.models.course import Course


class TAService:
    """Service for TA-related operations."""

    @staticmethod
    def invite_ta(db: Session, course_id: int, student_id: int, faculty_id: int) -> TAInvitation:
        """
        Create a TA invitation from faculty to student.
        
        Raises:
            HTTPException: If course not found, faculty doesn't own course, or student not enrolled
        """
        # Verify course exists
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        
        # Verify faculty owns the course (has instructor role in enrollment)
        faculty_enrollment = db.query(Enrollment).filter(
            Enrollment.course_id == course_id,
            Enrollment.user_id == faculty_id,
            Enrollment.role == "instructor",
        ).first()
        
        if not faculty_enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only course instructor can invite TAs",
            )
        
        # Verify student is enrolled
        enrollment = db.query(Enrollment).filter(
            Enrollment.course_id == course_id,
            Enrollment.user_id == student_id,
        ).first()
        
        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student is not enrolled in this course",
            )

        # Block inviting someone who is already a TA in this course
        if enrollment.role == "ta":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This student is already a TA in this course",
            )
        
        # Check for existing pending invitation
        existing = db.query(TAInvitation).filter(
            TAInvitation.course_id == course_id,
            TAInvitation.student_id == student_id,
            TAInvitation.status == "pending",
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pending invitation already exists for this student",
            )
        
        # Create invitation
        invitation = TAInvitation(
            course_id=course_id,
            student_id=student_id,
            faculty_id=faculty_id,
            status="pending",
        )
        
        db.add(invitation)
        db.commit()
        db.refresh(invitation)
        
        return invitation

    @staticmethod
    def get_student_invitations(db: Session, student_id: int) -> list[TAInvitation]:
        """Get all TA invitations for a student."""
        return db.query(TAInvitation).filter(
            TAInvitation.student_id == student_id
        ).all()

    @staticmethod
    def respond_to_invitation(
        db: Session,
        invitation_id: int,
        student_id: int,
        action: str,
    ) -> TAInvitation:
        """
        Accept or decline a TA invitation.
        
        Args:
            invitation_id: ID of the invitation
            student_id: ID of the student (must match invitation recipient)
            action: "accept" or "decline"
        
        Raises:
            HTTPException: If invitation not found or student not authorized
        """
        invitation = db.query(TAInvitation).filter(
            TAInvitation.id == invitation_id
        ).first()
        
        if not invitation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invitation not found",
            )
        
        if invitation.student_id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to respond to this invitation",
            )
        
        if invitation.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invitation has already been responded to",
            )
        
        if action.lower() == "accept":
            # Update enrollment role to 'ta'
            enrollment = db.query(Enrollment).filter(
                Enrollment.course_id == invitation.course_id,
                Enrollment.user_id == student_id,
            ).first()
            
            if enrollment:
                enrollment.role = "ta"
                db.add(enrollment)
            
            invitation.status = "accepted"
            invitation.responded_at = datetime.utcnow()
            
        elif action.lower() == "decline":
            invitation.status = "declined"
            invitation.responded_at = datetime.utcnow()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Action must be "accept" or "decline"',
            )
        
        db.add(invitation)
        db.commit()
        db.refresh(invitation)
        
        return invitation

    @staticmethod
    def get_invitation_with_details(db: Session, invitation_id: int) -> dict:
        """Get invitation with course and instructor details."""
        result = db.query(
            TAInvitation,
            Course.name.label("course_name"),
            Course.code.label("course_code"),
            User.name.label("instructor_name"),
        ).join(
            Course, TAInvitation.course_id == Course.id
        ).join(
            User, TAInvitation.faculty_id == User.id
        ).filter(
            TAInvitation.id == invitation_id
        ).first()
        
        if not result:
            return None
        
        invitation, course_name, course_code, instructor_name = result
        
        student = db.query(User).filter(User.id == invitation.student_id).first()
        
        return {
            "id": invitation.id,
            "course_id": invitation.course_id,
            "student_id": invitation.student_id,
            "faculty_id": invitation.faculty_id,
            "status": invitation.status,
            "created_at": invitation.created_at,
            "responded_at": invitation.responded_at,
            "course_name": course_name,
            "course_code": course_code,
            "instructor_name": instructor_name,
            "student_name": student.name if student else "Unknown",
        }

    @staticmethod
    def get_course_ta_invitations(
        db: Session,
        course_id: int,
        faculty_id: int,
    ) -> list[TAInvitation]:
        """
        Get all TA invitations for a course (faculty view).
        
        Raises:
            HTTPException: If faculty doesn't own the course
        """
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        
        # Check if faculty is instructor for this course
        faculty_enrollment = db.query(Enrollment).filter(
            Enrollment.course_id == course_id,
            Enrollment.user_id == faculty_id,
            Enrollment.role == "instructor",
        ).first()
        
        if not faculty_enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only course instructor can view invitations",
            )
        
        return db.query(TAInvitation).filter(
            TAInvitation.course_id == course_id
        ).all()
