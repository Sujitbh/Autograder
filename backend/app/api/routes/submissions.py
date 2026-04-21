import os
import re
import difflib
from collections import Counter
from pathlib import Path
from typing import List, Any

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.permissions import require_role, require_course_role
from app.models.assignment import Assignment
from app.models.rubric_section import RubricSection
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult
from app.models.submission_rubric_score import SubmissionRubricScore
from app.models.testcase import TestCase
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionOut, SubmissionWithStudent
from app.services.ai_detector_service import predict_ai_likelihood
from app.settings import settings

router = APIRouter(prefix="/submissions", tags=["submissions"])


SOURCE_EXTENSIONS = {".py", ".java", ".cpp", ".c", ".js", ".ts", ".go", ".rs", ".kt", ".swift"}
AI_SCORABLE_EXTENSIONS_BY_LANGUAGE = {
    "python": {".py"},
    "java": {".java"},
}
EXTENSION_TO_AI_LANGUAGE = {
    ".py": "python",
    ".java": "java",
}
ASSIGNMENT_LANGUAGE_ALIASES = {
    "python": "python",
    "py": "python",
    "python3": "python",
    "java": "java",
}


def _resolve_submission_disk_path(stored: str | None) -> str | None:
    """Map DB path to a path that exists on this server (handles data/ relative and moved trees)."""
    if not stored or not str(stored).strip():
        return None
    p = str(stored).strip()
    candidates: list[str] = []
    if os.path.isabs(p):
        candidates.append(p)
    if p.startswith("data/"):
        candidates.append(str(Path(settings.DATA_ROOT) / p[5:]))
    if not os.path.isabs(p):
        candidates.append(str(Path(settings.DATA_ROOT) / p))
    candidates.append(p)
    seen: set[str] = set()
    for c in candidates:
        if c in seen:
            continue
        seen.add(c)
        if c and os.path.isfile(c):
            return c
    return None


def _extract_primary_source_file(files: list[SubmissionFile]) -> tuple[str | None, str | None]:
    """Return (filename, content) for the best candidate source file in a submission."""
    candidates: list[tuple[str, str]] = []
    for f in files:
        actual_path = _resolve_submission_disk_path(f.path)
        if not actual_path:
            continue
        try:
            with open(actual_path, "r", encoding="utf-8", errors="replace") as fh:
                content = fh.read()
            if content.strip():
                candidates.append((f.filename, content))
        except Exception:
            continue

    if not candidates:
        return None, None

    # Prefer source-like extensions, then longest file.
    candidates.sort(key=lambda item: ((Path(item[0]).suffix.lower() not in SOURCE_EXTENSIONS), -len(item[1])))
    return candidates[0]


def _normalize_assignment_language_token(token: str | None) -> str | None:
    if token is None:
        return None
    normalized = token.strip().lower()
    if not normalized:
        return None
    return ASSIGNMENT_LANGUAGE_ALIASES.get(normalized)


def _language_from_filename(filename: str | None) -> str | None:
    if not filename:
        return None
    return EXTENSION_TO_AI_LANGUAGE.get(Path(filename).suffix.lower())


def _resolve_assignment_ai_language(assignment: Assignment | None) -> tuple[str | None, str | None]:
    if assignment is None:
        return None, "assignment_missing"

    raw = getattr(assignment, "allowed_languages", None)
    if raw is None or not str(raw).strip():
        return None, "assignment_allowed_languages_missing"

    tokens = [token.strip() for token in str(raw).split(",") if token.strip()]
    if not tokens:
        return None, "assignment_allowed_languages_missing"

    primary_token = tokens[0]
    primary_language = _normalize_assignment_language_token(primary_token)
    if primary_language in AI_SCORABLE_EXTENSIONS_BY_LANGUAGE:
        return primary_language, None

    for token in tokens[1:]:
        normalized = _normalize_assignment_language_token(token)
        if normalized in AI_SCORABLE_EXTENSIONS_BY_LANGUAGE:
            return normalized, f"primary_assignment_language_unsupported:{primary_token.lower()}"

    return None, f"assignment_language_unsupported:{primary_token.lower()}"


def _read_submission_source_files(files: list[SubmissionFile]) -> list[dict[str, str]]:
    source_files: list[dict[str, str]] = []
    for f in files:
        filename = f.filename or ""
        actual_path = _resolve_submission_disk_path(f.path)
        if not actual_path:
            continue
        try:
            with open(actual_path, "r", encoding="utf-8", errors="replace") as fh:
                code = fh.read()
        except Exception:
            continue

        if not code.strip():
            continue

        source_files.append(
            {
                "filename": filename,
                "code": code,
                "extension": Path(filename).suffix.lower(),
            }
        )
    return source_files


def _select_relevant_ai_source_files(
    source_files: list[dict[str, str]],
    assignment_language: str | None,
    assignment_language_reason: str | None,
) -> tuple[list[dict[str, str]], str | None]:
    if assignment_language in AI_SCORABLE_EXTENSIONS_BY_LANGUAGE:
        wanted_extensions = AI_SCORABLE_EXTENSIONS_BY_LANGUAGE[assignment_language]
        relevant = [item for item in source_files if item["extension"] in wanted_extensions]
        if relevant:
            return relevant, assignment_language_reason
        expected = ",".join(sorted(wanted_extensions))
        return [], f"no_relevant_files_for_assignment_language:{assignment_language}:{expected}"

    python_files = [item for item in source_files if item["extension"] == ".py"]
    java_files = [item for item in source_files if item["extension"] == ".java"]

    if python_files and not java_files:
        reason = assignment_language_reason or "assignment_language_unknown"
        return python_files, f"{reason};fallback_used:python_only_submission_files"
    if java_files and not python_files:
        reason = assignment_language_reason or "assignment_language_unknown"
        return java_files, f"{reason};fallback_used:java_only_submission_files"
    if python_files and java_files:
        reason = assignment_language_reason or "assignment_language_unknown"
        return [], f"{reason};mixed_supported_file_types_without_assignment_language"

    return [], assignment_language_reason or "no_supported_python_or_java_submission_files"


