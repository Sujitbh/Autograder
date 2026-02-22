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
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult
from app.models.testcase import TestCase
from app.models.rubric import Rubric
from app.services.execution_service import ExecutionService


class GradingService:
    """Service for grading student submissions."""

    @staticmethod
    def grade_submission(
        db: Session,
        submission_id: int,
        *,
        run_tests: bool = True,
        apply_rubric: bool = True,
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

        # Read main code file
        main_file = files[0]  # TODO: Better logic to identify main file
        try:
            with open(main_file.path, "r") as f:
                code = f.read()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error reading submission file: {str(e)}",
            )

        # Detect language
        language = ExecutionService.detect_language(main_file.filename)
        if not language:
            language = "python"  # Default fallback

        # Run test cases
        if run_tests:
            test_results = GradingService._run_tests(
                db, submission, code, language
            )
            results["test_results"] = test_results
            results["total_score"] += test_results["earned_points"]
            results["max_score"] += test_results["total_points"]

        # Apply rubric evaluation
        if apply_rubric:
            rubric_results = GradingService._evaluate_rubric(
                db, submission, code
            )
            results["rubric_results"] = rubric_results
            results["total_score"] += rubric_results["earned_points"]
            results["max_score"] += rubric_results["total_points"]

        # Calculate percentage
        if results["max_score"] > 0:
            results["percentage"] = round(
                results["total_score"] / results["max_score"] * 100, 2
            )

        # Generate feedback summary
        results["feedback"] = GradingService._generate_feedback(results)

        return results

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
    ) -> dict:
        """
        Evaluate submission against rubric criteria.
        
        This is a simplified implementation. In production, this would
        integrate with an AI service for more sophisticated evaluation.
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
            }

        evaluations = []
        total_points = 0
        earned_points = 0

        for rubric in rubrics:
            max_pts = rubric.max_points or 10

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
                "score_ratio": score,
                "feedback": feedback,
            })

        return {
            "total_rubrics": len(rubrics),
            "total_points": total_points,
            "earned_points": earned_points,
            "evaluations": evaluations,
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
