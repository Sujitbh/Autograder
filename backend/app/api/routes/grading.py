"""
Grading routes for automated code evaluation.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role
from app.models.user import User
from app.models.submission import Submission
from app.services.grading_service import GradingService
from app.services.execution_service import ExecutionService, ExecutionStatus

router = APIRouter(prefix="/grading", tags=["grading"])


class ExecuteCodeRequest(BaseModel):
    """Request schema for code execution."""
    code: str
    language: str
    stdin_input: Optional[str] = ""
    timeout: Optional[int] = 10


class ExecuteCodeResponse(BaseModel):
    """Response schema for code execution."""
    status: str
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: float


class GradeSubmissionRequest(BaseModel):
    """Request schema for grading a submission."""
    submission_id: int
    run_tests: bool = True
    apply_rubric: bool = True


# ==================== Code Execution ====================

@router.post("/execute", response_model=ExecuteCodeResponse)
def execute_code(
    payload: ExecuteCodeRequest,
    user: User = Depends(get_current_user),
):
    """
    Execute code in a sandboxed environment.
    
    Supports: python, java, cpp, c, javascript
    """
    result = ExecutionService.execute(
        code=payload.code,
        language=payload.language,
        stdin_input=payload.stdin_input or "",
        timeout=payload.timeout,
    )

    return ExecuteCodeResponse(
        status=result.status.value,
        stdout=result.stdout,
        stderr=result.stderr,
        exit_code=result.exit_code,
        execution_time_ms=result.execution_time_ms,
    )


@router.post("/test-code")
def test_code_against_testcase(
    code: str,
    language: str,
    input_data: str,
    expected_output: str,
    user: User = Depends(get_current_user),
):
    """
    Test code against a single test case.
    
    Returns whether output matches expected.
    """
    result = ExecutionService.run_testcase(
        code=code,
        language=language,
        input_data=input_data,
        expected_output=expected_output,
    )
    return result


# ==================== Submission Grading ====================

@router.post("/submissions/{submission_id}/grade")
def grade_submission(
    submission_id: int,
    run_tests: bool = True,
    apply_rubric: bool = True,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Grade a submission against test cases and rubric.
    
    - Faculty/admin: Can grade any submission
    - Students: Can only trigger grading of their own submissions
    """
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    # Permission check
    if user.role == "student" and submission.student_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only grade your own submissions",
        )

    # Update submission status
    submission.status = "grading"
    db.commit()

    try:
        results = GradingService.grade_submission(
            db=db,
            submission_id=submission_id,
            run_tests=run_tests,
            apply_rubric=apply_rubric,
        )

        # Update submission with results
        submission.status = "graded"
        submission.score = results["total_score"]
        submission.max_score = results["max_score"]
        submission.feedback = "\n".join(results["feedback"])
        from datetime import datetime
        submission.graded_at = datetime.utcnow()
        db.commit()

        return results

    except Exception as e:
        submission.status = "error"
        submission.feedback = str(e)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Grading failed: {str(e)}",
        )


@router.get("/submissions/{submission_id}/results")
def get_submission_results(
    submission_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Get grading results for a submission.
    
    - Students can only see their own results
    - Faculty/admin can see all results
    """
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    # Permission check
    if user.role == "student" and submission.student_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only view your own results",
        )

    results = GradingService.get_results(db, submission_id)

    return {
        "submission_id": submission_id,
        "status": submission.status,
        "score": submission.score,
        "max_score": submission.max_score,
        "feedback": submission.feedback,
        "graded_at": submission.graded_at,
        "test_results": [
            {
                "id": r.id,
                "testcase_id": r.testcase_id,
                "passed": r.passed,
                "output": r.output,
                "points_awarded": r.points_awarded,
                "execution_time_ms": r.execution_time_ms,
            }
            for r in results
        ],
    }


# ==================== Assignment Statistics ====================

@router.get("/assignments/{assignment_id}/stats")
def get_assignment_stats(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Get grading statistics for an assignment (faculty/admin).
    """
    require_role(user.role, {"faculty", "admin"})
    return GradingService.get_assignment_stats(db, assignment_id)


@router.post("/assignments/{assignment_id}/grade-all")
def grade_all_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Grade all pending submissions for an assignment (faculty/admin).
    """
    require_role(user.role, {"faculty", "admin"})

    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.status == "pending",
    ).all()

    results = []
    for sub in submissions:
        try:
            result = GradingService.grade_submission(db, sub.id)
            sub.status = "graded"
            sub.score = result["total_score"]
            sub.max_score = result["max_score"]
            results.append({"submission_id": sub.id, "status": "graded", "score": result["total_score"]})
        except Exception as e:
            sub.status = "error"
            results.append({"submission_id": sub.id, "status": "error", "error": str(e)})

    db.commit()

    return {
        "assignment_id": assignment_id,
        "total_graded": len([r for r in results if r["status"] == "graded"]),
        "total_errors": len([r for r in results if r["status"] == "error"]),
        "results": results,
    }