def _confidence_band(confidence: float) -> str:
    if confidence >= 0.65:
        return "high"
    if confidence >= 0.40:
        return "medium"
    return "low"


def _strip_comments(code: str) -> str:
    # Remove Python/JS/C style line comments.
    no_line_comments = re.sub(r"(^|\s)#.*$|//.*$", "", code, flags=re.MULTILINE)
    # Remove block comments and docstrings.
    no_block_comments = re.sub(r"/\*.*?\*/|'''[\s\S]*?'''|\"\"\"[\s\S]*?\"\"\"", "", no_line_comments, flags=re.MULTILINE)
    return no_block_comments


def _normalize_code(code: str) -> str:
    code = _strip_comments(code)
    # Keep identifiers/keywords, remove punctuation to reduce superficial differences.
    tokens = re.findall(r"[A-Za-z_][A-Za-z0-9_]*|\d+", code.lower())
    return " ".join(tokens)


def _token_jaccard(a: str, b: str) -> float:
    a_tokens = set(a.split())
    b_tokens = set(b.split())
    if not a_tokens or not b_tokens:
        return 0.0
    inter = len(a_tokens & b_tokens)
    union = len(a_tokens | b_tokens)
    return inter / union if union else 0.0


def _similarity_percent(code_a: str, code_b: str) -> float:
    norm_a = _normalize_code(code_a)
    norm_b = _normalize_code(code_b)
    char_ratio = difflib.SequenceMatcher(None, norm_a, norm_b).ratio()
    token_ratio = _token_jaccard(norm_a, norm_b)
    score = (0.65 * char_ratio) + (0.35 * token_ratio)
    return round(score * 100, 2)


def _heuristic_ai_likelihood(code: str) -> dict:
    """Heuristic AI-likelihood estimator (advisory only, not a definitive detector)."""
    lowered = code.lower()
    lines = [ln for ln in code.splitlines() if ln.strip()]
    words = re.findall(r"[A-Za-z_][A-Za-z0-9_]*", code)

    comment_lines = sum(1 for ln in code.splitlines() if ln.strip().startswith(("#", "//", "*")))
    comment_ratio = (comment_lines / len(lines)) if lines else 0.0

    avg_identifier_len = (sum(len(w) for w in words) / len(words)) if words else 0.0
    avg_line_len = (sum(len(ln) for ln in lines) / len(lines)) if lines else 0.0

    phrase_markers = [
        "edge case", "time complexity", "space complexity", "robust", "optimize",
        "readability", "best practice", "input validation", "error handling",
    ]
    marker_hits = sum(1 for p in phrase_markers if p in lowered)

    generic_name_markers = [
        "processdata", "calculateresult", "handleinput", "mainlogic", "performoperation",
    ]
    joined_identifiers = " ".join(w.lower() for w in words)
    generic_hits = sum(1 for p in generic_name_markers if p in joined_identifiers)

    score = 18.0
    signals: list[str] = []

    if comment_ratio > 0.22:
        score += 16
        signals.append("High explanatory-comment ratio")
    if marker_hits >= 2:
        score += 18
        signals.append("Contains multiple polished explanatory phrases")
    if "/**" in code or "@param" in lowered or "@return" in lowered:
        score += 10
        signals.append("Uses formal documentation style")
    if 35 <= avg_line_len <= 80:
        score += 8
        signals.append("Consistent medium-length lines")
    if avg_identifier_len > 8.5:
        score += 8
        signals.append("Long descriptive identifier naming")
    if generic_hits > 0:
        score += 8
        signals.append("Uses generic helper-style naming")

    score = max(5.0, min(95.0, score))
    band = "low"
    if score >= 65:
        band = "high"
    elif score >= 40:
        band = "medium"

    return {
        "score": round(score, 1),
        "band": band,
        "signals": signals,
        "disclaimer": "AI detection is advisory only; use instructor judgement and corroborating evidence.",
    }


def _resolve_ai_threshold(threshold: float | None) -> float:
    raw = settings.AI_DETECTOR_DEFAULT_THRESHOLD if threshold is None else threshold
    try:
        parsed = float(raw)
    except Exception:
        parsed = float(settings.AI_DETECTOR_DEFAULT_THRESHOLD)
    return max(0.0, min(1.0, parsed))


def _is_ai_detection_enabled(assignment: Assignment | None) -> bool:
    if assignment is None:
        return True
    return bool(getattr(assignment, "ai_detection_enabled", True))


def _is_auto_flag_enabled(assignment: Assignment | None) -> bool:
    if assignment is None:
        return True
    return bool(getattr(assignment, "auto_flag_enabled", True))


def _assignment_threshold(assignment: Assignment | None) -> float | None:
    if assignment is None:
        return None
    raw = getattr(assignment, "auto_flag_threshold", None)
    if raw is None:
        return None
    try:
        return _resolve_ai_threshold(float(raw))
    except Exception:
        return None


