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
import json
import os
import re
from types import SimpleNamespace
from pathlib import Path
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult
from app.models.testcase import TestCase
from app.models.rubric import Rubric
from app.models.rubric_section import RubricSection
from app.services.execution_service import ExecutionService


class GradingService:
    """Service for grading student submissions."""

    _WEIGHT_EPSILON = 0.0001

    @staticmethod
    def _resolve_submission_file_path(raw_path: str) -> str:
        """Resolve stored submission path to an absolute on-disk path when needed."""
        actual_path = raw_path
        if actual_path and not os.path.isabs(actual_path) and actual_path.startswith("data/"):
            from app.settings import settings
            actual_path = str(Path(settings.DATA_ROOT) / actual_path[5:])
        return actual_path

    @staticmethod
    def _select_java_entry_filename(workspace_files: list[dict[str, str]]) -> Optional[str]:
        """
        Pick the Java entry file for multi-file submissions.
        Prefer files that contain a main method, and strongly prefer when the
        public class name matches the filename stem.
        """
        java_files = [
            f for f in workspace_files
            if ExecutionService.detect_language(str(f.get("name", ""))) == "java"
        ]
        if not java_files:
            return None

        main_pattern = re.compile(r"\bpublic\s+static\s+void\s+main\s*\(")
        public_class_pattern = re.compile(r"\bpublic\s+class\s+([A-Za-z_]\w*)")
        candidates: list[tuple[int, str]] = []

        for file_obj in java_files:
            filename = str(file_obj.get("name", ""))
            content = str(file_obj.get("content", ""))
            if not main_pattern.search(content):
                continue

            file_stem = Path(filename).stem
            public_class_match = public_class_pattern.search(content)
            public_class_name = public_class_match.group(1) if public_class_match else None

            score = 1
            if public_class_name and public_class_name == file_stem:
                score = 3
            elif public_class_name:
                score = 2

            candidates.append((score, filename))

        if candidates:
            candidates.sort(key=lambda item: (-item[0], item[1]))
            return candidates[0][1]

        return str(java_files[0].get("name", "")) or None

    @staticmethod
    def _load_submission_workspace(
        files: list[SubmissionFile],
    ) -> tuple[list[dict[str, str]], str, str, Optional[str]]:
        """
        Load all submission files into an execution workspace and select entry file.

        Returns:
            (workspace_files, language, entry_code, entry_filename)
        """
        workspace_files: list[dict[str, str]] = []
        load_errors: list[str] = []
        for file_row in sorted(files, key=lambda f: f.id or 0):
            actual_path = GradingService._resolve_submission_file_path(file_row.path)
            if not actual_path or not os.path.exists(actual_path):
                load_errors.append(
                    f"Missing file: '{actual_path or file_row.path}'"
                )
                continue

            try:
                with open(actual_path, "r", errors="replace") as fh:
                    content = fh.read()
            except Exception as e:
                load_errors.append(f"Error reading {actual_path}: {str(e)}")
                continue

            filename = (file_row.filename or "").strip() or Path(actual_path).name
            workspace_files.append({
                "name": filename,
                "content": content,
            })

        if not workspace_files:
            detail = "; ".join(load_errors) if load_errors else "No files in submission"
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=detail,
            )

        # Detect language from available files.
        language = "python"
        for file_obj in workspace_files:
            detected = ExecutionService.detect_language(str(file_obj.get("name", "")))
            if detected:
                language = detected
                break

        # Select entry file.
        entry_filename: Optional[str] = None
        if language == "java":
            entry_filename = GradingService._select_java_entry_filename(workspace_files)

        if entry_filename is None:
            for file_obj in workspace_files:
                if ExecutionService.detect_language(str(file_obj.get("name", ""))) == language:
                    entry_filename = str(file_obj.get("name", ""))
                    break

        if entry_filename is None:
            entry_filename = str(workspace_files[0].get("name", ""))

        entry_code = next(
            (str(file_obj.get("content", "")) for file_obj in workspace_files if str(file_obj.get("name", "")) == entry_filename),
            str(workspace_files[0].get("content", "")),
        )

        return workspace_files, language, entry_code, entry_filename

    @staticmethod
    def _to_weight_percent(weight: Optional[float], fallback: float = 0.0) -> float:
        """Normalize stored weight value to a percentage-style number."""
        if weight is None:
            return fallback
        try:
            value = float(weight)
        except (TypeError, ValueError):
            return fallback
        if value < 0:
            return 0.0
        # Legacy DB stores criterion weight as a fraction of section.
        return value * 100.0 if value <= 1.5 else value

    @staticmethod
    def _resolve_section_criterion_weights(
        section_weight_percent: float,
        criterion_weights_percent: list[Optional[float]],
    ) -> list[float]:
        """
        Resolve criterion effective global weights for a section.

        Mirrors frontend logic so weighted auto-grade totals line up with the
        grading UI. Handles both:
        - global criterion weights (sum ~= section weight)
        - relative criterion weights (sum ~= 100 inside a section)
        """
        count = len(criterion_weights_percent)
        if count == 0:
            return []

        section_weight = max(0.0, float(section_weight_percent or 0.0))
        present = [
            0.0 if w is None else max(0.0, float(w))
            for w in criterion_weights_percent
        ]
        total_present = sum(present)

        if total_present <= GradingService._WEIGHT_EPSILON:
            each = (section_weight / count) if section_weight > GradingService._WEIGHT_EPSILON else 0.0
            return [each for _ in range(count)]

        global_total = total_present
        relative_total = (total_present * section_weight) / 100.0
        global_diff = abs(global_total - section_weight)
        relative_diff = abs(relative_total - section_weight)
        use_global_weights = global_diff <= relative_diff

        if use_global_weights:
            return present

        return [(w * section_weight) / 100.0 for w in present]

    @staticmethod
    def _derive_test_ratio(test_results: Optional[dict]) -> Optional[float]:
        """Return test performance as a [0,1] ratio when available."""
        if not test_results:
            return None

        total_points = float(test_results.get("total_points") or 0)
        earned_points = float(test_results.get("earned_points") or 0)
        if total_points > 0:
            return max(0.0, min(earned_points / total_points, 1.0))

        total_cases = int(test_results.get("total_testcases") or 0)
        passed_cases = int(test_results.get("passed_testcases") or 0)
        if total_cases > 0:
            return max(0.0, min(passed_cases / total_cases, 1.0))

        return None

    @staticmethod
    def _is_test_focused_criterion(
        name: Optional[str],
        description: Optional[str],
        grading_method: Optional[str],
    ) -> bool:
        method = (grading_method or "").strip().lower()
        if method in {"auto", "hybrid"}:
            return True

        text = f"{name or ''} {description or ''}".lower()
        keywords = (
            "test",
            "correctness",
            "output",
            "functionality",
            "pass",
            "edge case",
            "expected",
        )
        return any(key in text for key in keywords)

    @staticmethod
    def _default_comment_for_grade(
        default_comments_raw: Optional[str],
        grade: int,
    ) -> Optional[str]:
        """Return rubric default comment for a computed 0-5 grade tier."""
        if not default_comments_raw:
            return None
        try:
            payload = json.loads(default_comments_raw)
        except Exception:
            return None
        if not isinstance(payload, dict):
            return None
        value = payload.get(str(grade))
        if value is None:
            value = payload.get(grade)
        if value is None:
            return None
        text = str(value).strip()
        return text or None

    @staticmethod
    def _blend_rubric_and_test_ratio(
        rubric_ratio: float,
        test_ratio: Optional[float],
        *,
        grading_method: Optional[str],
        is_test_focused: bool,
    ) -> float:
        """
        Blend rubric heuristic with test performance.

        This guarantees auto-grade suggestions include both rubric intent and
        observed testcase behavior whenever tests are available.
        """
        base = max(0.0, min(float(rubric_ratio), 1.0))
        if test_ratio is None:
            return base

        test = max(0.0, min(float(test_ratio), 1.0))
        method = (grading_method or "").strip().lower()

        if is_test_focused or method == "auto":
            score = (0.9 * test) + (0.1 * base)
        elif method == "hybrid":
            score = (0.6 * test) + (0.4 * base)
        else:
            # Manual rows still get a light test signal so suggestions remain
            # grounded in execution outcomes.
            score = (0.2 * test) + (0.8 * base)

        return max(0.0, min(score, 1.0))

    @staticmethod
    def _evaluate_sectioned_rubric(
        assignment: Optional[Assignment],
        rubric_sections: list[RubricSection],
        code: str,
        test_results: Optional[dict] = None,
    ) -> dict:
        """
        Evaluate modern section/criterion rubric format.

        Supports both weighted and unweighted rubric modes and emits criterion-
        level evaluations that the grading UI can prefill directly.
        """
        weighted_mode = (getattr(assignment, "rubric_mode", None) or "unweighted") == "weighted"
        test_ratio = GradingService._derive_test_ratio(test_results)

        evaluations: list[dict] = []
        total_points = 0.0
        earned_points = 0.0

        for section in rubric_sections:
            section_criteria = sorted(
                section.criteria or [],
                key=lambda c: ((c.order or 0), c.id),
            )
            if not section_criteria:
                continue

            if weighted_mode:
                section_weight_percent = GradingService._to_weight_percent(section.weight, 100.0)
                criterion_weight_percents = [
                    GradingService._to_weight_percent(c.weight, 0.0) if c.weight is not None else None
                    for c in section_criteria
                ]
                effective_weight_percents = GradingService._resolve_section_criterion_weights(
                    section_weight_percent,
                    criterion_weight_percents,
                )
            else:
                effective_weight_percents = [0.0 for _ in section_criteria]

            for idx, criterion in enumerate(section_criteria):
                criterion_name = criterion.name or "Criterion"
                criterion_description = criterion.description or ""
                grading_method = criterion.grading_method or "manual"
                is_test_focused = GradingService._is_test_focused_criterion(
                    criterion_name,
                    criterion_description,
                    grading_method,
                )

                proxy_rubric = SimpleNamespace(
                    name=criterion_name,
                    description=criterion_description,
                )
                rubric_ratio, heuristic_feedback = GradingService._simple_rubric_check(
                    code,
                    proxy_rubric,
                )
                blended_ratio = GradingService._blend_rubric_and_test_ratio(
                    rubric_ratio,
                    test_ratio,
                    grading_method=grading_method,
                    is_test_focused=is_test_focused,
                )

                if weighted_mode:
                    effective_weight = max(
                        0.0,
                        float(effective_weight_percents[idx] if idx < len(effective_weight_percents) else 0.0),
                    )
                    grade_tier = int(round(blended_ratio * 5))
                    grade_tier = max(0, min(grade_tier, 5))
                    display_earned = float(grade_tier)
                    display_max = 5.0
                    points_awarded = (grade_tier / 5.0) * effective_weight if effective_weight > 0 else 0.0
                    total_points += effective_weight
                    earned_points += points_awarded
                    weight_percent = effective_weight
                else:
                    criterion_max = float(criterion.max_points or 0)
                    if criterion_max <= 0:
                        criterion_max = 5.0
                    points_awarded = criterion_max * blended_ratio
                    grade_tier = int(round((points_awarded / criterion_max) * 5)) if criterion_max > 0 else 0
                    grade_tier = max(0, min(grade_tier, 5))
                    display_earned = points_awarded
                    display_max = criterion_max
                    total_points += criterion_max
                    earned_points += points_awarded
                    weight_percent = None

                feedback_parts: list[str] = []
                default_comment = GradingService._default_comment_for_grade(
                    criterion.default_comments,
                    grade_tier,
                )
                if default_comment:
                    feedback_parts.append(default_comment)
                if heuristic_feedback:
                    feedback_parts.append(heuristic_feedback)
                if test_ratio is not None and (is_test_focused or (grading_method or "").lower() in {"auto", "hybrid"}):
                    feedback_parts.append(
                        f"Test performance: {int(round(test_ratio * 100))}% of test points earned."
                    )

                # Keep feedback concise and stable.
                seen_feedback = set()
                deduped_feedback_parts = []
                for part in feedback_parts:
                    normalized = part.strip()
                    if not normalized or normalized in seen_feedback:
                        continue
                    seen_feedback.add(normalized)
                    deduped_feedback_parts.append(normalized)
                feedback_text = "; ".join(deduped_feedback_parts) if deduped_feedback_parts else "Evaluated"

                evaluations.append(
                    {
                        # Legacy key kept for frontend compatibility.
                        "rubric_id": criterion.id,
                        "rubric_name": criterion_name,
                        "criterion_id": criterion.id,
                        "criterion_name": criterion_name,
                        "section_id": section.id,
                        "section_name": section.name,
                        "grading_method": grading_method,
                        "max_points": round(display_max, 4),
                        # For weighted mode this is the 0-5 rubric tier.
                        "earned_points": round(display_earned, 4),
                        # Contribution to overall suggested score.
                        "points_awarded": round(points_awarded, 4),
                        "grade": grade_tier,
                        "weight_percent": round(weight_percent, 4) if weight_percent is not None else None,
                        "feedback": feedback_text,
                    }
                )

        total_points = round(total_points, 4)
        earned_points = round(earned_points, 4)
        score_includes_tests = bool(test_ratio is not None and len(evaluations) > 0)

        return {
            "total_rubrics": len(evaluations),
            "total_points": total_points,
            "earned_points": earned_points,
            "evaluations": evaluations,
            # `grade_submission()` uses this flag to avoid double-counting tests.
            "has_test_rubric": score_includes_tests,
            "rubric_mode": "weighted" if weighted_mode else "unweighted",
        }

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

        workspace_files, language, code, entry_filename = GradingService._load_submission_workspace(files)

        test_results = None
        # Run test cases
        if run_tests:
            test_results = GradingService._run_tests(
                db,
                submission,
                code,
                language,
                files=workspace_files,
                entry_filename=entry_filename,
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
    def get_latest_submissions_for_assignment(
        db: Session,
        assignment_id: int,
    ) -> List[Submission]:
        """
        Return only the latest submission for each student in an assignment.
        Latest is determined by (created_at, id) descending.
        """
        submissions = db.query(Submission).filter(
            Submission.assignment_id == assignment_id
        ).all()

        latest_by_student: dict[int, Submission] = {}
        for sub in submissions:
            existing = latest_by_student.get(sub.student_id)
            if existing is None:
                latest_by_student[sub.student_id] = sub
                continue

            current_key = (
                sub.created_at or datetime.min,
                sub.id,
            )
            existing_key = (
                existing.created_at or datetime.min,
                existing.id,
            )
            if current_key > existing_key:
                latest_by_student[sub.student_id] = sub

        return list(latest_by_student.values())

    @staticmethod
    def _run_tests(
        db: Session,
        submission: Submission,
        code: str,
        language: str,
        *,
        files: Optional[list[dict[str, str]]] = None,
        entry_filename: Optional[str] = None,
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
            files=files,
            entry_filename=entry_filename,
        )

        # Replace any prior test results for this submission so repeated grading
        # runs do not accumulate duplicate rows in the UI.
        db.query(SubmissionResult).filter(
            SubmissionResult.submission_id == submission.id
        ).delete()
        db.flush()

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
        assignment = db.query(Assignment).filter(
            Assignment.id == submission.assignment_id
        ).first()

        rubric_sections = (
            db.query(RubricSection)
            .filter(RubricSection.assignment_id == submission.assignment_id)
            .order_by(RubricSection.order.asc(), RubricSection.id.asc())
            .all()
        )

        if rubric_sections:
            return GradingService._evaluate_sectioned_rubric(
                assignment=assignment,
                rubric_sections=rubric_sections,
                code=code,
                test_results=test_results,
            )

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
