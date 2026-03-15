"""
TA Dashboard API routes — all endpoints scoped to courses the user is a TA for.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult
from app.models.enrollment import Enrollment
from app.models.testcase import TestCase
from app.models.rubric import Rubric
from app.models.ta_permission import TAPermission
from app.services.execution_service import ExecutionService
from app.services.grading_service import GradingService

router = APIRouter(prefix="/ta-dashboard", tags=["ta-dashboard"])


# ── Helpers ──────────────────────────────────────────────────────────

def _get_ta_enrollments(db: Session, user_id: int):
    """Return all TA enrollments for a user."""
    return db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.role == "ta",
    ).all()


def _require_ta_for_course(db: Session, user_id: int, course_id: int) -> Enrollment:
    """Verify the user is a TA for the given course. Return enrollment or 403."""
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course_id,
        Enrollment.role == "ta",
    ).first()
    if not enrollment:
        raise HTTPException(status_code=403, detail="You are not a TA for this course")
    return enrollment


def _get_permissions(db: Session, enrollment_id: int) -> dict:
    """Get TA permission flags for an enrollment (with defaults)."""
    perm = db.query(TAPermission).filter(TAPermission.enrollment_id == enrollment_id).first()
    if not perm:
        return {
            "can_grade": True,
            "can_view_submissions": True,
            "can_run_tests": True,
            "can_view_plagiarism": False,
            "can_manage_assignments": False,
            "can_manage_testcases": False,
            "can_view_private_tests": False,
            "can_view_students": True,
            "can_manage_groups": False,
            "can_contact_students": False,
            "can_access_reports": True,
            "can_export_grades": False,
            "can_view_rubrics": True,
            "can_edit_rubrics": False,
        }
    return {
        "can_grade": perm.can_grade,
        "can_view_submissions": perm.can_view_submissions,
        "can_run_tests": perm.can_run_tests,
        "can_view_plagiarism": perm.can_view_plagiarism,
        "can_manage_assignments": perm.can_manage_assignments,
        "can_manage_testcases": perm.can_manage_testcases,
        "can_view_private_tests": perm.can_view_private_tests,
        "can_view_students": perm.can_view_students,
        "can_manage_groups": perm.can_manage_groups,
        "can_contact_students": perm.can_contact_students,
        "can_access_reports": perm.can_access_reports,
        "can_export_grades": perm.can_export_grades,
        "can_view_rubrics": perm.can_view_rubrics,
        "can_edit_rubrics": perm.can_edit_rubrics,
    }


def _require_permission(permissions: dict, key: str, action: str = "access this resource"):
    """Raise 403 if the given permission flag is False."""
    if not permissions.get(key, False):
        raise HTTPException(status_code=403, detail=f"Permission denied: cannot {action}")


# ==================== Check TA Status ====================

@router.get("/status")
def get_ta_status(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Check if the current user is a TA for any course."""
    ta_enrollments = _get_ta_enrollments(db, user.id)
    return {
        "is_ta": len(ta_enrollments) > 0,
        "ta_course_count": len(ta_enrollments),
    }


# ==================== Overview Dashboard ====================

