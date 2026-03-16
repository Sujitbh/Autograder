"""
Grading service for AI-powered evaluation of submissions.

This service provides:
- Automated grading against test cases
- Rubric-based evaluation
- AI feedback generation (placeholder for actual AI integration)
- Score calculation and storage
"""

from typing import Optional, List
from datetime import datetime
import os
import re
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult
from app.models.submission_rubric_score import SubmissionRubricScore
from app.models.testcase import TestCase
from app.models.rubric import Rubric
from app.services.execution_service import ExecutionService


class GradingService:
    """Service for grading student submissions."""

    @staticmethod
    def get_latest_submissions_for_assignment(
        db: Session,
        assignment_id: int,
    ) -> list[Submission]:
        """Return the most recent submission for each student in an assignment."""
        submissions = db.query(Submission).filter(
            Submission.assignment_id == assignment_id,
        ).order_by(
            Submission.student_id.asc(),
            Submission.created_at.desc(),
            Submission.id.desc(),
        ).all()

        latest_by_student: dict[int, Submission] = {}
        for submission in submissions:
            if submission.student_id not in latest_by_student:
                latest_by_student[submission.student_id] = submission

        return list(latest_by_student.values())

    @staticmethod
    def _resolve_file_path(raw_path: Optional[str]) -> Optional[str]:
        """Resolve stored relative submission paths to absolute paths."""
        if not raw_path:
            return None
        if os.path.isabs(raw_path):
            return raw_path
        if raw_path.startswith("data/"):
            from app.settings import settings
            from pathlib import Path
            return str(Path(settings.DATA_ROOT) / raw_path[5:])
        return raw_path

    @staticmethod
    def _read_submission_file_content(submission_file: SubmissionFile) -> tuple[Optional[str], Optional[str]]:
        """Read one submission file and return (resolved_path, text_content)."""
        actual_path = GradingService._resolve_file_path(submission_file.path)
        if not actual_path or not os.path.exists(actual_path):
            return actual_path, None
        try:
            with open(actual_path, "r", errors="replace") as f:
                return actual_path, f.read()
        except Exception:
            return actual_path, None

    @staticmethod
    def _main_entry_score(filename: str, language: Optional[str], content: str) -> int:
        """Score how likely a file is the executable entrypoint."""
        name = (filename or "").lower()
        text = content or ""
        score = 0

        if name in {"main.py", "solution.py", "main.java", "solution.java"}:
            score += 120
        if name.startswith("main") or name.startswith("solution"):
            score += 30

        if language == "python":
            score += 20
            if "if __name__ == \"__main__\":" in text or "if __name__ == '__main__':" in text:
                score += 80
            if "input(" in text:
                score += 15
        elif language == "java":
            score += 20
            if "public static void main" in text:
                score += 100
            if re.search(r"\bclass\s+[A-Za-z_]\w*", text):
                score += 10

        return score

    @staticmethod
    def _select_main_file(files: List[SubmissionFile]) -> tuple[SubmissionFile, str]:
        """
        Select the best entrypoint file from a submission.

        Returns:
            (main_file, source_code)
        """
        if not files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No files in submission",
            )

        analyzed: list[tuple[int, int, SubmissionFile, str]] = []
        first_read_error: Optional[str] = None

        for idx, submission_file in enumerate(files):
            actual_path, content = GradingService._read_submission_file_content(submission_file)
            if content is None:
                if first_read_error is None:
                    first_read_error = actual_path or submission_file.path or submission_file.filename
                continue

            language = ExecutionService.detect_language(submission_file.filename)
            if language not in {"python", "java"}:
                continue

            score = GradingService._main_entry_score(submission_file.filename, language, content)
            analyzed.append((score, -idx, submission_file, content))

        if analyzed:
            analyzed.sort(key=lambda item: (item[0], item[1]), reverse=True)
            _, _, selected_file, selected_content = analyzed[0]
            return selected_file, selected_content

        # Fall back to first readable file when no Python/Java source is found.
        for submission_file in files:
            actual_path, content = GradingService._read_submission_file_content(submission_file)
            if content is not None:
                return submission_file, content

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reading submission file: [Errno 2] No such file or directory: '{first_read_error or files[0].path or files[0].filename}'",
        )

    @staticmethod
    def grade_submission(
        db: Session,
        submission_id: int,
        *,
        run_tests: bool = True,
        apply_rubric: bool = True,
        grader_id: Optional[int] = None,
    ) -> dict:
        """
        Grade a submission against test cases and rubric.
        
        Args:
            db: Database session
            submission_id: Submission to grade
            run_tests: Whether to run test cases
            apply_rubric: Whether to apply rubric evaluation
            
        Returns:
            Dict with grading results
        """
        # Get submission
        submission = db.query(Submission).filter(
            Submission.id == submission_id
        ).first()
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found",
            )

        # Get submission files
        files = db.query(SubmissionFile).filter(
            SubmissionFile.submission_id == submission_id
        ).all()
        if not files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No files in submission",
            )

        results = {
            "submission_id": submission_id,
            "assignment_id": submission.assignment_id,
            "test_results": None,
            "rubric_results": None,
            "total_score": 0,
            "max_score": 0,
            "percentage": 0,
            "feedback": [],
        }

        # Read likely entrypoint file for grading in multi-file submissions.
        main_file, code = GradingService._select_main_file(files)

        # Detect language
        language = ExecutionService.detect_language(main_file.filename)
        if not language:
            language = "python"  # Default fallback

        test_results = None
        # Run test cases
        if run_tests:
            test_results = GradingService._run_tests(
                db, submission, code, language
            )
            results["test_results"] = test_results
            # We only add test_results["earned_points"] to total_score ONLY IF 
            # there's no rubric item covering it. We'll handle this inside _evaluate_rubric
            # or by adjusting the final score logic.
            # To preserve legacy behavior while shifting to rubric-centric scoring:
            # results["total_score"] += test_results["earned_points"]
            # results["max_score"] += test_results["total_points"]

        # Apply rubric evaluation
        if apply_rubric:
            rubric_results = GradingService._evaluate_rubric(
                db, submission, code, test_results
            )
            results["rubric_results"] = rubric_results
            GradingService._persist_rubric_scores(
                db=db,
                submission_id=submission_id,
                evaluations=rubric_results.get("evaluations", []),
                grader_id=grader_id,
                replace_existing=True,
            )
            results["total_score"] += rubric_results["earned_points"]
            results["max_score"] += rubric_results["total_points"]
            
            # If no rubric item was "Test Cases", we add the test results independently
            if not rubric_results.get("has_test_rubric") and test_results:
                results["total_score"] += test_results["earned_points"]
                results["max_score"] += test_results["total_points"]
        elif test_results:
            results["total_score"] += test_results["earned_points"]
            results["max_score"] += test_results["total_points"]

        # Calculate percentage
        if results["max_score"] > 0:
            results["percentage"] = round(
                results["total_score"] / results["max_score"] * 100, 2
            )

        # Generate feedback summary
        results["feedback"] = GradingService._generate_feedback(results)

        return results

    @staticmethod
    def _persist_rubric_scores(
        db: Session,
        submission_id: int,
        evaluations: list[dict],
        grader_id: Optional[int] = None,
        replace_existing: bool = True,
    ) -> None:
        """Store rubric criterion scores for a submission."""
        if replace_existing:
            db.query(SubmissionRubricScore).filter(
                SubmissionRubricScore.submission_id == submission_id
            ).delete()

        for ev in evaluations or []:
            rubric_id = ev.get("rubric_id")
            if not rubric_id:
                continue

            score_awarded = int(ev.get("earned_points") or 0)
            feedback = ev.get("feedback")

            db.add(
                SubmissionRubricScore(
                    submission_id=submission_id,
                    rubric_id=rubric_id,
                    grader_id=grader_id,
                    score_awarded=score_awarded,
                    feedback=feedback,
                )
            )

        db.flush()

    @staticmethod
    def _run_tests(
        db: Session,
        submission: Submission,
        code: str,
        language: str,
    ) -> dict:
        """Run test cases against submission code."""
        # Get test cases for assignment
        testcases = db.query(TestCase).filter(
            TestCase.assignment_id == submission.assignment_id
        ).all()

        if not testcases:
            return {
                "total_testcases": 0,
                "passed_testcases": 0,
                "total_points": 0,
                "earned_points": 0,
                "results": [],
            }

        # Run all test cases
        execution_results = ExecutionService.run_all_testcases(
            code=code,
            language=language,
            testcases=testcases,
        )

        # Replace previous testcase results so repeated grading reflects the latest bulk execution.
        db.query(SubmissionResult).filter(
            SubmissionResult.submission_id == submission.id
        ).delete()

        # Store results in database
        for result in execution_results["results"]:
            db_result = SubmissionResult(
                submission_id=submission.id,
                testcase_id=result["testcase_id"],
                passed=result["passed"],
                output=result["actual_output"],
                points_awarded=result["points_earned"],
            )
            db.add(db_result)

        db.commit()

        return execution_results

    @staticmethod
    def _evaluate_rubric(
        db: Session,
        submission: Submission,
        code: str,
        test_results: Optional[dict] = None,
    ) -> dict:
        """
        Evaluate submission against rubric criteria.
        """
        rubrics = db.query(Rubric).filter(
            Rubric.assignment_id == submission.assignment_id
        ).all()

        if not rubrics:
            return {
                "total_rubrics": 0,
                "total_points": 0,
                "earned_points": 0,
                "evaluations": [],
                "has_test_rubric": False,
            }

        evaluations = []
        total_points = 0
        earned_points = 0
        has_test_rubric = False

        for rubric in rubrics:
            max_pts = rubric.max_points or 10
            name_lower = rubric.name.lower()
            
            # Check if this rubric item is for automated tests
            is_automated_test = any(x in name_lower for x in ["test case", "automated test", "correctness"])
            
            if is_automated_test and test_results and test_results.get("total_points", 0) > 0:
                has_test_rubric = True
                # Scale test results to rubric max points
                ratio = test_results["earned_points"] / test_results["total_points"]
                earned = round(max_pts * ratio)
                feedback = f"Automated evaluation based on test cases: {test_results['passed_testcases']}/{test_results['total_testcases']} passed."
            else:
                # Simple heuristic evaluation (placeholder for AI)
                score, feedback = GradingService._simple_rubric_check(
                    code, rubric
                )
                earned = int(max_pts * score)

            total_points += max_pts
            earned_points += earned

            evaluations.append({
                "rubric_id": rubric.id,
                "rubric_name": rubric.name,
                "max_points": max_pts,
                "earned_points": earned,
                "feedback": feedback,
            })

        return {
            "total_rubrics": len(rubrics),
            "total_points": total_points,
            "earned_points": earned_points,
            "evaluations": evaluations,
            "has_test_rubric": has_test_rubric,
        }

    @staticmethod
    def _simple_rubric_check(code: str, rubric: Rubric) -> tuple[float, str]:
        """
        Simple heuristic rubric evaluation.
        
        Returns:
            Tuple of (score_ratio: float 0-1, feedback: str)
        """
        score = 0.5  # Base score
        feedback_items = []

        name_lower = rubric.name.lower()
        desc_lower = (rubric.description or "").lower()

        # Check for common quality indicators
        if "comment" in name_lower or "documentation" in desc_lower:
            comment_count = code.count("#") + code.count("//") + code.count("/*")
            lines = len(code.split("\n"))
            if comment_count > lines * 0.1:
                score = 0.9
                feedback_items.append("Good use of comments")
            elif comment_count > 0:
                score = 0.7
                feedback_items.append("Some comments present, could add more")
            else:
                score = 0.3
                feedback_items.append("Add comments to explain your code")

        elif "naming" in name_lower or "variable" in name_lower:
            # Check for snake_case or camelCase naming
            import re
            good_names = len(re.findall(r'\b[a-z][a-z_]*[a-z]\b', code))
            if good_names > 5:
                score = 0.8
                feedback_items.append("Good naming conventions")
            else:
                score = 0.5
                feedback_items.append("Consider using more descriptive variable names")

        elif "function" in name_lower or "modular" in desc_lower:
            # Check for function definitions
            func_count = code.count("def ") + code.count("function ")
            if func_count >= 3:
                score = 0.9
                feedback_items.append("Good modular structure")
            elif func_count >= 1:
                score = 0.7
                feedback_items.append("Consider breaking code into more functions")
            else:
                score = 0.4
                feedback_items.append("Use functions to organize your code")

        elif "error" in name_lower or "exception" in name_lower:
            if "try" in code or "except" in code or "catch" in code:
                score = 0.8
                feedback_items.append("Error handling present")
            else:
                score = 0.4
                feedback_items.append("Add error handling for robustness")

        else:
            # Default evaluation
            score = 0.7
            feedback_items.append("Meets basic requirements")

        feedback = "; ".join(feedback_items) if feedback_items else "Evaluated"
        return score, feedback

    @staticmethod
    def _generate_feedback(results: dict) -> list[str]:
        """Generate human-readable feedback from grading results."""
        feedback = []

        # Test case feedback
        if results["test_results"]:
            tr = results["test_results"]
            passed = tr["passed_testcases"]
            total = tr["total_testcases"]
            if passed == total:
                feedback.append(f"Excellent! All {total} test cases passed.")
            elif passed > 0:
                feedback.append(
                    f"Passed {passed}/{total} test cases. "
                    "Review failing cases for edge conditions."
                )
            else:
                feedback.append(
                    "No test cases passed. Check your logic and output format."
                )

        # Rubric feedback
        if results["rubric_results"]:
            rr = results["rubric_results"]
            if rr["total_rubrics"] > 0:
                ratio = rr["earned_points"] / rr["total_points"]
                if ratio >= 0.9:
                    feedback.append("Code quality is excellent.")
                elif ratio >= 0.7:
                    feedback.append("Code quality is good with room for improvement.")
                else:
                    feedback.append("Focus on improving code quality aspects.")

        # Overall
        if results["percentage"] >= 90:
            feedback.append("Great work overall!")
        elif results["percentage"] >= 70:
            feedback.append("Good effort, keep improving!")
        elif results["percentage"] >= 50:
            feedback.append("Review the material and try again.")
        else:
            feedback.append("Consider seeking help from instructors.")

        return feedback

    @staticmethod
    def get_results(
        db: Session,
        submission_id: int,
    ) -> List[SubmissionResult]:
        """Get all grading results for a submission."""
        return db.query(SubmissionResult).filter(
            SubmissionResult.submission_id == submission_id
        ).all()

    @staticmethod
    def get_assignment_stats(
        db: Session,
        assignment_id: int,
    ) -> dict:
        """Get grading statistics for an assignment."""
        from sqlalchemy import func

        submissions = db.query(Submission).filter(
            Submission.assignment_id == assignment_id
        ).all()

        if not submissions:
            return {
                "total_submissions": 0,
                "graded_submissions": 0,
                "average_score": 0,
                "highest_score": 0,
                "lowest_score": 0,
            }

        submission_ids = [s.id for s in submissions]

        # Get results
        results = db.query(SubmissionResult).filter(
            SubmissionResult.submission_id.in_(submission_ids)
        ).all()

        # Calculate scores per submission
        scores = {}
        for r in results:
            if r.submission_id not in scores:
                scores[r.submission_id] = 0
            scores[r.submission_id] += r.points_awarded or 0

        score_values = list(scores.values()) if scores else [0]

        return {
            "total_submissions": len(submissions),
            "graded_submissions": len(scores),
            "average_score": sum(score_values) / len(score_values) if score_values else 0,
            "highest_score": max(score_values) if score_values else 0,
            "lowest_score": min(score_values) if score_values else 0,
        }
