"""
Grading routes for automated code evaluation.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_course_role
from app.models.user import User
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.testcase import TestCase
from app.models.submission_result import SubmissionResult
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


class ManualScoreUpdateRequest(BaseModel):
    score: int
    max_score: Optional[int] = None
    feedback: Optional[str] = None


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
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Instructors/TAs for the course (or admin) can grade.
    require_course_role(
        db=db,
        user=user,
        course_id=assignment.course_id,
        allowed_roles=["instructor", "ta"],
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
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Students can only view their own results; instructors/TAs can view course submissions.
    if user.role == "student":
        if submission.student_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only view your own results",
            )
    else:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )

    results = GradingService.get_results(db, submission_id)

    is_student = user.role == "student"
    test_results_out = []
    for r in results:
        # Check if the test case is private
        tc = db.query(TestCase).filter(TestCase.id == r.testcase_id).first() if r.testcase_id else None
        is_private = tc and not tc.is_public

        if is_student and is_private:
            test_results_out.append({
                "id": r.id,
                "testcase_id": r.testcase_id,
                "passed": r.passed,
                "output": "(hidden)",
                "points_awarded": r.points_awarded,
                "execution_time_ms": r.execution_time_ms,
            })
        else:
            test_results_out.append({
                "id": r.id,
                "testcase_id": r.testcase_id,
                "passed": r.passed,
                "output": r.output,
                "points_awarded": r.points_awarded,
                "execution_time_ms": r.execution_time_ms,
            })

    return {
        "submission_id": submission_id,
        "status": submission.status,
        "score": submission.score,
        "max_score": submission.max_score,
        "feedback": submission.feedback,
        "graded_at": submission.graded_at,
        "test_results": test_results_out,
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
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(
        db=db,
        user=user,
        course_id=assignment.course_id,
        allowed_roles=["instructor", "ta"],
    )
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
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(
        db=db,
        user=user,
        course_id=assignment.course_id,
        allowed_roles=["instructor", "ta"],
    )

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


@router.patch("/submissions/{submission_id}/score")
def manual_score_submission(
    submission_id: int,
    payload: ManualScoreUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    require_course_role(
        db=db,
        user=user,
        course_id=assignment.course_id,
        allowed_roles=["instructor", "ta"],
    )

    if payload.score < 0:
        raise HTTPException(status_code=400, detail="score must be >= 0")

    resolved_max = payload.max_score if payload.max_score is not None else submission.max_score
    if resolved_max is not None and payload.score > resolved_max:
        raise HTTPException(status_code=400, detail="score cannot exceed max_score")

    submission.score = payload.score
    if payload.max_score is not None:
        submission.max_score = payload.max_score
    if payload.feedback is not None:
        submission.feedback = payload.feedback
    submission.status = "graded"

    from datetime import datetime
    submission.graded_at = datetime.utcnow()

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "submission_id": submission.id,
        "status": submission.status,
        "score": submission.score,
        "max_score": submission.max_score,
        "feedback": submission.feedback,
        "graded_at": submission.graded_at,
    }


@router.get("/assignments/{assignment_id}/class-performance")
def get_assignment_class_performance(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Return class-wide performance for an assignment based on latest submissions.

    Includes per-student score breakdown and aggregate test pass rates.
    Faculty/instructor/TA/admin only.
    """
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    require_course_role(
        db=db,
        user=user,
        course_id=assignment.course_id,
        allowed_roles=["instructor", "ta"],
    )

    # Latest submission per student
    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
    ).order_by(Submission.created_at.desc()).all()

    latest_by_student = {}
    for sub in submissions:
        if sub.student_id not in latest_by_student:
            latest_by_student[sub.student_id] = sub

    # Include all enrolled students in the course
    from app.models.enrollment import Enrollment
    student_enrollments = db.query(Enrollment).filter(
        Enrollment.course_id == assignment.course_id,
        Enrollment.role == "student",
    ).all()

    students_out = []
    scored_percentages = []

    for enrollment in student_enrollments:
        student = db.query(User).filter(User.id == enrollment.user_id).first()
        if not student:
            continue

        sub = latest_by_student.get(student.id)
        if not sub:
            students_out.append({
                "student_id": student.id,
                "name": student.name,
                "email": student.email,
                "submission_status": "missing",
                "score": None,
                "max_score": assignment.max_points,
                "percentage": None,
                "submission_id": None,
                "submitted_at": None,
                "graded_at": None,
            })
            continue

        percentage = None
        if sub.score is not None and sub.max_score and sub.max_score > 0:
            percentage = round((float(sub.score) / float(sub.max_score)) * 100, 2)
            scored_percentages.append(percentage)

        students_out.append({
            "student_id": student.id,
            "name": student.name,
            "email": student.email,
            "submission_status": sub.status,
            "score": sub.score,
            "max_score": sub.max_score if sub.max_score is not None else assignment.max_points,
            "percentage": percentage,
            "submission_id": sub.id,
            "submitted_at": sub.created_at,
            "graded_at": sub.graded_at,
        })

    # Aggregate testcase pass rates across latest submissions
    testcases = db.query(TestCase).filter(TestCase.assignment_id == assignment_id).all()
    testcase_stats = []
    for tc in testcases:
        passes = 0
        total = 0
        for student_id, sub in latest_by_student.items():
            result = db.query(SubmissionResult).filter(
                SubmissionResult.submission_id == sub.id,
                SubmissionResult.testcase_id == tc.id,
            ).first()
            if result is None:
                continue
            total += 1
            if result.passed:
                passes += 1

        pass_rate = round((passes / total) * 100, 2) if total > 0 else 0
        testcase_stats.append({
            "testcase_id": tc.id,
            "name": tc.name,
            "is_public": tc.is_public,
            "points": tc.points,
            "passes": passes,
            "total_runs": total,
            "pass_rate": pass_rate,
        })

    graded_count = len([s for s in students_out if s["submission_status"] == "graded"])
    pending_count = len([s for s in students_out if s["submission_status"] in ("pending", "grading")])
    missing_count = len([s for s in students_out if s["submission_status"] == "missing"])

    avg_percentage = round(sum(scored_percentages) / len(scored_percentages), 2) if scored_percentages else None

    return {
        "assignment_id": assignment.id,
        "assignment_title": assignment.title,
        "course_id": assignment.course_id,
        "summary": {
            "total_students": len(students_out),
            "graded": graded_count,
            "pending": pending_count,
            "missing": missing_count,
            "average_percentage": avg_percentage,
        },
        "students": students_out,
        "testcases": testcase_stats,
    }
