from __future__ import annotations

import keyword
import logging
import re
import string
import threading
import traceback
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Sequence

import pandas as pd

from app.settings import settings

SUPPORTED_LANGUAGE_EXTENSIONS = {
    ".py": "python",
    ".java": "java",
}

JAVA_KEYWORDS = {
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
    "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float",
    "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native",
    "new", "package", "private", "protected", "public", "return", "short", "static", "strictfp",
    "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void",
    "volatile", "while", "true", "false", "null",
}


@dataclass(frozen=True)
class LanguageRules:
    keywords: set[str]
    identifier_pattern: re.Pattern[str]
    import_pattern: re.Pattern[str]
    class_pattern: re.Pattern[str]
    function_pattern: re.Pattern[str]
    loop_pattern: re.Pattern[str]
    conditional_pattern: re.Pattern[str]
    exception_pattern: re.Pattern[str]
    return_pattern: re.Pattern[str]
    assignment_pattern: re.Pattern[str]


_MODEL_LOCK = threading.Lock()
_MODEL_CACHE: Dict[str, Dict[str, Any]] = {}
LOGGER = logging.getLogger(__name__)

_PYTHON_RULES = LanguageRules(
    keywords=set(keyword.kwlist),
    identifier_pattern=re.compile(r"\b[A-Za-z_][A-Za-z0-9_]*\b"),
    import_pattern=re.compile(
        r"^\s*(?:import\s+\w[\w\.]*|from\s+\w[\w\.]*\s+import\s+)",
        re.MULTILINE,
    ),
    class_pattern=re.compile(r"^\s*class\s+\w+", re.MULTILINE),
    function_pattern=re.compile(r"^\s*def\s+\w+\s*\(", re.MULTILINE),
    loop_pattern=re.compile(r"\b(?:for|while)\b"),
    conditional_pattern=re.compile(r"\b(?:if|elif|else|match|case)\b"),
    exception_pattern=re.compile(r"\b(?:try|except|finally|raise)\b"),
    return_pattern=re.compile(r"\breturn\b"),
    assignment_pattern=re.compile(
        r"(?<![=!<>])=(?!=)|\+=|-=|\*=|/=|%=|//=|\*\*=|&=|\|=|\^=|>>=|<<="
    ),
)

_JAVA_RULES = LanguageRules(
    keywords=JAVA_KEYWORDS,
    identifier_pattern=re.compile(r"\b[A-Za-z_$][A-Za-z0-9_$]*\b"),
    import_pattern=re.compile(r"^\s*import\s+[\w\.\*]+\s*;", re.MULTILINE),
    class_pattern=re.compile(r"\bclass\s+\w+"),
    function_pattern=re.compile(
        r"""^\s*(?!if\b|for\b|while\b|switch\b|catch\b|do\b|else\b|try\b|return\b)
            (?:public|private|protected|static|final|abstract|synchronized|native|strictfp|\s)*
            (?:<[^>]+>\s*)?
            (?:[\w\[\]<>]+\s+)?
            \w+\s*\([^;{}]*\)\s*
            (?:throws\s+[\w\.,\s]+)?
            \{
        """,
        re.MULTILINE | re.VERBOSE,
    ),
    loop_pattern=re.compile(r"\b(?:for|while|do)\b"),
    conditional_pattern=re.compile(r"\b(?:if|else|switch|case)\b"),
    exception_pattern=re.compile(r"\b(?:try|catch|finally|throw|throws)\b"),
    return_pattern=re.compile(r"\breturn\b"),
    assignment_pattern=re.compile(
        r"(?<![=!<>])=(?!=)|\+=|-=|\*=|/=|%=|&=|\|=|\^=|>>=|<<=|>>>="
    ),
)


def _model_root_candidates() -> list[Path]:
    configured = Path(settings.AI_DETECTOR_MODEL_ROOT)
    # Support both:
    # - repo layouts where ai_detector/ is sibling of Autograder/
    # - repo layouts where ai_detector/ lives inside the app root
    app_file = Path(__file__).resolve()
    service_dir = app_file.parent
    app_dir = service_dir.parent
    backend_dir = app_dir.parent
    project_root = backend_dir.parent
    workspace_root = project_root.parent

    candidates = [
        configured,
        project_root / "ai_detector" / "models",
        workspace_root / "ai_detector" / "models",
        backend_dir / "data" / "models",
    ]

    deduped: list[Path] = []
    seen: set[str] = set()
    for candidate in candidates:
        key = str(candidate)
        if key in seen:
            continue
        seen.add(key)
        deduped.append(candidate)
    return deduped