def _effective_ai_threshold(assignment: Assignment | None, override_threshold: float | None) -> float:
    if override_threshold is not None:
        return _resolve_ai_threshold(override_threshold)
    assignment_threshold = _assignment_threshold(assignment)
    if assignment_threshold is not None:
        return assignment_threshold
    return _resolve_ai_threshold(None)


def _build_ai_result_from_confidence(
    confidence: float,
    threshold: float,
    model_language: str | None,
    *,
    extra_signals: list[str] | None = None,
    force_unflag: bool = False,
) -> dict:
    confidence = max(0.0, min(1.0, float(confidence)))
    threshold = _resolve_ai_threshold(threshold)
    flagged = (confidence >= threshold) and (not force_unflag)
    band = _confidence_band(confidence)

    signals = list(extra_signals or [])
    if not signals:
        signals = ["Stored model confidence"]
    if model_language:
        signals.append(f"Language-specific model: {model_language}")

    return {
        "ai_confidence": round(confidence, 6),
        "ai_flagged": flagged,
        "threshold_used": round(threshold, 6),
        "model_language": model_language,
        # Compatibility fields consumed by existing frontend integrity card.
        "score": round(confidence * 100.0, 1),
        "band": band,
        "signals": signals,
        "disclaimer": "AI detection is advisory only; use instructor judgement and corroborating evidence.",
    }


def _stored_ai_likelihood(
    submission: Submission,
    threshold: float | None = None,
    *,
    force_unflag: bool = False,
) -> dict | None:
    if submission.ai_confidence is None:
        return None

    threshold_used = (
        threshold
        if threshold is not None
        else (submission.ai_threshold_used if submission.ai_threshold_used is not None else settings.AI_DETECTOR_DEFAULT_THRESHOLD)
    )

    signals = []
    if threshold is not None and submission.ai_threshold_used is not None:
        if abs(float(submission.ai_threshold_used) - float(threshold_used)) > 1e-9:
            signals.append("Flag recomputed with request threshold override")

    return _build_ai_result_from_confidence(
        confidence=float(submission.ai_confidence),
        threshold=float(threshold_used),
        model_language=submission.ai_model_language,
        extra_signals=signals,
        force_unflag=force_unflag,
    )


def _estimate_ai_likelihood(
    code: str,
    filename: str | None = None,
    threshold: float | None = None,
    *,
    force_unflag: bool = False,
) -> dict:
    detected_language = _language_from_filename(filename)

    if not code or not code.strip():
        empty_result = _build_ai_result_from_confidence(
            confidence=0.0,
            threshold=_resolve_ai_threshold(threshold),
            model_language=None,
            extra_signals=["No source code available for model scoring"],
            force_unflag=force_unflag,
        )
        empty_result["scoring_source"] = "heuristic"
        empty_result["fallback_reason"] = "empty_source_code"
        empty_result["detected_language"] = detected_language
        return empty_result

    model_result = predict_ai_likelihood(code, filename=filename, threshold=threshold)
    if model_result is not None:
        model_result = dict(model_result)
        if force_unflag:
            model_result["ai_flagged"] = False
        model_result["scoring_source"] = "model"
        model_result["fallback_reason"] = None
        model_result["detected_language"] = model_result.get("model_language") or detected_language
        return model_result

    heuristic = _heuristic_ai_likelihood(code)
    score_percent = float(heuristic.get("score", 0.0))
    threshold_used = _resolve_ai_threshold(threshold)
    return {
        "ai_confidence": round(score_percent / 100.0, 6),
        "ai_flagged": ((score_percent / 100.0) >= threshold_used) and (not force_unflag),
        "threshold_used": round(threshold_used, 6),
        "model_language": None,
        "detected_language": detected_language,
        "scoring_source": "heuristic",
        "fallback_reason": "model_unavailable_or_prediction_failed",
        "score": heuristic["score"],
        "band": heuristic["band"],
        "signals": heuristic["signals"],
        "disclaimer": heuristic["disclaimer"],
    }


def _sync_submission_ai_fields(submission: Submission, ai_result: dict | None) -> bool:
    if not ai_result:
        return False

    changed = False
    next_confidence = ai_result.get("ai_confidence")
    next_flagged = ai_result.get("ai_flagged")
    next_threshold = ai_result.get("threshold_used")
    next_language = ai_result.get("model_language")

    def _float_diff(a: float | None, b: float | None) -> bool:
        if a is None or b is None:
            return a != b
        return abs(float(a) - float(b)) > 1e-9

    if _float_diff(submission.ai_confidence, next_confidence):
        submission.ai_confidence = float(next_confidence) if next_confidence is not None else None
        changed = True

    if submission.ai_flagged != (bool(next_flagged) if next_flagged is not None else None):
        submission.ai_flagged = bool(next_flagged) if next_flagged is not None else None
        changed = True

    if _float_diff(submission.ai_threshold_used, next_threshold):
        submission.ai_threshold_used = float(next_threshold) if next_threshold is not None else None
        changed = True

    if submission.ai_model_language != next_language:
        submission.ai_model_language = next_language
        changed = True

    return changed


