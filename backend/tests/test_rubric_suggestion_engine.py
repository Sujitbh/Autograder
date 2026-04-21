from types import SimpleNamespace
from typing import Optional

from app.services.grading_service import GradingService


def _criterion(
    criterion_id: int,
    *,
    name: str,
    description: str = "",
    grading_method: str = "manual",
    weight: Optional[float] = None,
    max_points: Optional[float] = 10,
):
    return SimpleNamespace(
        id=criterion_id,
        name=name,
        description=description,
        grading_method=grading_method,
        weight=weight,
        max_points=max_points,
        default_comments=None,
        order=0,
    )


def _section(section_id: int, *, name: str, weight: float | None, criteria: list):
    return SimpleNamespace(
        id=section_id,
        name=name,
        weight=weight,
        criteria=criteria,
        order=0,
    )


def test_sectioned_weighted_correctness_uses_full_test_signal():
    assignment = SimpleNamespace(rubric_mode="weighted")
    sections = [
        _section(
            1,
            name="Core",
            weight=100,
            criteria=[
                _criterion(
                    10,
                    name="Correctness",
                    description="Program output should match expected values.",
                    grading_method="auto",
                    weight=100,
                    max_points=5,
                )
            ],
        )
    ]
    test_results = {
        "total_points": 20,
        "earned_points": 20,
        "total_testcases": 4,
        "passed_testcases": 4,
    }

    result = GradingService._evaluate_sectioned_rubric(
        assignment=assignment,
        rubric_sections=sections,
        code="n = int(input())\nprint(n * 2)\n",
        language="python",
        test_results=test_results,
    )

    assert result["has_test_rubric"] is True
    assert result["total_points"] == 100.0
    assert result["earned_points"] == 100.0
    assert result["evaluations"][0]["grade"] == 5
    assert result["evaluations"][0]["points_awarded"] == 100.0


def test_sectioned_rubric_only_marks_test_coverage_when_criteria_are_test_focused():
    assignment = SimpleNamespace(rubric_mode="unweighted")
    sections = [
        _section(
            1,
            name="Style",
            weight=100,
            criteria=[
                _criterion(
                    11,
                    name="Readability",
                    description="Consistent style and clear naming.",
                    grading_method="manual",
                    max_points=10,
                )
            ],
        )
    ]
    test_results = {
        "total_points": 10,
        "earned_points": 10,
        "total_testcases": 2,
        "passed_testcases": 2,
    }

    result = GradingService._evaluate_sectioned_rubric(
        assignment=assignment,
        rubric_sections=sections,
        code="def solve(nums):\n    total_value = 0\n    for value in nums:\n        total_value += value\n    return total_value\n",
        language="python",
        test_results=test_results,
    )

    assert result["has_test_rubric"] is False
    assert result["test_focused_criteria"] == 0


def test_documentation_criterion_scores_higher_with_more_comments():
    rubric = SimpleNamespace(
        name="Documentation",
        description="Use comments to explain decisions.",
        grading_method="manual",
    )
    sparse_code = "def solve(x):\n    return x * 2\n"
    documented_code = (
        "# doubles the input for this assignment\n"
        "def solve(x):\n"
        "    # keep logic intentionally simple\n"
        "    return x * 2\n"
    )

    sparse_score, _ = GradingService._simple_rubric_check(
        sparse_code,
        rubric,
        language="python",
    )
    documented_score, _ = GradingService._simple_rubric_check(
        documented_code,
        rubric,
        language="python",
    )

    assert documented_score > sparse_score


def test_manual_general_criterion_gets_full_pass_uplift_with_strong_static_signals():
    assignment = SimpleNamespace(rubric_mode="weighted")
    sections = [
        _section(
            1,
            name="Quality",
            weight=100,
            criteria=[
                _criterion(
                    12,
                    name="Code Quality",
                    description="Readable, maintainable implementation.",
                    grading_method="manual",
                    weight=100,
                    max_points=5,
                )
            ],
        )
    ]
    test_results = {
        "total_points": 15,
        "earned_points": 15,
        "total_testcases": 3,
        "passed_testcases": 3,
    }
    code = (
        "# helper for parsing\n"
        "def parse_values(raw_values):\n"
        "    return [int(v) for v in raw_values]\n\n"
        "def solve(raw_values):\n"
        "    values = parse_values(raw_values)\n"
        "    running_total = 0\n"
        "    for value in values:\n"
        "        running_total += value\n"
        "    return running_total\n"
    )

    result = GradingService._evaluate_sectioned_rubric(
        assignment=assignment,
        rubric_sections=sections,
        code=code,
        language="python",
        test_results=test_results,
    )
    evaluation = result["evaluations"][0]

    assert evaluation["suggested_ratio"] >= 0.88
    assert evaluation["grade"] >= 4


def test_javadoc_param_requirement_influences_documentation_score():
    rubric = SimpleNamespace(
        name="Java Documentation",
        description="Use proper JavaDoc with correct @param entries for method arguments.",
        grading_method="manual",
    )
    no_javadocs = (
        "public class KnapsackSolver {\n"
        "    public int solve(int capacity, int[] weights) {\n"
        "        return capacity;\n"
        "    }\n"
        "}\n"
    )
    with_javadocs = (
        "public class KnapsackSolver {\n"
        "    /**\n"
        "     * Solves the knapsack problem.\n"
        "     * @param capacity bag capacity\n"
        "     * @param weights available weights\n"
        "     * @return best value\n"
        "     */\n"
        "    public int solve(int capacity, int[] weights) {\n"
        "        return capacity;\n"
        "    }\n"
        "}\n"
    )

    low_score, _ = GradingService._simple_rubric_check(
        no_javadocs,
        rubric,
        language="java",
    )
    high_score, _ = GradingService._simple_rubric_check(
        with_javadocs,
        rubric,
        language="java",
    )

    assert high_score > low_score
    assert high_score >= 0.8