def _models_root() -> Path:
    for candidate in _model_root_candidates():
        if candidate.exists():
            return candidate
    # Fall back to configured path for diagnostics if none exists.
    return Path(settings.AI_DETECTOR_MODEL_ROOT)


def _bundle_path(language: str) -> Path:
    roots = _model_root_candidates()
    for root in roots:
        candidate = root / language / "model_bundle.joblib"
        if candidate.exists():
            return candidate
    return roots[0] / language / "model_bundle.joblib"


def _load_bundle(language: str) -> Dict[str, Any] | None:
    bundle, _ = _load_bundle_with_error(language)
    return bundle


def _load_bundle_with_error(language: str) -> tuple[Dict[str, Any] | None, dict[str, Any]]:
    import joblib

    if language not in ("python", "java"):
        return None, {
            "reason": "unsupported_language",
            "language": language,
        }

    bundle_path = _bundle_path(language)
    mtime = bundle_path.stat().st_mtime if bundle_path.exists() else None

    cached = _MODEL_CACHE.get(language)
    if (
        cached
        and cached.get("mtime") == mtime
        and cached.get("path") == str(bundle_path)
    ):
        bundle = cached.get("bundle")
        error = cached.get("error") or {}
        return bundle, dict(error)

    with _MODEL_LOCK:
        cached = _MODEL_CACHE.get(language)
        if (
            cached
            and cached.get("mtime") == mtime
            and cached.get("path") == str(bundle_path)
        ):
            bundle = cached.get("bundle")
            error = cached.get("error") or {}
            return bundle, dict(error)

        bundle = None
        error: dict[str, Any]
        if bundle_path.exists():
            try:
                loaded = joblib.load(bundle_path)
                if isinstance(loaded, dict) and "model" in loaded:
                    bundle = loaded
                    error = {}
                else:
                    error = {
                        "reason": "invalid_bundle_format",
                        "detail": f"Expected dict with key 'model', got {type(loaded).__name__}",
                        "bundle_path": str(bundle_path),
                    }
                    LOGGER.error(
                        "AI detector bundle format invalid for %s at %s. Loaded type=%s",
                        language,
                        bundle_path,
                        type(loaded).__name__,
                    )
            except Exception:
                tb = traceback.format_exc()
                error = {
                    "reason": "bundle_load_exception",
                    "detail": "Exception while loading model bundle with joblib",
                    "exception": traceback.format_exc(limit=1).strip(),
                    "traceback": tb,
                    "bundle_path": str(bundle_path),
                }
                LOGGER.exception("Failed loading AI detector bundle for %s from %s", language, bundle_path)
        else:
            available_roots = [str(root) for root in _model_root_candidates()]
            error = {
                "reason": "bundle_file_not_found",
                "detail": f"Model bundle not found at {bundle_path}",
                "bundle_path": str(bundle_path),
                "model_root_candidates": available_roots,
                "configured_model_root": str(settings.AI_DETECTOR_MODEL_ROOT),
            }
            LOGGER.warning(
                "AI detector bundle not found for %s. expected=%s candidates=%s",
                language,
                bundle_path,
                available_roots,
            )

        _MODEL_CACHE[language] = {
            "mtime": mtime,
            "bundle": bundle,
            "error": error,
            "path": str(bundle_path),
        }
        return bundle, dict(error)


def _detect_language(code: str, filename: str | None = None) -> str | None:
    if filename:
        ext = Path(filename).suffix.lower()
        if ext in SUPPORTED_LANGUAGE_EXTENSIONS:
            return SUPPORTED_LANGUAGE_EXTENSIONS[ext]

    lowered = code.lower()
    if "def " in lowered or "import " in lowered or "elif " in lowered:
        return "python"
    if "public class " in lowered or "system.out" in lowered or "package " in lowered:
        return "java"
    return None


def _safe_mean(values: Sequence[float]) -> float:
    if not values:
        return 0.0
    return float(sum(values) / len(values))


def _line_indentation(line: str, tab_width: int = 4) -> int:
    expanded = line.expandtabs(tab_width)
    return len(expanded) - len(expanded.lstrip(" "))