def _score_submission_ai_from_files(
    files: list[SubmissionFile],
    assignment: Assignment | None,
    threshold: float,
    *,
    force_unflag: bool = False,
    include_flagged_sections: bool = False,
) -> dict:
    threshold_to_use = _resolve_ai_threshold(threshold)
    assignment_language, assignment_language_reason = _resolve_assignment_ai_language(assignment)
    source_files = _read_submission_source_files(files)
    relevant_files, selection_reason = _select_relevant_ai_source_files(
        source_files,
        assignment_language=assignment_language,
        assignment_language_reason=assignment_language_reason,
    )

    if not relevant_files:
        signals: list[str] = []
        if assignment_language:
            ext_list = ",".join(sorted(AI_SCORABLE_EXTENSIONS_BY_LANGUAGE[assignment_language]))
            signals.append(f"No readable {ext_list} files found for assignment language {assignment_language}.")
        else:
            signals.append("Could not determine assignment language for AI scoring.")
        result = _build_ai_result_from_confidence(
            confidence=0.0,
            threshold=threshold_to_use,
            model_language=None,
            extra_signals=signals,
            force_unflag=force_unflag,
        )
        result.update(
            {
                "scoring_source": "none",
                "fallback_reason": selection_reason or "no_relevant_source_files",
                "assignment_language_filter": assignment_language,
                "aggregation_method": "max_ai_confidence",
                "evaluated_file_count": 0,
                "threshold_exceeded": False,
                "file_results": [],
                "flagged_sections": [],
            }
        )
        return result

    file_results: list[dict[str, Any]] = []
    flagged_sections: list[dict[str, Any]] = []
    fallback_reasons: list[str] = []
    heuristic_count = 0

    for item in relevant_files:
        filename = item["filename"]
        code = item["code"]
        estimated = _estimate_ai_likelihood(
            code,
            filename=filename,
            threshold=threshold_to_use,
            force_unflag=force_unflag,
        )

        confidence = max(0.0, min(1.0, float(estimated.get("ai_confidence", 0.0))))
        item_threshold = _resolve_ai_threshold(estimated.get("threshold_used", threshold_to_use))
        threshold_exceeded = confidence >= item_threshold
        file_flagged = threshold_exceeded and (not force_unflag)

        detected_language = estimated.get("detected_language") or assignment_language or _language_from_filename(filename)
        scoring_source = str(estimated.get("scoring_source") or "heuristic")
        fallback_reason = estimated.get("fallback_reason")
        if fallback_reason:
            fallback_reasons.append(str(fallback_reason))
        if scoring_source != "model":
            heuristic_count += 1

        file_result = {
            "filename": filename,
            "detected_language": detected_language,
            "scoring_source": scoring_source,
            "fallback_reason": fallback_reason,
            "ai_confidence": round(confidence, 6),
            "threshold_used": round(item_threshold, 6),
            "threshold_exceeded": bool(threshold_exceeded),
            "file_flagged": bool(file_flagged),
            "score": round(confidence * 100.0, 1),
            "band": _confidence_band(confidence),
            "signals": list(estimated.get("signals") or []),
        }
        file_results.append(file_result)

        if include_flagged_sections and file_flagged:
            flagged_sections.extend(
                _flagged_code_sections(
                    code,
                    filename=filename,
                    threshold=item_threshold,
                )
            )

    max_confidence = max(float(item["ai_confidence"]) for item in file_results)
    threshold_exceeded_any = any(bool(item["threshold_exceeded"]) for item in file_results)
    flagged_any = any(bool(item["file_flagged"]) for item in file_results)
    sources = {str(item.get("scoring_source") or "heuristic") for item in file_results}

    if len(sources) == 1:
        scoring_source = next(iter(sources))
    else:
        scoring_source = "mixed"

    summary_signals = [
        f"Evaluated {len(file_results)} file(s) and aggregated with max AI confidence.",
    ]
    if assignment_language:
        summary_signals.append(f"Assignment language filter: {assignment_language}.")
    if heuristic_count > 0:
        summary_signals.append(f"Heuristic fallback used for {heuristic_count} file(s).")

    if selection_reason:
        fallback_reasons.append(selection_reason)

    deduped_reasons = sorted({reason for reason in fallback_reasons if reason})
    aggregate = _build_ai_result_from_confidence(
        confidence=max_confidence,
        threshold=threshold_to_use,
        model_language=assignment_language,
        extra_signals=summary_signals,
        force_unflag=force_unflag,
    )
    aggregate.update(
        {
            "ai_flagged": bool(flagged_any),
            "scoring_source": scoring_source,
            "fallback_reason": "; ".join(deduped_reasons) if deduped_reasons else None,
            "assignment_language_filter": assignment_language,
            "aggregation_method": "max_ai_confidence",
            "evaluated_file_count": len(file_results),
            "threshold_exceeded": bool(threshold_exceeded_any),
            "file_results": file_results,
            "flagged_sections": flagged_sections if include_flagged_sections else [],
        }
    )
    return aggregate


def _chunk_windows(line_count: int, window_size: int = 24, step: int = 10) -> list[tuple[int, int]]:
    if line_count <= 0:
        return []
    if line_count <= window_size:
        return [(0, line_count)]

    windows: list[tuple[int, int]] = []
    start = 0
    while start < line_count:
        end = min(start + window_size, line_count)
        windows.append((start, end))
        if end >= line_count:
            break
        start += step

    if windows and windows[-1][1] < line_count:
        windows.append((max(0, line_count - window_size), line_count))

    return windows


def _chunk_confidence(chunk_code: str, filename: str | None) -> float:
    model_result = predict_ai_likelihood(chunk_code, filename=filename, threshold=0.0)
    if model_result is not None and model_result.get("ai_confidence") is not None:
        try:
            return max(0.0, min(1.0, float(model_result["ai_confidence"])))
        except Exception:
            pass
    heuristic = _heuristic_ai_likelihood(chunk_code)
    return max(0.0, min(1.0, float(heuristic.get("score", 0.0)) / 100.0))


