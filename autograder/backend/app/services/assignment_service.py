"""
Assignment service for managing assignments, rubrics, and testcases.
"""

from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.assignment import Assignment
from app.models.rubric import Rubric
from app.models.testcase import TestCase
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate


class AssignmentService:
    """Service for assignment-related operations."""

    @staticmethod
    def get(db: Session, assignment_id: int) -> Optional[Assignment]:
        """Get assignment by ID."""
        return db.query(Assignment).filter(Assignment.id == assignment_id).first()

    @staticmethod
    def get_or_404(db: Session, assignment_id: int) -> Assignment:
        """Get assignment by ID or raise 404."""
        assignment = AssignmentService.get(db, assignment_id)
        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found",
            )
        return assignment

    @staticmethod
    def get_all(
        db: Session,
        *,
        course_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Assignment]:
        """Get all assignments, optionally filtered by course."""
        query = db.query(Assignment)
        if course_id:
            query = query.filter(Assignment.course_id == course_id)
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def create(
        db: Session,
        payload: AssignmentCreate,
        created_by: int,
    ) -> Assignment:
        """Create a new assignment."""
        assignment = Assignment(
            title=payload.title,
            description=payload.description,
            course_id=getattr(payload, "course_id", None),
            due_date=getattr(payload, "due_date", None),
            max_submissions=getattr(payload, "max_submissions", None),
            allowed_languages=getattr(payload, "allowed_languages", None),
            created_by=created_by,
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment

    @staticmethod
    def update(
        db: Session,
        assignment_id: int,
        payload: AssignmentUpdate,
    ) -> Assignment:
        """Update an existing assignment."""
        assignment = AssignmentService.get_or_404(db, assignment_id)

        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(assignment, field, value)

        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment

    @staticmethod
    def delete(db: Session, assignment_id: int) -> bool:
        """Delete an assignment."""
        assignment = AssignmentService.get_or_404(db, assignment_id)
        db.delete(assignment)
        db.commit()
        return True

    @staticmethod
    def is_past_due(assignment: Assignment) -> bool:
        """Check if assignment is past due date."""
        if not assignment.due_date:
            return False
        return datetime.utcnow() > assignment.due_date

    @staticmethod
    def can_submit(db: Session, assignment: Assignment, student_id: int) -> tuple[bool, str]:
        """
        Check if a student can submit to this assignment.
        
        Returns:
            Tuple of (can_submit: bool, reason: str)
        """
        # Check due date
        if AssignmentService.is_past_due(assignment):
            return False, "Assignment is past due date"

        # Check max submissions if set
        if assignment.max_submissions:
            from app.models.submission import Submission
            count = db.query(Submission).filter(
                Submission.assignment_id == assignment.id,
                Submission.student_id == student_id,
            ).count()
            if count >= assignment.max_submissions:
                return False, f"Maximum submissions ({assignment.max_submissions}) reached"

        return True, "OK"

    # Rubric operations
    @staticmethod
    def get_rubrics(db: Session, assignment_id: int) -> List[Rubric]:
        """Get all rubrics for an assignment."""
        return db.query(Rubric).filter(Rubric.assignment_id == assignment_id).all()

    @staticmethod
    def add_rubric(
        db: Session,
        assignment_id: int,
        name: str,
        description: Optional[str] = None,
        max_points: int = 10,
        weight: float = 1.0,
    ) -> Rubric:
        """Add a rubric item to an assignment."""
        AssignmentService.get_or_404(db, assignment_id)

        rubric = Rubric(
            assignment_id=assignment_id,
            name=name,
            description=description,
            max_points=max_points,
            weight=weight,
        )
        db.add(rubric)
        db.commit()
        db.refresh(rubric)
        return rubric

    # Test case operations
    @staticmethod
    def get_testcases(
        db: Session,
        assignment_id: int,
        *,
        include_hidden: bool = False,
    ) -> List[TestCase]:
        """Get test cases for an assignment."""
        query = db.query(TestCase).filter(TestCase.assignment_id == assignment_id)
        if not include_hidden:
            query = query.filter(TestCase.is_public == True)
        return query.all()

    @staticmethod
    def add_testcase(
        db: Session,
        assignment_id: int,
        input_data: str,
        expected_output: str,
        is_public: bool = False,
        points: int = 1,
    ) -> TestCase:
        """Add a test case to an assignment."""
        AssignmentService.get_or_404(db, assignment_id)

        testcase = TestCase(
            assignment_id=assignment_id,
            input_data=input_data,
            expected_output=expected_output,
            is_public=is_public,
            points=points,
        )
        db.add(testcase)
        db.commit()
        db.refresh(testcase)
        return testcase

    @staticmethod
    def get_total_points(db: Session, assignment_id: int) -> int:
        """Calculate total possible points for an assignment."""
        testcases = db.query(TestCase).filter(
            TestCase.assignment_id == assignment_id
        ).all()
        return sum(tc.points for tc in testcases)