@router.get("/overview")
def get_ta_overview(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """TA overview with stats across all assigned courses."""
    ta_enrollments = _get_ta_enrollments(db, user.id)
    if not ta_enrollments:
        return {
            "assigned_courses": 0,
            "pending_grading": 0,
            "graded_this_week": 0,
            "total_students": 0,
            "courses": [],
        }

    course_ids = [e.course_id for e in ta_enrollments]

    # Stats
    pending_grading = db.query(func.count(Submission.id)).filter(
        Submission.assignment_id.in_(
            db.query(Assignment.id).filter(Assignment.course_id.in_(course_ids))
        ),
        Submission.status.in_(["pending", "grading"]),
    ).scalar() or 0

    graded_this_week = 0  # Placeholder — would need graded_by field

    total_students = db.query(func.count(Enrollment.id)).filter(
        Enrollment.course_id.in_(course_ids),
        Enrollment.role == "student",
    ).scalar() or 0

    # Build course list
    courses_data = []
    for enrollment in ta_enrollments:
        course = db.query(Course).filter(Course.id == enrollment.course_id).first()
        if not course:
            continue

        # Find instructor
        instructor_enrollment = db.query(Enrollment).filter(
            Enrollment.course_id == course.id,
            Enrollment.role == "instructor",
        ).first()
        instructor = None
        if instructor_enrollment:
            instructor = db.query(User).filter(User.id == instructor_enrollment.user_id).first()

        student_count = db.query(func.count(Enrollment.id)).filter(
            Enrollment.course_id == course.id,
            Enrollment.role == "student",
        ).scalar() or 0

        course_pending = db.query(func.count(Submission.id)).filter(
            Submission.assignment_id.in_(
                db.query(Assignment.id).filter(Assignment.course_id == course.id)
            ),
            Submission.status.in_(["pending", "grading"]),
        ).scalar() or 0

        assignment_count = db.query(func.count(Assignment.id)).filter(
            Assignment.course_id == course.id,
        ).scalar() or 0

        permissions = _get_permissions(db, enrollment.id)

        courses_data.append({
            "id": course.id,
            "name": course.name,
            "code": course.code,
            "description": course.description,
            "is_active": course.is_active,
            "instructor_name": instructor.name if instructor else None,
            "student_count": student_count,
            "assignment_count": assignment_count,
            "pending_grading": course_pending,
            "enrollment_id": enrollment.id,
            "permissions": permissions,
        })

    return {
        "assigned_courses": len(ta_enrollments),
        "pending_grading": pending_grading,
        "graded_this_week": graded_this_week,
        "total_students": total_students,
        "courses": courses_data,
    }


# ==================== Permissions ====================

@router.get("/permissions")
def get_my_permissions(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get all TA permissions for the current user across all courses."""
    ta_enrollments = _get_ta_enrollments(db, user.id)
    result = {}
    for enrollment in ta_enrollments:
        result[enrollment.course_id] = _get_permissions(db, enrollment.id)
    return result


@router.get("/courses/{course_id}/permissions")
def get_course_permissions(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get TA permissions for a specific course."""
    enrollment = _require_ta_for_course(db, user.id, course_id)
    return _get_permissions(db, enrollment.id)


# ==================== Assignments ====================

@router.get("/courses/{course_id}/assignments")
def get_course_assignments(
    course_id: int,
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get all assignments for a course the TA is assigned to."""
    enrollment = _require_ta_for_course(db, user.id, course_id)
    permissions = _get_permissions(db, enrollment.id)

    course = db.query(Course).filter(Course.id == course_id).first()

    q = db.query(Assignment).filter(Assignment.course_id == course_id)
    if search:
        q = q.filter(Assignment.title.ilike(f"%{search}%"))

    assignments = q.order_by(desc(Assignment.due_date)).all()
    result = []

    for a in assignments:
        # Submission stats
        total_students = db.query(func.count(Enrollment.id)).filter(
            Enrollment.course_id == course_id,
            Enrollment.role == "student",
        ).scalar() or 0

        total_submissions = db.query(func.count(Submission.id)).filter(
            Submission.assignment_id == a.id,
        ).scalar() or 0

        graded_count = db.query(func.count(Submission.id)).filter(
            Submission.assignment_id == a.id,
            Submission.status == "graded",
        ).scalar() or 0

        pending_count = db.query(func.count(Submission.id)).filter(
            Submission.assignment_id == a.id,
            Submission.status.in_(["pending", "grading"]),
        ).scalar() or 0

        # Filter by status
        if status == "pending" and pending_count == 0:
            continue
        if status == "graded" and graded_count == 0:
            continue

        # Get rubric count
        rubric_count = db.query(func.count(Rubric.id)).filter(
            Rubric.assignment_id == a.id,
        ).scalar() or 0

        testcase_count = db.query(func.count(TestCase.id)).filter(
            TestCase.assignment_id == a.id,
        ).scalar() or 0

        result.append({
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "due_date": a.due_date.isoformat() if a.due_date else None,
            "max_submissions": a.max_submissions,
            "allowed_languages": a.allowed_languages,
            "is_active": a.is_active,
            "total_students": total_students,
            "total_submissions": total_submissions,
            "graded_count": graded_count,
            "pending_count": pending_count,
            "rubric_count": rubric_count,
            "testcase_count": testcase_count,
            "course_name": course.name if course else None,
            "course_code": course.code if course else None,
            "permissions": permissions,
        })

    return result


# ==================== Submissions ====================

@router.get("/courses/{course_id}/submissions")
def get_course_submissions(
    course_id: int,
    assignment_id: Optional[int] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get submissions for a course. Requires can_view_submissions."""
    enrollment = _require_ta_for_course(db, user.id, course_id)
    permissions = _get_permissions(db, enrollment.id)
    _require_permission(permissions, "can_view_submissions", "view submissions")

    # Get assignment IDs for this course
    assignment_ids = [a.id for a in db.query(Assignment.id).filter(
        Assignment.course_id == course_id,
    ).all()]

    if not assignment_ids:
        return {"submissions": [], "total": 0}

    q = db.query(Submission).filter(Submission.assignment_id.in_(assignment_ids))

    if assignment_id:
        q = q.filter(Submission.assignment_id == assignment_id)

    if status:
        q = q.filter(Submission.status == status)

    # Search by student name
    if search:
        matching_users = db.query(User.id).filter(
            User.name.ilike(f"%{search}%")
        ).all()
        matching_ids = [u.id for u in matching_users]
        q = q.filter(Submission.student_id.in_(matching_ids))

    total = q.count()
    submissions = q.order_by(desc(Submission.created_at)).offset(skip).limit(limit).all()

    result = []
    for s in submissions:
        student = db.query(User).filter(User.id == s.student_id).first()
        assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()

        # Count test results
        test_passed = db.query(func.count(SubmissionResult.id)).filter(
            SubmissionResult.submission_id == s.id,
            SubmissionResult.passed == True,
        ).scalar() or 0
        test_total = db.query(func.count(SubmissionResult.id)).filter(
            SubmissionResult.submission_id == s.id,
        ).scalar() or 0

        result.append({
            "id": s.id,
            "student_id": s.student_id,
            "student_name": student.name if student else "Unknown",
            "student_email": student.email if student else None,
            "assignment_id": s.assignment_id,
            "assignment_title": assignment.title if assignment else "Unknown",
            "status": s.status,
            "score": float(s.score) if s.score is not None else None,
            "max_score": float(s.max_score) if s.max_score is not None else None,
            "feedback": s.feedback,
            "tests_passed": test_passed,
            "tests_total": test_total,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        })

    return {"submissions": result, "total": total}


# ==================== Single Submission Detail ====================

@router.get("/courses/{course_id}/submissions/{submission_id}")
def get_submission_detail(
    course_id: int,
    submission_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get full details of a single submission for grading."""
    import logging, traceback, os
    logger = logging.getLogger(__name__)
    try:
        enrollment = _require_ta_for_course(db, user.id, course_id)
        permissions = _get_permissions(db, enrollment.id)
        _require_permission(permissions, "can_view_submissions", "view submissions")

        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        # Verify submission belongs to this course
        assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
        if not assignment or assignment.course_id != course_id:
            raise HTTPException(status_code=404, detail="Submission not found in this course")

        student = db.query(User).filter(User.id == submission.student_id).first()

        # Get test results
        test_results = db.query(SubmissionResult).filter(
            SubmissionResult.submission_id == submission.id,
        ).all()

        results_data = []
        for tr in test_results:
            tc = db.query(TestCase).filter(TestCase.id == tr.testcase_id).first() if tr.testcase_id else None
            results_data.append({
                "id": tr.id,
                "testcase_id": tr.testcase_id,
                "testcase_name": tc.name if tc else None,
                "input_data": tc.input_data if tc else None,
                "expected_output": tc.expected_output if tc else None,
                "passed": tr.passed,
                "output": tr.output,
                "error_output": tr.error_output,
                "points_awarded": float(tr.points_awarded) if tr.points_awarded is not None else None,
                "execution_time_ms": tr.execution_time_ms,
            })

        # Get rubrics for this assignment
        rubrics = db.query(Rubric).filter(
            Rubric.assignment_id == submission.assignment_id,
        ).order_by(Rubric.order).all()

        rubrics_data = [{
            "id": r.id,
            "name": r.name,
            "description": r.description,
            "weight": float(r.weight) if r.weight is not None else None,
            "max_points": float(r.max_points) if r.max_points is not None else None,
            "order": r.order,
        } for r in rubrics]

        # Get submission files
        files_data = []
        if hasattr(submission, 'files') and submission.files:
            for f in submission.files:
                # Read file content from disk
                file_content = None
                if f.path:
                    try:
                        if os.path.exists(f.path):
                            with open(f.path, 'r', errors='replace') as fh:
                                file_content = fh.read()
                    except Exception:
                        file_content = None

                files_data.append({
                    "id": f.id,
                    "filename": f.filename,
                    "content": file_content,
                    "file_size": f.file_size if hasattr(f, 'file_size') else None,
                })

        # Count total submissions by this student for this assignment
        attempt_count = db.query(func.count(Submission.id)).filter(
            Submission.assignment_id == submission.assignment_id,
            Submission.student_id == submission.student_id,
        ).scalar() or 0

        return {
            "id": submission.id,
            "student": {
                "id": student.id if student else None,
                "name": student.name if student else "Unknown",
                "email": student.email if student else None,
            },
            "assignment": {
                "id": assignment.id,
                "title": assignment.title,
                "due_date": assignment.due_date.isoformat() if assignment.due_date else None,
                "max_submissions": assignment.max_submissions,
                "allowed_languages": assignment.allowed_languages,
            },
            "status": submission.status,
            "score": float(submission.score) if submission.score is not None else None,
            "max_score": float(submission.max_score) if submission.max_score is not None else None,
            "feedback": submission.feedback,
            "created_at": submission.created_at.isoformat() if submission.created_at else None,
            "attempt_number": attempt_count,
            "files": files_data,
            "test_results": results_data,
            "rubrics": rubrics_data,
            "permissions": permissions,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_submission_detail: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Run Tests ====================

@router.post("/courses/{course_id}/submissions/{submission_id}/run-tests")
def ta_run_tests(
    course_id: int,
    submission_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Run all test cases against a submission. Requires can_run_tests."""
    import logging, traceback, os
    logger = logging.getLogger(__name__)
    try:
        enrollment = _require_ta_for_course(db, user.id, course_id)
        permissions = _get_permissions(db, enrollment.id)
        _require_permission(permissions, "can_run_tests", "run tests")

        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
        if not assignment or assignment.course_id != course_id:
            raise HTTPException(status_code=404, detail="Submission not found in this course")

        # Get test cases for the assignment
        testcases = db.query(TestCase).filter(
            TestCase.assignment_id == assignment.id,
        ).all()

        if not testcases:
            raise HTTPException(status_code=400, detail="No test cases configured for this assignment")

        # Read main submission file
        files = db.query(SubmissionFile).filter(
            SubmissionFile.submission_id == submission.id
        ).all()
        if not files:
            raise HTTPException(status_code=400, detail="No files in submission")

        main_file = files[0]
        actual_path = main_file.path
        if actual_path and not os.path.isabs(actual_path) and actual_path.startswith("data/"):
            from app.settings import settings
            from pathlib import Path
            actual_path = str(Path(settings.DATA_ROOT) / actual_path[5:])

        if not actual_path or not os.path.exists(actual_path):
            raise HTTPException(status_code=400, detail="Submission file not found on disk")

        with open(actual_path, "r", errors="replace") as fh:
            code = fh.read()

        language = ExecutionService.detect_language(main_file.filename) or "python"

        # Clear old results for this submission
        db.query(SubmissionResult).filter(
            SubmissionResult.submission_id == submission.id
        ).delete()
        db.flush()

        # Run all test cases
        execution_results = ExecutionService.run_all_testcases(
            code=code,
            language=language,
            testcases=testcases,
        )

        # Store results in database
        for result in execution_results["results"]:
            db_result = SubmissionResult(
                submission_id=submission.id,
                testcase_id=result["testcase_id"],
                passed=result["passed"],
                output=result["actual_output"],
                error_output=result.get("stderr", ""),
                points_awarded=result["points_earned"],
                execution_time_ms=result.get("execution_time_ms"),
            )
            db.add(db_result)

        db.commit()

        # Return results including test case details
        stored_results = db.query(SubmissionResult).filter(
            SubmissionResult.submission_id == submission.id
        ).all()

        results_data = []
        for tr in stored_results:
            tc = db.query(TestCase).filter(TestCase.id == tr.testcase_id).first() if tr.testcase_id else None
            results_data.append({
                "id": tr.id,
                "testcase_id": tr.testcase_id,
                "testcase_name": tc.name if tc else None,
                "is_public": tc.is_public if tc else None,
                "input_data": tc.input_data if tc else None,
                "expected_output": tc.expected_output if tc else None,
                "passed": tr.passed,
                "output": tr.output,
                "error_output": tr.error_output,
                "points_awarded": float(tr.points_awarded) if tr.points_awarded is not None else None,
                "execution_time_ms": tr.execution_time_ms,
            })

        return {
            "submission_id": submission.id,
            "total_testcases": execution_results["total_testcases"],
            "passed_testcases": execution_results["passed_testcases"],
            "total_points": execution_results["total_points"],
            "earned_points": execution_results["earned_points"],
            "score_percentage": execution_results["score_percentage"],
            "results": results_data,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in ta_run_tests: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Auto-Grade Submission ====================

@router.post("/courses/{course_id}/submissions/{submission_id}/auto-grade")
def ta_auto_grade(
    course_id: int,
    submission_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Auto-grade a submission: run tests + rubric evaluation. Requires can_grade."""
    import logging, traceback
    logger = logging.getLogger(__name__)
    try:
        enrollment = _require_ta_for_course(db, user.id, course_id)
        permissions = _get_permissions(db, enrollment.id)
        _require_permission(permissions, "can_grade", "grade submissions")

        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
        if not assignment or assignment.course_id != course_id:
            raise HTTPException(status_code=404, detail="Submission not found in this course")

        # Clear old results
        db.query(SubmissionResult).filter(
            SubmissionResult.submission_id == submission.id
        ).delete()
        db.flush()

        # Use the grading service to run tests + rubric
        submission.status = "grading"
        db.commit()

        results = GradingService.grade_submission(
            db=db,
            submission_id=submission.id,
            run_tests=True,
            apply_rubric=True,
        )

        # Update submission with grading results
        submission.status = "graded"
        submission.score = results["total_score"]
        submission.max_score = results["max_score"]
        submission.feedback = "\n".join(results["feedback"]) if results["feedback"] else None
        from datetime import datetime
        submission.graded_at = datetime.utcnow()
        db.commit()
        db.refresh(submission)

        # Also fetch the stored test results for the response
        stored_results = db.query(SubmissionResult).filter(
            SubmissionResult.submission_id == submission.id
        ).all()

        results_data = []
        for tr in stored_results:
            tc = db.query(TestCase).filter(TestCase.id == tr.testcase_id).first() if tr.testcase_id else None
            results_data.append({
                "id": tr.id,
                "testcase_id": tr.testcase_id,
                "testcase_name": tc.name if tc else None,
                "input_data": tc.input_data if tc else None,
                "expected_output": tc.expected_output if tc else None,
                "passed": tr.passed,
                "output": tr.output,
                "error_output": tr.error_output,
                "points_awarded": float(tr.points_awarded) if tr.points_awarded is not None else None,
                "execution_time_ms": tr.execution_time_ms,
            })

        return {
            "submission_id": submission.id,
            "status": submission.status,
            "score": float(submission.score) if submission.score is not None else None,
            "max_score": float(submission.max_score) if submission.max_score is not None else None,
            "feedback": submission.feedback,
            "percentage": results["percentage"],
            "test_results": results.get("test_results"),
            "rubric_results": results.get("rubric_results"),
            "stored_results": results_data,
            "message": "Auto-grading complete",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in ta_auto_grade: {traceback.format_exc()}")
        submission.status = "error"
        submission.feedback = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Auto-grading failed: {str(e)}")


# ==================== Get Test Cases ====================

@router.get("/courses/{course_id}/assignments/{assignment_id}/testcases")
def ta_get_testcases(
    course_id: int,
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get test cases for an assignment. Respects can_view_private_tests."""
    enrollment = _require_ta_for_course(db, user.id, course_id)
    permissions = _get_permissions(db, enrollment.id)
    _require_permission(permissions, "can_run_tests", "view test cases")

    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment or assignment.course_id != course_id:
        raise HTTPException(status_code=404, detail="Assignment not found in this course")

    query = db.query(TestCase).filter(TestCase.assignment_id == assignment_id)
    if not permissions.get("can_view_private_tests", False):
        query = query.filter(TestCase.is_public == True)

    testcases = query.all()

    return [
        {
            "id": tc.id,
            "name": tc.name,
            "input_data": tc.input_data,
            "expected_output": tc.expected_output,
            "is_public": tc.is_public,
            "points": tc.points,
            "timeout_seconds": tc.timeout_seconds,
        }
        for tc in testcases
    ]


# ==================== Grade Submission ====================

@router.post("/courses/{course_id}/submissions/{submission_id}/grade")
def grade_submission(
    course_id: int,
    submission_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """TA submits a grade for a submission."""
    enrollment = _require_ta_for_course(db, user.id, course_id)
    permissions = _get_permissions(db, enrollment.id)
    _require_permission(permissions, "can_grade", "grade submissions")

    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if not assignment or assignment.course_id != course_id:
        raise HTTPException(status_code=404, detail="Submission not found in this course")

    score = payload.get("score")
    max_score = payload.get("max_score")
    feedback = payload.get("feedback", "")
    is_draft = payload.get("is_draft", False)

    if score is not None:
        submission.score = score
    if max_score is not None:
        submission.max_score = max_score
    if feedback:
        submission.feedback = feedback

    submission.status = "grading" if is_draft else "graded"

    db.commit()
    db.refresh(submission)

    return {
        "id": submission.id,
        "status": submission.status,
        "score": float(submission.score) if submission.score is not None else None,
        "max_score": float(submission.max_score) if submission.max_score is not None else None,
        "feedback": submission.feedback,
        "message": "Draft saved" if is_draft else "Grade submitted",
    }


# ==================== Students ====================

@router.get("/courses/{course_id}/students")
def get_course_students(
    course_id: int,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get all students in a course. Requires can_view_students."""
    enrollment = _require_ta_for_course(db, user.id, course_id)
    permissions = _get_permissions(db, enrollment.id)
    _require_permission(permissions, "can_view_students", "view students")

    student_enrollments = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.role == "student",
    ).all()

    result = []
    for se in student_enrollments:
        student = db.query(User).filter(User.id == se.user_id).first()
        if not student:
            continue
        if search and search.lower() not in student.name.lower() and search.lower() not in student.email.lower():
            continue

        # Get submission stats for this student in this course
        assignment_ids = [a.id for a in db.query(Assignment.id).filter(
            Assignment.course_id == course_id,
        ).all()]

        total_assignments = len(assignment_ids)
        submitted = 0
        total_score = 0
        graded_count = 0

        if assignment_ids:
            submitted = db.query(func.count(func.distinct(Submission.assignment_id))).filter(
                Submission.student_id == student.id,
                Submission.assignment_id.in_(assignment_ids),
            ).scalar() or 0

            graded_submissions = db.query(Submission).filter(
                Submission.student_id == student.id,
                Submission.assignment_id.in_(assignment_ids),
                Submission.status == "graded",
                Submission.score.isnot(None),
                Submission.max_score.isnot(None),
            ).all()

            for gs in graded_submissions:
                if gs.max_score and gs.max_score > 0:
                    total_score += (gs.score / gs.max_score) * 100
                    graded_count += 1

        avg_grade = round(total_score / graded_count, 1) if graded_count > 0 else None

        result.append({
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "is_active": student.is_active,
            "submissions_count": submitted,
            "total_assignments": total_assignments,
            "average_grade": avg_grade,
        })

    return result


# ==================== Gradebook / Reports ====================

@router.get("/courses/{course_id}/gradebook")
def get_course_gradebook(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get gradebook data for a course. Requires can_access_reports."""
    enrollment = _require_ta_for_course(db, user.id, course_id)
    permissions = _get_permissions(db, enrollment.id)
    _require_permission(permissions, "can_access_reports", "access reports")

    course = db.query(Course).filter(Course.id == course_id).first()
    assignments = db.query(Assignment).filter(
        Assignment.course_id == course_id,
    ).order_by(Assignment.due_date).all()

    student_enrollments = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.role == "student",
    ).all()

    assignments_data = [{
        "id": a.id,
        "title": a.title,
        "max_points": 100,  # Default
        "due_date": a.due_date.isoformat() if a.due_date else None,
    } for a in assignments]

    students_data = []
    for se in student_enrollments:
        student = db.query(User).filter(User.id == se.user_id).first()
        if not student:
            continue

        grades = {}
        total_earned = 0
        total_possible = 0

        for a in assignments:
            sub = db.query(Submission).filter(
                Submission.student_id == student.id,
                Submission.assignment_id == a.id,
                Submission.status == "graded",
            ).order_by(desc(Submission.created_at)).first()

            if sub and sub.score is not None:
                grades[str(a.id)] = {
                    "score": float(sub.score),
                    "max_score": float(sub.max_score) if sub.max_score else 100,
                    "submission_id": sub.id,
                }
                total_earned += float(sub.score)
                total_possible += float(sub.max_score) if sub.max_score else 100
            else:
                grades[str(a.id)] = None

        students_data.append({
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "grades": grades,
            "total_earned": total_earned,
            "total_possible": total_possible,
        })

    return {
        "course": {
            "id": course.id,
            "name": course.name,
            "code": course.code,
        } if course else None,
        "assignments": assignments_data,
        "students": students_data,
    }