def _flagged_code_sections(
    code: str,
    filename: str | None,
    threshold: float,
) -> list[dict[str, Any]]:
    lines = code.splitlines()
    if not lines:
        return []

    windows = _chunk_windows(len(lines))
    flagged_windows: list[dict[str, Any]] = []
    for start, end in windows:
        chunk = "\n".join(lines[start:end]).strip()
        if not chunk:
            continue
        confidence = _chunk_confidence(chunk, filename=filename)
        if confidence >= threshold:
            flagged_windows.append(
                {
                    "start_line": start + 1,
                    "end_line": end,
                    "confidence": confidence,
                }
            )

    if not flagged_windows:
        return []

    flagged_windows.sort(key=lambda item: item["start_line"])
    merged: list[dict[str, Any]] = []
    for current in flagged_windows:
        if not merged:
            merged.append(dict(current))
            continue
        prev = merged[-1]
        if current["start_line"] <= prev["end_line"] + 1:
            prev["end_line"] = max(prev["end_line"], current["end_line"])
            prev["confidence"] = max(prev["confidence"], current["confidence"])
        else:
            merged.append(dict(current))

    merged.sort(key=lambda item: item["start_line"])

    sections: list[dict[str, Any]] = []
    for block in merged:
        start_line = int(block["start_line"])
        end_line = int(block["end_line"])
        snippet_lines = lines[start_line - 1:end_line]
        sections.append(
            {
                "filename": filename,
                "start_line": start_line,
                "end_line": end_line,
                "score": round(float(block["confidence"]) * 100.0, 1),
                "threshold": round(float(threshold) * 100.0, 1),
                "snippet": "\n".join(snippet_lines),
            }
        )

    return sections


def _build_integrity_report(
    db: Session,
    submission: Submission,
    assignment: Assignment | None = None,
    ai_threshold: float | None = None,
    match_limit: int | None = 5,
) -> dict:
    threshold_to_use = _effective_ai_threshold(assignment, ai_threshold)
    ai_detection_enabled = _is_ai_detection_enabled(assignment)
    auto_flag_enabled = _is_auto_flag_enabled(assignment)
    force_unflag = (not ai_detection_enabled) or (not auto_flag_enabled)

    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == submission.id).all()
    current_filename, current_code = _extract_primary_source_file(files)
    ai_detection = _score_submission_ai_from_files(
        files,
        assignment=assignment,
        threshold=threshold_to_use,
        force_unflag=force_unflag,
        include_flagged_sections=ai_detection_enabled and auto_flag_enabled,
    )

    if not ai_detection_enabled:
        ai_detection["signals"] = ["AI detection is disabled for this assignment."] + list(ai_detection.get("signals") or [])
        ai_detection["flagged_sections"] = []

    if not current_code:
        return {
            "plagiarism": {
                "checked_against": 0,
                "top_matches": [],
                "note": "No source code found for current submission.",
                "peers_with_latest_submission": 0,
                "peers_skipped_no_file_rows": 0,
                "peers_skipped_unreadable_on_disk": 0,
            },
            "ai_detection": ai_detection,
        }

    # Compare against latest submission from each *other* student in the same assignment.
    all_subs = db.query(Submission).filter(Submission.assignment_id == submission.assignment_id).order_by(Submission.created_at.desc()).all()
    latest_by_student: dict[int, Submission] = {}
    for sub in all_subs:
        if sub.student_id == submission.student_id:
            continue
        if sub.student_id not in latest_by_student:
            latest_by_student[sub.student_id] = sub

    peers_with_latest = len(latest_by_student)
    peers_skipped_no_file_rows = 0
    peers_skipped_unreadable_on_disk = 0
    matches = []
    for other in latest_by_student.values():
        other_files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == other.id).all()
        if not other_files:
            peers_skipped_no_file_rows += 1
            continue
        other_filename, other_code = _extract_primary_source_file(other_files)
        if not other_code:
            peers_skipped_unreadable_on_disk += 1
            continue

        similarity = _similarity_percent(current_code, other_code)
        other_student = db.query(User).filter(User.id == other.student_id).first()
        matches.append({
            "submission_id": other.id,
            "student_id": other.student_id,
            "student_name": other_student.name if other_student else f"Student {other.student_id}",
            "student_email": other_student.email if other_student else None,
            "status": other.status,
            "submitted_at": other.created_at.isoformat() if other.created_at else None,
            "filename": other_filename,
            "similarity_percent": similarity,
            "risk": "high" if similarity >= 75 else "medium" if similarity >= 55 else "low",
        })

    matches.sort(key=lambda m: m["similarity_percent"], reverse=True)
    if match_limit is None:
        top = matches
    else:
        top = matches[:match_limit]

    return {
        "plagiarism": {
            "checked_against": len(matches),
            "top_matches": top,
            "note": "Similarity is based on normalized code/token overlap and should be reviewed manually.",
            "peers_with_latest_submission": peers_with_latest,
            "peers_skipped_no_file_rows": peers_skipped_no_file_rows,
            "peers_skipped_unreadable_on_disk": peers_skipped_unreadable_on_disk,
        },
        "ai_detection": ai_detection,
    }


def safe_folder_name(s: str) -> str:
    """Keep it simple + safe for folders."""
    return "".join(ch if ch.isalnum() or ch in ("@", ".", "_", "-") else "_" for ch in s)