def _count_python_comment_lines(lines: Sequence[str]) -> int:
    count = 0
    in_block = False
    block_delimiter = ""

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        if in_block:
            count += 1
            if block_delimiter in stripped and stripped.count(block_delimiter) % 2 == 1:
                in_block = False
            continue

        if stripped.startswith("#"):
            count += 1
            continue

        if stripped.startswith('"""') or stripped.startswith("'''"):
            count += 1
            delimiter = '"""' if stripped.startswith('"""') else "'''"
            if stripped.count(delimiter) % 2 == 1:
                in_block = True
                block_delimiter = delimiter

    return count


def _count_java_comment_lines(lines: Sequence[str]) -> int:
    count = 0
    in_block = False

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        if in_block:
            count += 1
            if "*/" in stripped:
                in_block = False
            continue

        if stripped.startswith("//"):
            count += 1
            continue

        if stripped.startswith("/*"):
            count += 1
            if "*/" not in stripped[2:]:
                in_block = True
            continue

        block_index = stripped.find("/*")
        line_comment_index = stripped.find("//")
        if block_index != -1 and (line_comment_index == -1 or block_index < line_comment_index):
            count += 1
            if "*/" not in stripped[block_index + 2:]:
                in_block = True

    return count


def _extract_numeric_features(code: str, language: str) -> Dict[str, float]:
    rules = _PYTHON_RULES if language == "python" else _JAVA_RULES

    lines = code.splitlines()
    line_count = len(lines)
    non_empty_lines = [line for line in lines if line.strip()]
    non_empty_line_count = len(non_empty_lines)
    blank_line_count = line_count - non_empty_line_count

    line_lengths = [len(line) for line in lines]
    indentations = [_line_indentation(line) for line in non_empty_lines]

    comment_line_count = (
        _count_python_comment_lines(lines) if language == "python" else _count_java_comment_lines(lines)
    )

    identifiers = rules.identifier_pattern.findall(code)
    keyword_count = sum(1 for token in identifiers if token in rules.keywords)
    unique_identifiers = {token for token in identifiers if token not in rules.keywords}

    return {
        "line_count": float(line_count),
        "non_empty_line_count": float(non_empty_line_count),
        "blank_line_count": float(blank_line_count),
        "comment_line_count": float(comment_line_count),
        "avg_line_length": _safe_mean(line_lengths),
        "max_line_length": float(max(line_lengths, default=0)),
        "avg_indentation": _safe_mean(indentations),
        "max_indentation": float(max(indentations, default=0)),
        "import_count": float(len(rules.import_pattern.findall(code))),
        "class_count": float(len(rules.class_pattern.findall(code))),
        "function_or_method_count": float(len(rules.function_pattern.findall(code))),
        "loop_count": float(len(rules.loop_pattern.findall(code))),
        "conditional_count": float(len(rules.conditional_pattern.findall(code))),
        "exception_count": float(len(rules.exception_pattern.findall(code))),
        "return_count": float(len(rules.return_pattern.findall(code))),
        "assignment_count": float(len(rules.assignment_pattern.findall(code))),
        "unique_identifier_count": float(len(unique_identifiers)),
        "avg_identifier_length": _safe_mean([len(token) for token in unique_identifiers]),
        "keyword_count": float(keyword_count),
        "digit_char_count": float(sum(1 for char in code if char.isdigit())),
        "uppercase_char_count": float(sum(1 for char in code if char.isupper())),
        "lowercase_char_count": float(sum(1 for char in code if char.islower())),
        "punctuation_char_count": float(sum(1 for char in code if char in string.punctuation)),
    }


def _positive_class_index(model: Any) -> int | None:
    classes = list(getattr(model, "classes_", []))
    if not classes:
        return None

    normalized = [str(value).strip().lower() for value in classes]
    if "1" in normalized:
        return normalized.index("1")
    if "ai" in normalized:
        return normalized.index("ai")
    if len(normalized) == 2:
        return 1
    return None


def _resolve_threshold(threshold: float | None) -> float:
    value = settings.AI_DETECTOR_DEFAULT_THRESHOLD if threshold is None else threshold
    try:
        parsed = float(value)
    except Exception:
        parsed = float(settings.AI_DETECTOR_DEFAULT_THRESHOLD)
    return max(0.0, min(1.0, parsed))


def _band_for_confidence(confidence: float) -> str:
    if confidence >= 0.65:
        return "high"
    if confidence >= 0.40:
        return "medium"
    return "low"


