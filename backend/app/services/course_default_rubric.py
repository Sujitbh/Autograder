"""Validation and normalization for course default rubrics."""

from __future__ import annotations

import json
from copy import deepcopy
from typing import Any

from pydantic import ValidationError

from app.schemas.course_default_rubric import (
    CourseDefaultRubricOut,
    CourseDefaultRubricPut,
    CourseDefaultRubricSection,
)

SUM_TOLERANCE = 0.55


def builtin_professor_default_rubric() -> dict[str, Any]:
    """Four-section CS assignment rubric matching the professor's grading form.

    Grade scale 0–5, criterion-level % weights summing to 100.
    Each criterion carries default comments for every score level.
    """
    return {
        "rubricMode": "weighted",
        "weightPolicy": "percent",
        "pointBudget": 100.0,
        "sections": [
            {
                "name": "Correctness",
                "description": "",
                "weight": 60.0,
                "criteria": [
                    {
                        "name": "Correct Output",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 30.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "All test cases produce expected output",
                            "4": "Most test cases pass with minor output issues",
                            "3": "Some test cases fail; partial correctness",
                            "2": "Many test cases fail; significant output errors",
                            "1": "Very few test cases pass",
                            "0": "Program does not produce correct output",
                        },
                    },
                    {
                        "name": "Output Quality",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 10.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Excellent output format; exceeds requirements",
                            "4": "Good output format with minor issues",
                            "3": "Acceptable output format",
                            "2": "Output format needs improvement",
                            "1": "Poor output formatting",
                            "0": "No meaningful output",
                        },
                    },
                    {
                        "name": "Specification",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 10.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Meets specified requirements without exception",
                            "4": "Meets most requirements; minor deviations",
                            "3": "Partially meets requirements",
                            "2": "Significant specification deviations",
                            "1": "Barely meets any specifications",
                            "0": "Does not meet specifications",
                        },
                    },
                    {
                        "name": "Testing",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 0.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Comprehensive test coverage",
                            "4": "Good test coverage",
                            "3": "Adequate testing",
                            "2": "Minimal testing",
                            "1": "Insufficient testing",
                            "0": "No testing provided",
                        },
                    },
                    {
                        "name": "Efficiency",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 10.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Program operates with optimal efficiency",
                            "4": "Good efficiency; minor optimization possible",
                            "3": "Acceptable efficiency",
                            "2": "Noticeable performance issues",
                            "1": "Significant inefficiencies",
                            "0": "Extremely inefficient or non-functional",
                        },
                    },
                ],
            },
            {
                "name": "Style",
                "description": "",
                "weight": 25.0,
                "criteria": [
                    {
                        "name": "Code Style",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 10.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Consistent, clean coding style throughout",
                            "4": "Good style with minor inconsistencies",
                            "3": "Acceptable style; some issues",
                            "2": "Inconsistent style throughout",
                            "1": "Poor coding style",
                            "0": "No adherence to coding standards",
                        },
                    },
                    {
                        "name": "Prg. Design/Modularity",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 10.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Exemplary class/module decomposition",
                            "4": "Good modularity with minor issues",
                            "3": "Acceptable design structure",
                            "2": "Poor modularity; tightly coupled",
                            "1": "Minimal design structure",
                            "0": "No modular design",
                        },
                    },
                    {
                        "name": "Parameter Usage",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 5.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Minimal scope applied to all identifiers",
                            "4": "Good scope management; minor issues",
                            "3": "Acceptable parameter usage",
                            "2": "Overuse of global scope",
                            "1": "Poor parameter management",
                            "0": "No scope management",
                        },
                    },
                ],
            },
            {
                "name": "Documentation",
                "description": "",
                "weight": 15.0,
                "criteria": [
                    {
                        "name": "Neatness/Clarity",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 5.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Layout, indentation consistent and attractive",
                            "4": "Good formatting with minor issues",
                            "3": "Acceptable neatness",
                            "2": "Inconsistent formatting",
                            "1": "Poor formatting",
                            "0": "Unreadable formatting",
                        },
                    },
                    {
                        "name": "General Documentation",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 5.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Exemplary and accurate general comments",
                            "4": "Good documentation; minor omissions",
                            "3": "Adequate documentation",
                            "2": "Sparse documentation",
                            "1": "Minimal documentation",
                            "0": "No documentation",
                        },
                    },
                    {
                        "name": "Module-level",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 5.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Module comments are complete. Correct format",
                            "4": "Good module comments; minor issues",
                            "3": "Acceptable module-level comments",
                            "2": "Incomplete module comments",
                            "1": "Minimal module-level documentation",
                            "0": "No module-level documentation",
                        },
                    },
                ],
            },
            {
                "name": "Design Document(s)",
                "description": "",
                "weight": 0.0,
                "criteria": [
                    {
                        "name": "Neatness/Clarity",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 0.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Design document is clean and professional",
                            "4": "Good presentation; minor issues",
                            "3": "Acceptable design document",
                            "2": "Design document needs improvement",
                            "1": "Poor design document presentation",
                            "0": "n/a",
                        },
                    },
                    {
                        "name": "Completeness",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 0.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "All required design elements present",
                            "4": "Most elements present; minor omissions",
                            "3": "Partially complete",
                            "2": "Missing significant elements",
                            "1": "Barely started",
                            "0": "n/a",
                        },
                    },
                    {
                        "name": "Agreement with Code",
                        "description": "",
                        "maxPoints": 5,
                        "weight": 0.0,
                        "gradingMethod": "manual",
                        "defaultComments": {
                            "5": "Design perfectly matches implementation",
                            "4": "Good match with minor discrepancies",
                            "3": "Partially matches code",
                            "2": "Significant design-code mismatch",
                            "1": "Design barely reflects code",
                            "0": "n/a",
                        },
                    },
                ],
            },
        ],
    }


