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
import keyword
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
    _JAVA_RESERVED = {
        "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
        "class", "const", "continue", "default", "do", "double", "else", "enum",
        "extends", "final", "finally", "float", "for", "goto", "if", "implements",
        "import", "instanceof", "int", "interface", "long", "native", "new",
        "package", "private", "protected", "public", "return", "short", "static",
        "strictfp", "super", "switch", "synchronized", "this", "throw", "throws",
        "transient", "try", "void", "volatile", "while", "true", "false", "null",
        "system", "out", "println", "print", "scanner", "main", "string",
    }

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
        dimension = GradingService._classify_rubric_dimension(
            name=name,
            description=description,
            grading_method=grading_method,
        )
        method = (grading_method or "").strip().lower()
        if method in {"auto", "hybrid"}:
            return True
        return dimension in {"correctness", "io"}

    @staticmethod
    def _classify_rubric_dimension(
        name: Optional[str],
        description: Optional[str],
        grading_method: Optional[str],
    ) -> str:
        """
        Infer what a rubric criterion is measuring.

        This lets the scorer apply criterion-specific heuristics instead of
        using one generic ratio for every row.
        """
        method = (grading_method or "").strip().lower()
        if method == "auto":
            return "correctness"

        text = f"{name or ''} {description or ''}".lower()

        if any(k in text for k in ("comment", "documentation", "docstring", "explain")):
            return "documentation"
        if any(k in text for k in ("naming", "variable name", "identifier", "readability of names")):
            return "naming"
        if any(k in text for k in ("modular", "function", "method", "oop", "class design", "decomposition")):
            return "modularity"
        if any(k in text for k in ("error", "exception", "robust", "validation", "edge case handling")):
            return "robustness"
        if any(k in text for k in ("performance", "efficiency", "complexity", "optimiz", "runtime")):
            return "performance"
        if any(k in text for k in ("input", "output", "i/o", "format")):
            return "io"
        if any(k in text for k in ("style", "formatting", "readability", "clean code")):
            return "style"
        if any(k in text for k in ("test", "correctness", "expected", "pass", "functionality")):
            return "correctness"
        if method == "hybrid":
            return "correctness"
        return "general"

    @staticmethod
    def _infer_code_language(code: str) -> str:
        text = code or ""
        if re.search(r"\bpublic\s+class\b|\bSystem\.out\.|\bScanner\b", text):
            return "java"
        return "python"

    @staticmethod
    def _normalize_language(language: Optional[str], code: str) -> str:
        candidate = (language or "").strip().lower()
        if candidate in {"python", "java"}:
            return candidate
        return GradingService._infer_code_language(code)

    @staticmethod
    def _extract_identifiers(code: str, language: str) -> list[str]:
        tokens = re.findall(r"\b[A-Za-z_][A-Za-z0-9_]*\b", code or "")
        if not tokens:
            return []

        if language == "python":
            reserved = set(keyword.kwlist)
        else:
            reserved = GradingService._JAVA_RESERVED

        identifiers: list[str] = []
        for token in tokens:
            token_lower = token.lower()
            if token in reserved or token_lower in reserved:
                continue
            if len(token) > 40:
                continue
            identifiers.append(token)
            if len(identifiers) >= 300:
                break
        return identifiers

    @staticmethod
    def _score_identifier_quality(identifiers: list[str], language: str) -> float:
        if not identifiers:
            return 0.78

        good = 0.0
        total = 0.0
        for name in identifiers:
            total += 1.0
            if len(name) == 1 and name.lower() not in {"i", "j", "k", "x", "y", "z", "n"}:
                continue

            if language == "python":
                if re.match(r"^[a-z_][a-z0-9_]*$", name):
                    good += 1.0
                elif re.match(r"^[a-z][A-Za-z0-9]*$", name):
                    good += 0.8
            else:
                if re.match(r"^[a-z][A-Za-z0-9]*$", name):
                    good += 1.0
                elif re.match(r"^[A-Z][A-Za-z0-9]*$", name):
                    good += 0.8
                elif re.match(r"^[a-z_][a-z0-9_]*$", name):
                    good += 0.75

            if len(name) >= 4:
                good += 0.2
                total += 0.2

        ratio = good / max(total, 1.0)
        return max(0.5, min(0.96, 0.55 + (0.41 * ratio)))

    @staticmethod
    def _analyze_code_quality(
        code: str,
        language: Optional[str] = None,
    ) -> dict:
        """
        Build lightweight static metrics used for rubric-aware suggestions.
        """
        normalized_language = GradingService._normalize_language(language, code)
        text = code or ""
        lines = text.splitlines()
        non_empty_lines = [line for line in lines if line.strip()]
        non_empty_count = max(1, len(non_empty_lines))

        comment_lines = 0
        in_java_block_comment = False
        for line in non_empty_lines:
            stripped = line.strip()
            if normalized_language == "python":
                if stripped.startswith("#"):
                    comment_lines += 1
                elif stripped.startswith('"""') or stripped.startswith("'''"):
                    comment_lines += 1
            else:
                if in_java_block_comment:
                    comment_lines += 1
                if stripped.startswith("//"):
                    comment_lines += 1
                if "/*" in stripped:
                    in_java_block_comment = True
                    comment_lines += 1
                if "*/" in stripped:
                    in_java_block_comment = False

        if normalized_language == "python":
            function_count = len(re.findall(r"^\s*def\s+[A-Za-z_][A-Za-z0-9_]*\s*\(", text, flags=re.MULTILINE))
            class_count = len(re.findall(r"^\s*class\s+[A-Za-z_][A-Za-z0-9_]*\s*[:(]", text, flags=re.MULTILINE))
            try_count = len(re.findall(r"\btry\s*:", text))
            catch_count = len(re.findall(r"\bexcept\b", text))
            raise_count = len(re.findall(r"\braise\b", text))
            input_count = len(re.findall(r"\binput\s*\(|\bsys\.stdin\b", text))
            output_count = len(re.findall(r"\bprint\s*\(", text))
            javadoc_block_count = 0
            javadoc_param_tags = 0
            javadoc_return_tags = 0
            javadoc_throws_tags = 0

            python_docstring_block_count = len(
                re.findall(r'"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\'', text)
            )
            python_param_doc_tags = len(re.findall(r":param\b|\bArgs:\b|\bParameters:\b", text))
            python_return_doc_tags = len(re.findall(r":return\b|\bReturns:\b", text))
            python_raises_doc_tags = len(re.findall(r":raises?\b|\bRaises:\b", text))
            python_type_hint_signals = len(re.findall(r"\bdef\s+[A-Za-z_]\w*\s*\([^)]*:[^)]*\)", text))
            python_type_hint_signals += len(re.findall(r"->\s*[A-Za-z_][A-Za-z0-9_\[\], .]*", text))

            py_param_sections = re.findall(
                r"^\s*def\s+[A-Za-z_][A-Za-z0-9_]*\s*\(([^)]*)\)",
                text,
                flags=re.MULTILINE,
            )
            parameter_slot_count = 0
            for section in py_param_sections:
                tokens = [part.strip() for part in section.split(",") if part.strip()]
                for token in tokens:
                    name = token.split(":", 1)[0].split("=", 1)[0].strip()
                    if not name or name in {"self", "cls"}:
                        continue
                    parameter_slot_count += 1
        else:
            function_count = len(re.findall(
                r"\b(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?[A-Za-z_][\w<>\[\]]*\s+[A-Za-z_][A-Za-z0-9_]*\s*\(",
                text,
            ))
            class_count = len(re.findall(r"\bclass\s+[A-Za-z_][A-Za-z0-9_]*", text))
            try_count = len(re.findall(r"\btry\b", text))
            catch_count = len(re.findall(r"\bcatch\b", text))
            raise_count = len(re.findall(r"\bthrow\b|\bthrows\b", text))
            input_count = len(re.findall(
                r"\bScanner\b|\bSystem\.in\b|\bBufferedReader\b|\bnext(?:Line|Int|Double|Float|Long|Short|Byte|Boolean)?\s*\(",
                text,
            ))
            output_count = len(re.findall(r"\bSystem\.out\.print(?:ln)?\s*\(", text))

            javadocs = re.findall(r"/\*\*[\s\S]*?\*/", text)
            javadoc_block_count = len(javadocs)
            javadoc_param_tags = sum(len(re.findall(r"@param\b", block)) for block in javadocs)
            javadoc_return_tags = sum(len(re.findall(r"@return\b", block)) for block in javadocs)
            javadoc_throws_tags = sum(len(re.findall(r"@(throws|exception)\b", block)) for block in javadocs)

            python_docstring_block_count = 0
            python_param_doc_tags = 0
            python_return_doc_tags = 0
            python_raises_doc_tags = 0
            python_type_hint_signals = 0

            java_param_sections = re.findall(
                r"\b(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?[A-Za-z_][\w<>\[\]]*\s+[A-Za-z_][A-Za-z0-9_]*\s*\(([^)]*)\)",
                text,
            )
            parameter_slot_count = 0
            for section in java_param_sections:
                params = [part.strip() for part in section.split(",") if part.strip()]
                parameter_slot_count += len(params)

        loop_count = len(re.findall(r"\bfor\b|\bwhile\b", text))
        conditional_count = len(re.findall(r"\bif\b|\belif\b|\bswitch\b", text))
        long_line_count = len([line for line in non_empty_lines if len(line) > 120])
        long_line_ratio = long_line_count / non_empty_count
        comment_ratio = comment_lines / non_empty_count

        identifiers = GradingService._extract_identifiers(text, normalized_language)
        naming_score = GradingService._score_identifier_quality(identifiers, normalized_language)

        if non_empty_count <= 25:
            modularity_score = 0.9 if function_count >= 1 else 0.82
        elif non_empty_count <= 70:
            if function_count >= 2:
                modularity_score = 0.92
            elif function_count >= 1:
                modularity_score = 0.83
            else:
                modularity_score = 0.68
        else:
            target_functions = 2 if non_empty_count <= 120 else 3
            if function_count >= target_functions:
                modularity_score = 0.93
            elif function_count >= max(1, target_functions - 1):
                modularity_score = 0.82
            else:
                modularity_score = 0.64
        if normalized_language == "java" and class_count > 0 and function_count >= 1:
            modularity_score = max(modularity_score, 0.85)

        if comment_ratio >= 0.14:
            documentation_score = 0.95
        elif comment_ratio >= 0.08:
            documentation_score = 0.86
        elif comment_ratio > 0:
            documentation_score = 0.72
        else:
            documentation_score = 0.45

        if (try_count + catch_count) > 0:
            robustness_score = 0.9
        elif input_count > 0 and conditional_count > 0:
            robustness_score = 0.8
        elif input_count > 0:
            robustness_score = 0.7
        else:
            robustness_score = 0.74

        if input_count > 0 and output_count > 0:
            io_score = 0.9
        elif output_count > 0:
            io_score = 0.78
        elif input_count > 0:
            io_score = 0.74
        else:
            io_score = 0.7

        style_score = 0.92
        if long_line_ratio > 0.2:
            style_score -= 0.2
        elif long_line_ratio > 0.1:
            style_score -= 0.1
        if "\t" in text:
            style_score -= 0.03
        style_score = max(0.6, min(style_score, 0.96))

        performance_score = 0.82
        if loop_count >= 4 and non_empty_count <= 45:
            performance_score = 0.72
        elif any(marker in text for marker in ("HashMap", "HashSet", "dict(", "set(", "Collections.sort", "sorted(")):
            performance_score = 0.88
        if loop_count <= 1 and non_empty_count <= 20:
            performance_score = max(performance_score, 0.86)

        general_score = max(
            0.55,
            min(
                0.97,
                (0.3 * style_score)
                + (0.25 * naming_score)
                + (0.25 * modularity_score)
                + (0.2 * documentation_score),
            ),
        )

        return {
            "language": normalized_language,
            "non_empty_count": non_empty_count,
            "comment_ratio": comment_ratio,
            "function_count": function_count,
            "class_count": class_count,
            "try_count": try_count,
            "catch_count": catch_count,
            "input_count": input_count,
            "output_count": output_count,
            "raise_count": raise_count,
            "parameter_slot_count": parameter_slot_count,
            "loop_count": loop_count,
            "conditional_count": conditional_count,
            "long_line_ratio": long_line_ratio,
            "naming_score": naming_score,
            "modularity_score": modularity_score,
            "documentation_score": documentation_score,
            "robustness_score": robustness_score,
            "io_score": io_score,
            "style_score": style_score,
            "performance_score": performance_score,
            "general_score": general_score,
            "javadoc_block_count": javadoc_block_count,
            "javadoc_param_tags": javadoc_param_tags,
            "javadoc_return_tags": javadoc_return_tags,
            "javadoc_throws_tags": javadoc_throws_tags,
            "python_docstring_block_count": python_docstring_block_count,
            "python_param_doc_tags": python_param_doc_tags,
            "python_return_doc_tags": python_return_doc_tags,
            "python_raises_doc_tags": python_raises_doc_tags,
            "python_type_hint_signals": python_type_hint_signals,
        }

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
    def _score_dimension(
        dimension: str,
        metrics: dict,
    ) -> tuple[float, str]:
        if dimension == "documentation":
            score = (0.8 * metrics["documentation_score"]) + (0.2 * metrics["style_score"])
            if metrics["documentation_score"] >= 0.86:
                return score, "Documentation is thorough for this solution."
            if metrics["documentation_score"] >= 0.72:
                return score, "Documentation exists, but key decisions could use more explanation."
            return score, "Add comments or docstrings so your approach is easier to follow."

        if dimension == "naming":
            score = (0.8 * metrics["naming_score"]) + (0.2 * metrics["style_score"])
            if metrics["naming_score"] >= 0.88:
                return score, "Identifier naming is clear and consistent."
            return score, "Use more descriptive names for variables and helpers."

        if dimension == "modularity":
            score = (0.8 * metrics["modularity_score"]) + (0.2 * metrics["style_score"])
            if metrics["modularity_score"] >= 0.88:
                return score, "Code is well-structured into reusable units."
            if metrics["non_empty_count"] <= 25:
                return score, "Structure is acceptable for a small program."
            return score, "Consider splitting logic into smaller functions or methods."

        if dimension == "robustness":
            score = (0.75 * metrics["robustness_score"]) + (0.25 * metrics["general_score"])
            if (metrics["try_count"] + metrics["catch_count"]) > 0:
                return score, "Error handling is present."
            return score, "Add validation or exception handling for edge inputs."

        if dimension == "performance":
            score = (0.75 * metrics["performance_score"]) + (0.25 * metrics["modularity_score"])
            if metrics["performance_score"] >= 0.86:
                return score, "No obvious performance concerns from static analysis."
            return score, "There may be opportunities to reduce unnecessary repeated work."

        if dimension == "io":
            score = (0.8 * metrics["io_score"]) + (0.2 * metrics["robustness_score"])
            if metrics["input_count"] > 0 and metrics["output_count"] > 0:
                return score, "Input/output handling appears complete."
            return score, "Double-check input parsing and output formatting requirements."

        if dimension == "style":
            score = (0.75 * metrics["style_score"]) + (0.25 * metrics["naming_score"])
            if metrics["long_line_ratio"] <= 0.1:
                return score, "Code style and readability are strong."
            return score, "Shorter lines and consistent formatting can improve readability."

        if dimension == "correctness":
            score = (
                (0.45 * metrics["general_score"])
                + (0.35 * metrics["io_score"])
                + (0.2 * metrics["robustness_score"])
            )
            return score, "Correctness suggestion combines structural checks with test outcomes."

        score = metrics["general_score"]
        return score, "Rubric suggestion generated from code structure and quality signals."

    @staticmethod
    def _collect_parameter_requirements(
        name: Optional[str],
        description: Optional[str],
        dimension: str,
    ) -> list[dict]:
        """
        Extract explicit rubric parameters so the suggestion engine can score
        against what this rubric row actually asks for.
        """
        raw_text = f"{name or ''} {description or ''}".strip()
        text = raw_text.lower()
        requirements: list[dict] = []

        if dimension in {"documentation", "style"} or "comment" in text:
            requirements.append({"kind": "comment_density"})
        if "javadoc" in text or "java doc" in text or "java-doc" in text:
            requirements.append({"kind": "javadoc_presence"})
        if "docstring" in text:
            requirements.append({"kind": "docstring_presence"})
        if "type hint" in text or "type annotation" in text:
            requirements.append({"kind": "python_type_hints"})

        explicit_tags = sorted(set(re.findall(r"@[a-z_]+", text)))
        for tag in explicit_tags:
            requirements.append({"kind": "doc_tag", "tag": tag})

        literal_tokens = []
        literal_tokens.extend(re.findall(r"`([^`]+)`", raw_text))
        literal_tokens.extend(re.findall(r'"([^"]+)"', raw_text))
        literal_tokens.extend(re.findall(r"'([^']+)'", raw_text))

        for literal in literal_tokens:
            token = literal.strip()
            if not token:
                continue
            if len(token) > 32:
                continue
            if not re.match(r"^[A-Za-z_@][A-Za-z0-9_@.:()\-]*$", token):
                continue
            requirements.append({"kind": "literal_token", "token": token.lower()})

        # Keep deterministic unique requirements.
        unique: list[dict] = []
        seen: set[tuple] = set()
        for req in requirements:
            key = tuple(sorted(req.items()))
            if key in seen:
                continue
            seen.add(key)
            unique.append(req)
        return unique

    @staticmethod
    def _score_parameter_requirement(
        requirement: dict,
        metrics: dict,
        code: str,
    ) -> tuple[float, Optional[str]]:
        language = metrics.get("language", "python")
        kind = requirement.get("kind")

        if kind == "comment_density":
            ratio = float(metrics.get("comment_ratio") or 0.0)
            if ratio >= 0.12:
                return 1.0, "Documentation/comments coverage aligns with rubric expectations."
            if ratio >= 0.05:
                return 0.75, "Adding a little more documentation would better satisfy this rubric parameter."
            return 0.4, "This rubric parameter emphasizes clearer inline documentation."

        if kind == "javadoc_presence":
            if language != "java":
                return 0.55, None
            coverage = float(metrics.get("javadoc_block_count") or 0.0) / max(
                1.0,
                float(metrics.get("function_count") or 0) + float(metrics.get("class_count") or 0),
            )
            if coverage >= 0.45:
                return 1.0, "JavaDoc coverage appears strong."
            if coverage > 0:
                return 0.72, "Some JavaDoc is present; expanding it to more members would improve this parameter."
            return 0.32, "Rubric parameter expects JavaDoc comments, but little or none were detected."

        if kind == "docstring_presence":
            if language != "python":
                return 0.55, None
            coverage = float(metrics.get("python_docstring_block_count") or 0.0) / max(
                1.0,
                float(metrics.get("function_count") or 0) + float(metrics.get("class_count") or 0),
            )
            if coverage >= 0.45:
                return 1.0, "Docstring coverage appears strong."
            if coverage > 0:
                return 0.72, "Some docstrings are present; broader coverage would better match this rubric parameter."
            return 0.32, "Rubric parameter expects docstrings, but little or none were detected."

        if kind == "python_type_hints":
            if language != "python":
                return 0.7, None
            hints = float(metrics.get("python_type_hint_signals") or 0)
            functions = max(1.0, float(metrics.get("function_count") or 0))
            ratio = hints / functions
            if ratio >= 1.0:
                return 1.0, "Type annotations appear to be used consistently."
            if ratio > 0:
                return 0.72, "Some type annotations detected; adding more would better satisfy this parameter."
            return 0.35, "Rubric parameter requests type annotations, but none were detected."

        if kind == "doc_tag":
            tag = str(requirement.get("tag") or "").lower()
            parameter_slots = max(1.0, float(metrics.get("parameter_slot_count") or 0))

            if tag == "@param":
                if language == "java":
                    ratio = float(metrics.get("javadoc_param_tags") or 0) / parameter_slots
                else:
                    ratio = float(metrics.get("python_param_doc_tags") or 0) / parameter_slots
                ratio = max(0.0, min(ratio, 1.0))
                if ratio >= 0.8:
                    return 1.0, "Detected strong parameter documentation coverage for this rubric tag."
                if ratio > 0:
                    return 0.7, "Some parameter documentation tags are present; coverage can be improved."
                return 0.28, "Rubric explicitly mentions @param, but matching parameter tags were not detected."

            if tag == "@return":
                if language == "java":
                    count = float(metrics.get("javadoc_return_tags") or 0)
                else:
                    count = float(metrics.get("python_return_doc_tags") or 0)
                if count >= 1:
                    return 1.0, "Return-value documentation tag detected."
                return 0.35, "Rubric mentions @return, but no matching return documentation tag was detected."

            if tag in {"@throws", "@exception"}:
                if language == "java":
                    count = float(metrics.get("javadoc_throws_tags") or 0)
                else:
                    count = float(metrics.get("python_raises_doc_tags") or 0)
                if count >= 1:
                    return 1.0, "Exception documentation tag detected."
                return 0.35, "Rubric mentions exception documentation tags that were not detected."

            token_present = tag in (code or "").lower()
            return (1.0, None) if token_present else (0.5, None)

        if kind == "literal_token":
            token = str(requirement.get("token") or "").strip().lower()
            if not token:
                return 0.7, None
            token_present = token in (code or "").lower()
            return (1.0, None) if token_present else (0.45, None)

        return 0.7, None

    @staticmethod
    def _apply_parameter_requirements(
        *,
        name: Optional[str],
        description: Optional[str],
        dimension: str,
        base_score: float,
        base_feedback: str,
        metrics: dict,
        code: str,
    ) -> tuple[float, str]:
        requirements = GradingService._collect_parameter_requirements(
            name=name,
            description=description,
            dimension=dimension,
        )
        if not requirements:
            return base_score, base_feedback

        req_scores: list[float] = []
        requirement_feedback: list[str] = []
        for req in requirements:
            score, feedback = GradingService._score_parameter_requirement(
                requirement=req,
                metrics=metrics,
                code=code,
            )
            req_scores.append(max(0.0, min(float(score), 1.0)))
            if feedback:
                requirement_feedback.append(feedback)

        parameter_score = sum(req_scores) / len(req_scores)

        if dimension == "documentation":
            blend_base = 0.5
        elif dimension in {"correctness", "io"}:
            blend_base = 0.7
        else:
            blend_base = 0.75

        final_score = (blend_base * base_score) + ((1.0 - blend_base) * parameter_score)

        feedback_parts = [base_feedback.strip()]
        for feedback in requirement_feedback:
            clean = feedback.strip()
            if clean and clean not in feedback_parts:
                feedback_parts.append(clean)
            if len(feedback_parts) >= 3:
                break

        return max(0.0, min(final_score, 1.0)), "; ".join(feedback_parts)

    @staticmethod
    def _simple_rubric_check(
        code: str,
        rubric: Rubric,
        *,
        language: Optional[str] = None,
        quality_metrics: Optional[dict] = None,
        dimension: Optional[str] = None,
    ) -> tuple[float, str]:
        """
        Rubric-aware heuristic scoring.

        Returns:
            Tuple of (score_ratio: float 0-1, feedback: str)
        """
        resolved_dimension = dimension or GradingService._classify_rubric_dimension(
            name=getattr(rubric, "name", None),
            description=getattr(rubric, "description", None),
            grading_method=getattr(rubric, "grading_method", None),
        )
        metrics = quality_metrics or GradingService._analyze_code_quality(code, language=language)
        score, feedback = GradingService._score_dimension(resolved_dimension, metrics)
        adjusted_score, adjusted_feedback = GradingService._apply_parameter_requirements(
            name=getattr(rubric, "name", None),
            description=getattr(rubric, "description", None),
            dimension=resolved_dimension,
            base_score=score,
            base_feedback=feedback,
            metrics=metrics,
            code=code,
        )
        return max(0.0, min(adjusted_score, 1.0)), adjusted_feedback

    @staticmethod
    def _blend_rubric_and_test_ratio(
        rubric_ratio: float,
        test_ratio: Optional[float],
        *,
        grading_method: Optional[str],
        is_test_focused: bool,
        dimension: Optional[str] = None,
    ) -> float:
        """
        Blend rubric heuristics with runtime test evidence.
        """
        base = max(0.0, min(float(rubric_ratio), 1.0))
        if test_ratio is None:
            return base

        test = max(0.0, min(float(test_ratio), 1.0))
        method = (grading_method or "").strip().lower()
        dim = (dimension or "general").strip().lower()

        if is_test_focused or method == "auto" or dim == "correctness":
            score = (0.97 * test) + (0.03 * base)
        elif method == "hybrid":
            score = (0.75 * test) + (0.25 * base)
        else:
            score = (0.15 * test) + (0.85 * base)
            if test >= 0.999 and base >= 0.88:
                score = max(score, 0.93)
            elif test >= 0.999 and base >= 0.75:
                score = max(score, 0.88)

        return max(0.0, min(score, 1.0))

    @staticmethod
    def _evaluate_sectioned_rubric(
        assignment: Optional[Assignment],
        rubric_sections: list[RubricSection],
        code: str,
        language: Optional[str] = None,
        test_results: Optional[dict] = None,
    ) -> dict:
        """
        Evaluate modern section/criterion rubric format.

        Supports both weighted and unweighted rubric modes and emits criterion-
        level evaluations that the grading UI can prefill directly.
        """
        weighted_mode = (getattr(assignment, "rubric_mode", None) or "unweighted") == "weighted"
        test_ratio = GradingService._derive_test_ratio(test_results)
        normalized_language = GradingService._normalize_language(language, code)
        quality_metrics = GradingService._analyze_code_quality(code, language=normalized_language)

        evaluations: list[dict] = []
        total_points = 0.0
        earned_points = 0.0
        has_test_focused_criteria = False

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
                dimension = GradingService._classify_rubric_dimension(
                    criterion_name,
                    criterion_description,
                    grading_method,
                )
                is_test_focused = GradingService._is_test_focused_criterion(
                    criterion_name,
                    criterion_description,
                    grading_method,
                )
                if is_test_focused:
                    has_test_focused_criteria = True

                proxy_rubric = SimpleNamespace(
                    name=criterion_name,
                    description=criterion_description,
                    grading_method=grading_method,
                )
                rubric_ratio, heuristic_feedback = GradingService._simple_rubric_check(
                    code,
                    proxy_rubric,
                    language=normalized_language,
                    quality_metrics=quality_metrics,
                    dimension=dimension,
                )
                blended_ratio = GradingService._blend_rubric_and_test_ratio(
                    rubric_ratio,
                    test_ratio,
                    grading_method=grading_method,
                    is_test_focused=is_test_focused,
                    dimension=dimension,
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
                        "dimension": dimension,
                        "rubric_ratio": round(rubric_ratio, 4),
                        "suggested_ratio": round(blended_ratio, 4),
                        "feedback": feedback_text,
                    }
                )

        total_points = round(total_points, 4)
        earned_points = round(earned_points, 4)
        score_includes_tests = bool(test_ratio is not None and has_test_focused_criteria)

        return {
            "total_rubrics": len(evaluations),
            "total_points": total_points,
            "earned_points": earned_points,
            "evaluations": evaluations,
            # `grade_submission()` uses this flag to avoid double-counting tests.
            "has_test_rubric": score_includes_tests,
            "test_focused_criteria": sum(
                1
                for e in evaluations
                if e.get("dimension") in {"correctness", "io"}
            ),
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
                db,
                submission,
                code,
                test_results,
                language=language,
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
        language: Optional[str] = None,
    ) -> dict:
        """
        Evaluate submission against rubric criteria.
        """
        normalized_language = GradingService._normalize_language(language, code)
        quality_metrics = GradingService._analyze_code_quality(code, language=normalized_language)
        test_ratio = GradingService._derive_test_ratio(test_results)

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
                language=normalized_language,
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
        total_points = 0.0
        earned_points = 0.0
        has_test_rubric = False

        for rubric in rubrics:
            max_pts = float(rubric.max_points or 10)
            criterion_name = rubric.name or "Criterion"
            criterion_description = rubric.description or ""
            grading_method = "manual"
            dimension = GradingService._classify_rubric_dimension(
                criterion_name,
                criterion_description,
                grading_method,
            )
            is_test_focused = GradingService._is_test_focused_criterion(
                criterion_name,
                criterion_description,
                grading_method,
            )
            if is_test_focused and test_ratio is not None:
                has_test_rubric = True

            rubric_ratio, feedback = GradingService._simple_rubric_check(
                code,
                rubric,
                language=normalized_language,
                quality_metrics=quality_metrics,
                dimension=dimension,
            )
            blended_ratio = GradingService._blend_rubric_and_test_ratio(
                rubric_ratio,
                test_ratio,
                grading_method=grading_method,
                is_test_focused=is_test_focused,
                dimension=dimension,
            )
            earned = round(max_pts * blended_ratio, 4)

            total_points += max_pts
            earned_points += earned

            evaluations.append({
                "rubric_id": rubric.id,
                "rubric_name": criterion_name,
                "max_points": round(max_pts, 4),
                "earned_points": earned,
                "dimension": dimension,
                "rubric_ratio": round(rubric_ratio, 4),
                "suggested_ratio": round(blended_ratio, 4),
                "feedback": feedback,
            })

        return {
            "total_rubrics": len(rubrics),
            "total_points": round(total_points, 4),
            "earned_points": round(earned_points, 4),
            "evaluations": evaluations,
            "has_test_rubric": has_test_rubric,
        }

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
            if rr["total_rubrics"] > 0 and rr.get("total_points", 0) > 0:
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