def _predict_ai_likelihood_internal(
    code: str,
    filename: str | None = None,
    threshold: float | None = None,
) -> tuple[dict | None, dict[str, Any]]:
    diagnostics: dict[str, Any] = {
        "filename": filename,
        "language_detected": None,
        "bundle_loaded": False,
        "bundle_path": None,
        "bundle_keys": None,
        "feature_vector_length": None,
        "feature_columns_length": None,
        "model_type": None,
        "scaler_type": None,
        "reason": None,
    }

    if not code:
        diagnostics["reason"] = "empty_code"
        return None, diagnostics

    language = _detect_language(code=code, filename=filename)
    diagnostics["language_detected"] = language
    if language not in ("python", "java"):
        diagnostics["reason"] = "unsupported_or_undetected_language"
        return None, diagnostics

    bundle_path = _bundle_path(language)
    diagnostics["bundle_path"] = str(bundle_path)

    bundle, load_error = _load_bundle_with_error(language)
    if load_error:
        diagnostics.update(load_error)
    if not bundle:
        diagnostics["reason"] = diagnostics.get("reason") or "bundle_unavailable"
        return None, diagnostics

    diagnostics["bundle_loaded"] = True
    diagnostics["bundle_keys"] = sorted(list(bundle.keys()))

    model = bundle.get("model")
    scaler = bundle.get("scaler")
    feature_columns = bundle.get("feature_columns") or []

    diagnostics["model_type"] = type(model).__name__ if model is not None else None
    diagnostics["scaler_type"] = type(scaler).__name__ if scaler is not None else None
    diagnostics["feature_columns_length"] = len(feature_columns)

    if model is None:
        diagnostics["reason"] = "bundle_model_missing"
        return None, diagnostics
    if not feature_columns:
        diagnostics["reason"] = "bundle_feature_columns_missing"
        return None, diagnostics

    feature_row = _extract_numeric_features(code=code, language=language)
    diagnostics["feature_vector_length"] = len(feature_row)
    model_input = pd.DataFrame(
        [[feature_row.get(column, 0.0) for column in feature_columns]],
        columns=feature_columns,
    )

    try:
        transformed = scaler.transform(model_input) if scaler is not None else model_input

        if not hasattr(model, "predict_proba"):
            diagnostics["reason"] = "model_missing_predict_proba"
            return None, diagnostics

        probabilities = model.predict_proba(transformed)
        positive_index = _positive_class_index(model)
        if positive_index is None:
            diagnostics["reason"] = "model_positive_class_not_resolved"
            diagnostics["classes"] = [str(value) for value in getattr(model, "classes_", [])]
            return None, diagnostics

        confidence = float(probabilities[0][positive_index])
        threshold_used = _resolve_threshold(threshold)
        flagged = confidence >= threshold_used

        winner_name = str(bundle.get("winner_model_name") or "classifier")

        result = {
            "ai_confidence": round(confidence, 6),
            "ai_flagged": bool(flagged),
            "threshold_used": round(threshold_used, 6),
            "model_language": language,
            # Compatibility fields already consumed by existing frontend integrity UI
            "score": round(confidence * 100.0, 1),
            "band": _band_for_confidence(confidence),
            "signals": [
                f"Model confidence from {winner_name}",
                f"Language-specific model: {language}",
            ],
            "disclaimer": "AI detection is advisory only; use instructor judgement and corroborating evidence.",
        }
        diagnostics["reason"] = "ok"
        return result, diagnostics
    except Exception:
        diagnostics["reason"] = "predict_exception"
        diagnostics["detail"] = "Exception during scaler.transform or model.predict_proba"
        diagnostics["exception"] = traceback.format_exc(limit=1).strip()
        diagnostics["traceback"] = traceback.format_exc()
        LOGGER.exception(
            "AI detector inference failed. language=%s filename=%s bundle_path=%s model=%s scaler=%s feature_columns=%s feature_vector=%s",
            language,
            filename,
            diagnostics.get("bundle_path"),
            diagnostics.get("model_type"),
            diagnostics.get("scaler_type"),
            diagnostics.get("feature_columns_length"),
            diagnostics.get("feature_vector_length"),
        )
        return None, diagnostics


def predict_ai_likelihood_with_diagnostics(
    code: str,
    filename: str | None = None,
    threshold: float | None = None,
) -> tuple[dict | None, dict[str, Any]]:
    return _predict_ai_likelihood_internal(
        code=code,
        filename=filename,
        threshold=threshold,
    )


def predict_ai_likelihood(code: str, filename: str | None = None, threshold: float | None = None) -> dict | None:
    """Return model-based AI likelihood details if a trained artifact exists; otherwise None."""
    result, _ = _predict_ai_likelihood_internal(
        code=code,
        filename=filename,
        threshold=threshold,
    )
    return result