@router.get("/", response_model=List[SubmissionOut])
def list_submissions(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role == "admin":
        return db.query(Submission).all()
    if user.role == "student":
        return db.query(Submission).filter(Submission.student_id == user.id).all()
    return db.query(Submission).all()


@router.post("/", response_model=SubmissionOut)
def create_submission(
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    assignment = db.query(Assignment).filter(Assignment.id == payload.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["student", "ta"])

    s = Submission(assignment_id=payload.assignment_id, student_id=user.id)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@router.get("/{s_id}", response_model=SubmissionOut)
def get_submission(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )

    threshold_to_use = _effective_ai_threshold(assignment, None)
    force_unflag = (not _is_ai_detection_enabled(assignment)) or (not _is_auto_flag_enabled(assignment))
    submission_files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s.id).all()
    ai_snapshot = _score_submission_ai_from_files(
        submission_files,
        assignment=assignment,
        threshold=threshold_to_use,
        force_unflag=force_unflag,
        include_flagged_sections=False,
    )
    if _sync_submission_ai_fields(s, ai_snapshot):
        db.add(s)
        db.commit()
        db.refresh(s)

    return s


@router.get("/{s_id}/detail")
def get_submission_detail(
    s_id: int,
    ai_threshold: float | None = Query(default=None, ge=0.0, le=1.0),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get detailed submission with file contents and test results."""
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )

    threshold_to_use = _effective_ai_threshold(assignment, ai_threshold)
    force_unflag = (not _is_ai_detection_enabled(assignment)) or (not _is_auto_flag_enabled(assignment))

    # Build files with content
    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s_id).all()
    files_out = []
    for f in files:
        content = None
        actual_path = _resolve_submission_disk_path(f.path)
        if actual_path:
            try:
                with open(actual_path, "r", encoding="utf-8", errors="replace") as fh:
                    content = fh.read()
            except Exception:
                content = None
        files_out.append({
            "id": f.id,
            "filename": f.filename,
            "content": content,
        })

    # Build test results
    raw_results = (
        db.query(SubmissionResult)
        .filter(SubmissionResult.submission_id == s_id)
        .all()
    )
    results_out = []
    private_idx = 0
    for r in raw_results:
        tc = db.query(TestCase).filter(TestCase.id == r.testcase_id).first() if r.testcase_id else None
        is_private = tc and not tc.is_public
        is_student = user.role == "student"

        if is_student and is_private:
            # Students see that a private test exists and whether it passed,
            # but never see the name, expected output, or actual output.
            private_idx += 1
            results_out.append({
                "testcase_id": r.testcase_id or r.id,
                "test_name": f"Private Test {private_idx}",
                "passed": r.passed,
                "actual_output": "(hidden)",
                "expected_output": "(hidden)",
                "execution_time_ms": r.execution_time_ms or 0,
                "points": tc.points if tc else 0,
                "points_earned": r.points_awarded or 0,
                "error": None,
            })
        else:
            results_out.append({
                "testcase_id": r.testcase_id or r.id,
                "test_name": tc.name if tc else f"Test {r.id}",
                "input_data": tc.input_data if tc else "",
                "passed": r.passed,
                "actual_output": r.output or "",
                "expected_output": tc.expected_output if tc else "",
                "execution_time_ms": r.execution_time_ms or 0,
                "points": tc.points if tc else 0,
                "points_earned": r.points_awarded or 0,
                "error": r.error_output,
            })

    student_obj = db.query(User).filter(User.id == s.student_id).first()

    integrity_report = None
    # Only instructors/TAs/admin should see integrity diagnostics.
    if user.role != "student":
        integrity_report = _build_integrity_report(
            db,
            s,
            assignment=assignment,
            ai_threshold=threshold_to_use,
        )

    ai_snapshot = (
        integrity_report["ai_detection"]
        if integrity_report
        else _score_submission_ai_from_files(
            files,
            assignment=assignment,
            threshold=threshold_to_use,
            force_unflag=force_unflag,
            include_flagged_sections=False,
        )
    )

    if _sync_submission_ai_fields(s, ai_snapshot):
        db.add(s)
        db.commit()
        db.refresh(s)

    return {
        "id": s.id,
        "status": s.status,
        "score": s.score,
        "max_score": s.max_score,
        "feedback": s.feedback,
        "submitted_at": s.created_at.isoformat() if s.created_at else None,
        "files": files_out,
        "results": results_out,
        "student": {
            "id": s.student_id,
            "name": student_obj.name if student_obj else "Unknown",
            "email": student_obj.email if student_obj else None,
        },
        "assignment": {
            "id": assignment.id,
            "title": assignment.title,
            "max_points": assignment.max_points,
            "due_date": assignment.due_date.isoformat() if getattr(assignment, "due_date", None) else None,
            "language": (assignment.allowed_languages.split(",")[0].strip().lower() if assignment.allowed_languages else "python"),
            "rubric_mode": assignment.rubric_mode,
            "ai_detection_enabled": assignment.ai_detection_enabled,
            "auto_flag_enabled": assignment.auto_flag_enabled,
            "auto_flag_threshold": assignment.auto_flag_threshold,
        },
        "rubrics": [
            {
                "id": section.id,
                "assignment_id": section.assignment_id,
                "name": section.name,
                "description": section.description,
                "weight": section.weight,
                "criteria": [
                    {
                        "id": crit.id,
                        "section_id": crit.section_id,
                        "name": crit.name,
                        "description": crit.description,
                        "weight": crit.weight,
                        "max_points": crit.max_points or 0,
                        "grading_method": crit.grading_method,
                        "order": crit.order or 0,
                    }
                    for crit in sorted(section.criteria or [], key=lambda c: (c.order or 0, c.id))
                ],
            }
            for section in db.query(RubricSection)
                .filter(RubricSection.assignment_id == s.assignment_id)
                .order_by(RubricSection.order.asc(), RubricSection.id.asc())
                .all()
        ],
        "rubric_scores": [
            {
                "id": rs.id,
                "rubric_id": rs.rubric_id,
                "score_awarded": rs.score_awarded,
                "feedback": rs.feedback,
                "grader_id": rs.grader_id,
            }
            for rs in db.query(SubmissionRubricScore).filter(SubmissionRubricScore.submission_id == s.id).all()
        ],
        "attempt_number": db.query(Submission).filter(
            Submission.assignment_id == s.assignment_id,
            Submission.student_id == s.student_id,
            Submission.id <= s.id,
        ).count(),
        "ai_confidence": ai_snapshot["ai_confidence"] if ai_snapshot else None,
        "ai_flagged": ai_snapshot["ai_flagged"] if ai_snapshot else None,
        "threshold_used": ai_snapshot["threshold_used"] if ai_snapshot else None,
        "model_language": ai_snapshot["model_language"] if ai_snapshot else None,
        "integrity": integrity_report,
    }


@router.get("/{s_id}/plagiarism-scan")
def plagiarism_scan(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Full plagiarism-style similarity scan for this submission vs classmates' latest attempts.
    Instructors/TAs only; returns all matches (not capped like submission detail).
    """
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )

    if user.role == "student":
        raise HTTPException(status_code=403, detail="Not available for students")

    return _build_integrity_report(db, s, match_limit=None)


@router.get("/{s_id}/plagiarism-compare/{other_id}")
def plagiarism_compare(
    s_id: int,
    other_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Side-by-side source comparison between two submissions on the same assignment."""
    s = db.query(Submission).filter(Submission.id == s_id).first()
    other = db.query(Submission).filter(Submission.id == other_id).first()
    if not s or not other:
        raise HTTPException(status_code=404, detail="Submission not found")
    if s.assignment_id != other.assignment_id:
        raise HTTPException(status_code=400, detail="Submissions must belong to the same assignment")

    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )
    if user.role == "student":
        raise HTTPException(status_code=403, detail="Not available for students")

    base_files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s.id).all()
    peer_files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == other.id).all()
    base_fn, base_code = _extract_primary_source_file(base_files)
    peer_fn, peer_code = _extract_primary_source_file(peer_files)

    if not base_code or not peer_code:
        raise HTTPException(
            status_code=400,
            detail="Both submissions need readable primary source files for comparison.",
        )

    similarity = _similarity_percent(base_code, peer_code)
    risk = "high" if similarity >= 75 else "medium" if similarity >= 55 else "low"

    base_student = db.query(User).filter(User.id == s.student_id).first()
    peer_student = db.query(User).filter(User.id == other.student_id).first()

    diff_lines = difflib.unified_diff(
        base_code.splitlines(keepends=True),
        peer_code.splitlines(keepends=True),
        fromfile=f"{base_fn or 'submission_a'} (submission #{s.id})",
        tofile=f"{peer_fn or 'submission_b'} (submission #{other.id})",
        lineterm="",
    )
    unified_diff = "".join(diff_lines)

    return {
        "similarity_percent": similarity,
        "risk": risk,
        "base": {
            "submission_id": s.id,
            "student_id": s.student_id,
            "student_name": base_student.name if base_student else f"Student {s.student_id}",
            "filename": base_fn,
            "content": base_code,
        },
        "peer": {
            "submission_id": other.id,
            "student_id": other.student_id,
            "student_name": peer_student.name if peer_student else f"Student {other.student_id}",
            "student_email": peer_student.email if peer_student else None,
            "filename": peer_fn,
            "content": peer_code,
        },
        "unified_diff": unified_diff,
        "note": "Review the diff and both files in context; similarity is heuristic only.",
    }


@router.delete("/{s_id}")
def delete_submission(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor"],
        )
    db.delete(s)
    db.commit()
    return {"ok": True}


@router.get("/assignments/{assignment_id}")
def get_submissions_by_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get all submissions for a specific assignment."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    query = db.query(Submission).filter(Submission.assignment_id == assignment_id)
    if user.role == "student":
        query = query.filter(Submission.student_id == user.id)
        return query.all()
    elif user.role != "admin":
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )
    
    # For faculty/admin, return submissions with student details and files
    submissions = query.all()
    threshold_to_use = _effective_ai_threshold(assignment, None)
    force_unflag = (not _is_ai_detection_enabled(assignment)) or (not _is_auto_flag_enabled(assignment))
    any_ai_updates = False
    submission_ids = [sub.id for sub in submissions]
    files_by_submission_id: dict[int, list[SubmissionFile]] = {}

    if submission_ids:
        all_submission_files = (
            db.query(SubmissionFile)
            .filter(SubmissionFile.submission_id.in_(submission_ids))
            .all()
        )
        for file_record in all_submission_files:
            files_by_submission_id.setdefault(file_record.submission_id, []).append(file_record)

    for sub in submissions:
        recalculated_ai = _score_submission_ai_from_files(
            files_by_submission_id.get(sub.id, []),
            assignment=assignment,
            threshold=threshold_to_use,
            force_unflag=force_unflag,
            include_flagged_sections=False,
        )
        if _sync_submission_ai_fields(sub, recalculated_ai):
            db.add(sub)
            any_ai_updates = True

    if any_ai_updates:
        db.commit()

    assignment_testcases = db.query(TestCase).filter(TestCase.assignment_id == assignment_id).all()
    testcase_points_total = sum((tc.points or 0) for tc in assignment_testcases)
    resolved_assignment_max = testcase_points_total or assignment.max_points or 100
    result = []
    for sub in submissions:
        student = db.query(User).filter(User.id == sub.student_id).first()
        files = files_by_submission_id.get(sub.id, [])
        
        result.append({
            "id": sub.id,
            "assignment_id": sub.assignment_id,
            "student_id": sub.student_id,
            "status": sub.status,
            "score": sub.score,
            "max_score": sub.max_score,
            "ai_confidence": sub.ai_confidence,
            "ai_flagged": sub.ai_flagged,
            "ai_threshold_used": sub.ai_threshold_used,
            "ai_model_language": sub.ai_model_language,
            "display_max_score": sub.max_score if sub.max_score is not None else resolved_assignment_max,
            "feedback": sub.feedback,
            "graded_at": sub.graded_at,
            "created_at": sub.created_at,
            "student": {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "student_id": getattr(student, "sis_user_id", None),
                "sis_user_id": getattr(student, "sis_user_id", None),
            } if student else None,
            "files": [{"id": f.id, "filename": f.filename, "file_size": f.file_size} for f in files]
        })
    
    return result


@router.get("/{s_id}/files")
def get_submission_files(
    s_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get files for a submission."""
    s = db.query(Submission).filter(Submission.id == s_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    assignment = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if user.role != "admin" and s.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )

    files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == s_id).all()
    return [{"id": f.id, "filename": f.filename, "file_size": f.file_size} for f in files]


@router.get("/files/{file_id}/download")
def download_submission_file(
    file_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Download a single submission file."""
    file_record = db.query(SubmissionFile).filter(SubmissionFile.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    submission = db.query(Submission).filter(Submission.id == file_record.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Check permissions
    if user.role != "admin" and submission.student_id != user.id:
        require_course_role(
            db=db,
            user=user,
            course_id=assignment.course_id,
            allowed_roles=["instructor", "ta"],
        )
    
    actual_path = _resolve_submission_disk_path(file_record.path)
    if not actual_path:
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=actual_path,
        filename=file_record.filename,
        media_type="application/octet-stream"
    )


@router.post("/assignments/{assignment_id}/upload")
async def upload_submission_files(
    assignment_id: int,
    ai_threshold: float | None = Query(default=None, ge=0.0, le=1.0),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Upload request received for assignment {assignment_id} by user {user.email}")
    logger.info(f"Number of files: {len(files) if files else 0}")
    
    require_role(user.role, {"student", "ta"})

    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    require_course_role(db=db, user=user, course_id=assignment.course_id, allowed_roles=["student", "ta"])
    threshold_to_use = _effective_ai_threshold(assignment, ai_threshold)
    force_unflag = (not _is_ai_detection_enabled(assignment)) or (not _is_auto_flag_enabled(assignment))

    submission = Submission(assignment_id=assignment_id, student_id=user.id)
    db.add(submission)
    db.commit()
    db.refresh(submission)

    # folder structure:
    # data/assignment_<id>/<student_email>/<original files>
    root = Path(settings.DATA_ROOT)
    student_folder = safe_folder_name(user.email)
    dest_dir = root / f"assignment_{assignment_id}" / student_folder
    dest_dir.mkdir(parents=True, exist_ok=True)

    saved = 0
    for f in files:
        if not f.filename:
            continue

        # prevent path tricks
        filename = os.path.basename(f.filename)
        dest_path = dest_dir / filename

        content = await f.read()
        dest_path.write_bytes(content)

        rec = SubmissionFile(
            submission_id=submission.id,
            filename=filename,
            path=str(dest_path),
            file_size=len(content),
        )
        db.add(rec)
        saved += 1

    db.commit()

    ai_result = None
    try:
        submission_files = db.query(SubmissionFile).filter(SubmissionFile.submission_id == submission.id).all()
        ai_result = _score_submission_ai_from_files(
            submission_files,
            assignment=assignment,
            threshold=threshold_to_use,
            force_unflag=force_unflag,
            include_flagged_sections=False,
        )
        if not _is_ai_detection_enabled(assignment):
            ai_result["signals"] = ["AI detection is disabled for this assignment."] + list(ai_result.get("signals") or [])

        if _sync_submission_ai_fields(submission, ai_result):
            db.add(submission)
            db.commit()
            db.refresh(submission)
    except Exception as exc:
        logger.warning("AI detection failed for submission %s: %s", submission.id, exc)

    return {
        "submission_id": submission.id,
        "assignment_id": assignment_id,
        "student": user.email,
        "files_saved": saved,
        "folder": str(dest_dir),
        "ai_confidence": submission.ai_confidence,
        "ai_flagged": submission.ai_flagged,
        "threshold_used": submission.ai_threshold_used,
        "model_language": submission.ai_model_language,
        "ai_scoring_source": ai_result.get("scoring_source") if ai_result else None,
        "ai_fallback_reason": ai_result.get("fallback_reason") if ai_result else None,
        "ai_file_results": ai_result.get("file_results") if ai_result else [],
    }