def _section_weight_sum(sections: list[CourseDefaultRubricSection]) -> float:
    return float(sum(s.weight for s in sections))


def _normalize_section_weights_to_target(
    sections: list[CourseDefaultRubricSection], target: float
) -> list[CourseDefaultRubricSection]:
    out = deepcopy(sections)
    total = _section_weight_sum(out)
    if total <= 0:
        n = len(out)
        each = round(target / n, 3) if n else 0.0
        for s in out:
            s.weight = each
        return _fix_rounding_drift(out, target, attr="weight")
    factor = target / total
    for s in out:
        s.weight = round(s.weight * factor, 3)
    return _fix_rounding_drift(out, target, attr="weight")


def _fix_rounding_drift(
    sections: list[CourseDefaultRubricSection],
    target: float,
    *,
    attr: str,
) -> list[CourseDefaultRubricSection]:
    if not sections:
        return sections
    current = sum(getattr(s, attr) for s in sections)
    drift = round(target - current, 3)
    if abs(drift) >= 0.0005:
        last = sections[-1]
        setattr(last, attr, round(getattr(last, attr) + drift, 3))
    return sections


def _normalize_criteria_weights_per_section(
    sections: list[CourseDefaultRubricSection],
) -> list[CourseDefaultRubricSection]:
    """Scale criterion weights so each section's criteria sum to that section's weight (global %)."""
    out = deepcopy(sections)
    for sec in out:
        crits = sec.criteria
        if not crits:
            continue
        target = float(sec.weight)
        tw = sum(c.weight for c in crits)
        if tw <= 0:
            each = round(target / len(crits), 3) if crits else 0.0
            for c in crits:
                c.weight = each
        else:
            for c in crits:
                c.weight = round((c.weight / tw) * target, 3)
        csum = sum(c.weight for c in crits)
        drift = round(target - csum, 3)
        if crits and abs(drift) >= 0.0005:
            crits[-1].weight = round(crits[-1].weight + drift, 3)
    return out


def validate_and_normalize_put(payload: CourseDefaultRubricPut) -> CourseDefaultRubricPut:
    """Enforce totals; optionally auto-normalize section weights to 100 (percent or point budget)."""
    data = deepcopy(payload)
    sections = data.sections

    if data.weightPolicy == "points":
        target = float(data.pointBudget)
        ssum = _section_weight_sum(sections)
        if data.autoNormalize or abs(ssum - target) > SUM_TOLERANCE:
            data.sections = _normalize_section_weights_to_target(sections, target)
        else:
            if abs(ssum - target) > SUM_TOLERANCE:
                raise ValueError(
                    f"Point weights must sum to pointBudget ({target}); got {ssum:.2f}"
                )
    else:
        ssum = _section_weight_sum(sections)
        if data.autoNormalize or abs(ssum - 100.0) > SUM_TOLERANCE:
            data.sections = _normalize_section_weights_to_target(sections, 100.0)
        else:
            if abs(ssum - 100.0) > SUM_TOLERANCE:
                raise ValueError(f"Percent section weights must sum to 100; got {ssum:.2f}")

    data.sections = _normalize_criteria_weights_per_section(data.sections)
    return data


def parse_stored_json(raw: str | None) -> CourseDefaultRubricPut | None:
    if not raw or not raw.strip():
        return None
    try:
        obj = json.loads(raw)
        return CourseDefaultRubricPut.model_validate(obj)
    except (json.JSONDecodeError, ValidationError):
        return None


def course_row_to_out(
    *,
    rubric_json: str | None,
    weight_policy: str,
    updated_at,
    updated_by_id: int | None,
    updated_by_name: str | None,
) -> CourseDefaultRubricOut:
    parsed = parse_stored_json(rubric_json)
    if parsed is None:
        builtin = builtin_professor_default_rubric()
        builtin["weightPolicy"] = weight_policy or "percent"
        model = CourseDefaultRubricPut.model_validate(builtin)
        return CourseDefaultRubricOut(
            rubricMode=model.rubricMode,
            weightPolicy=model.weightPolicy,
            pointBudget=model.pointBudget,
            sections=model.sections,
            isBuiltin=True,
            updatedAt=None,
            updatedByUserId=None,
            updatedByName=None,
        )
    return CourseDefaultRubricOut(
        rubricMode=parsed.rubricMode,
        weightPolicy=parsed.weightPolicy,
        pointBudget=parsed.pointBudget,
        sections=parsed.sections,
        isBuiltin=False,
        updatedAt=updated_at,
        updatedByUserId=updated_by_id,
        updatedByName=updated_by_name,
    )


def put_payload_to_json(payload: CourseDefaultRubricPut) -> str:
    return payload.model_dump_json()
