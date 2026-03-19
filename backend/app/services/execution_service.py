"""
Code execution service for running student submissions in a sandbox.

This service provides secure code execution with:
- Resource limits (CPU, memory, time)
- Output capture
- Error handling
- Support for multiple languages
"""

import os
import subprocess
import tempfile
import shutil
from pathlib import Path
from typing import Optional
from dataclasses import dataclass
from enum import Enum

from app.settings import settings


class ExecutionStatus(str, Enum):
    """Status of code execution."""
    SUCCESS = "success"
    COMPILE_ERROR = "compile_error"
    RUNTIME_ERROR = "runtime_error"
    TIMEOUT = "timeout"
    MEMORY_LIMIT = "memory_limit"
    SECURITY_ERROR = "security_error"


@dataclass
class ExecutionResult:
    """Result of code execution."""
    status: ExecutionStatus
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: float
    memory_used_kb: int = 0


# Language configurations
LANGUAGE_CONFIG = {
    "python": {
        "extension": ".py",
        "compile_cmd": None,  # Interpreted
        "run_cmd": ["python3", "{file}"],
        "timeout": 10,
    },
    "java": {
        "extension": ".java",
        "compile_cmd": ["javac", "{file}"],
        "run_cmd": ["java", "-cp", "{dir}", "{classname}"],
        "timeout": 15,
    },
    "cpp": {
        "extension": ".cpp",
        "compile_cmd": ["g++", "-o", "{output}", "{file}", "-std=c++17"],
        "run_cmd": ["{output}"],
        "timeout": 10,
    },
    "c": {
        "extension": ".c",
        "compile_cmd": ["gcc", "-o", "{output}", "{file}"],
        "run_cmd": ["{output}"],
        "timeout": 10,
    },
    "javascript": {
        "extension": ".js",
        "compile_cmd": None,
        "run_cmd": ["node", "{file}"],
        "timeout": 10,
    },
}

# Dangerous patterns to detect in code (per-language)
DANGEROUS_PATTERNS_PYTHON = [
    "import os",
    "import subprocess",
    "import shutil",
    "__import__",
    "eval(",
    "exec(",
    "os.system(",
    "os.popen(",
    "subprocess.",
]

DANGEROUS_PATTERNS_C_CPP = [
    "system(",
    "popen(",
    "fork(",
    "execvp(",
    "execve(",
    "rm -rf",
]

DANGEROUS_PATTERNS_UNIVERSAL = [
    "rm -rf /",
    "chmod 777",
]


class ExecutionService:
    """Service for executing code in a sandboxed environment."""

    # Default resource limits
    DEFAULT_TIMEOUT = 10  # seconds
    DEFAULT_MEMORY_LIMIT = 256  # MB
    MAX_OUTPUT_SIZE = 1024 * 1024  # 1MB

    @staticmethod
    def detect_language(filename: str) -> Optional[str]:
        """Detect programming language from file extension."""
        ext = Path(filename).suffix.lower()
        ext_to_lang = {
            ".py": "python",
            ".java": "java",
            ".cpp": "cpp",
            ".c": "c",
            ".js": "javascript",
        }
        return ext_to_lang.get(ext)

    @staticmethod
    def check_security(code: str, language: str = "python") -> tuple[bool, str]:
        """
        Check code for potentially dangerous patterns.
        
        Returns:
            Tuple of (is_safe: bool, reason: str)
        """
        code_lower = code.lower()

        # Always check universal patterns
        for pattern in DANGEROUS_PATTERNS_UNIVERSAL:
            if pattern.lower() in code_lower:
                return False, f"Potentially dangerous code detected: {pattern}"

        # Language-specific checks
        if language == "python":
            for pattern in DANGEROUS_PATTERNS_PYTHON:
                if pattern.lower() in code_lower:
                    return False, f"Potentially dangerous code detected: {pattern}"
        elif language in ("c", "cpp"):
            for pattern in DANGEROUS_PATTERNS_C_CPP:
                if pattern.lower() in code_lower:
                    return False, f"Potentially dangerous code detected: {pattern}"

        return True, "OK"

    @staticmethod
    def execute(
        code: str,
        language: str,
        stdin_input: str = "",
        timeout: Optional[int] = None,
        memory_limit: Optional[int] = None,
    ) -> ExecutionResult:
        """
        Execute code in a sandboxed environment.
        
        Args:
            code: Source code to execute
            language: Programming language
            stdin_input: Input to provide via stdin
            timeout: Execution timeout in seconds
            memory_limit: Memory limit in MB (not enforced in basic mode)
            
        Returns:
            ExecutionResult with status and output
        """
        if language not in LANGUAGE_CONFIG:
            return ExecutionResult(
                status=ExecutionStatus.SECURITY_ERROR,
                stdout="",
                stderr=f"Unsupported language: {language}",
                exit_code=-1,
                execution_time_ms=0,
            )

        config = LANGUAGE_CONFIG[language]
        timeout = timeout or config.get("timeout", ExecutionService.DEFAULT_TIMEOUT)

        # Security check
        is_safe, reason = ExecutionService.check_security(code, language)
        if not is_safe:
            return ExecutionResult(
                status=ExecutionStatus.SECURITY_ERROR,
                stdout="",
                stderr=reason,
                exit_code=-1,
                execution_time_ms=0,
            )

        # Create temporary directory for execution
        with tempfile.TemporaryDirectory(prefix="autograder_") as tmpdir:
            try:
                result = ExecutionService._execute_in_sandbox(
                    code=code,
                    language=language,
                    config=config,
                    tmpdir=tmpdir,
                    stdin_input=stdin_input,
                    timeout=timeout,
                )
                return result
            except Exception as e:
                return ExecutionResult(
                    status=ExecutionStatus.RUNTIME_ERROR,
                    stdout="",
                    stderr=f"Execution error: {str(e)}",
                    exit_code=-1,
                    execution_time_ms=0,
                )

    @staticmethod
    def _execute_in_sandbox(
        code: str,
        language: str,
        config: dict,
        tmpdir: str,
        stdin_input: str,
        timeout: int,
    ) -> ExecutionResult:
        """Execute code in temporary directory."""
        import time

        # Write source file
        ext = config["extension"]
        if language == "java":
            # Extract class name for Java
            import re
            match = re.search(r"public\s+class\s+(\w+)", code)
            classname = match.group(1) if match else "Main"
            source_file = Path(tmpdir) / f"{classname}{ext}"
        else:
            source_file = Path(tmpdir) / f"solution{ext}"

        source_file.write_text(code)

        # Compile if needed
        if config["compile_cmd"]:
            compile_cmd = [
                c.format(
                    file=str(source_file),
                    output=str(Path(tmpdir) / "a.out"),
                    dir=tmpdir,
                )
                for c in config["compile_cmd"]
            ]

            try:
                compile_result = subprocess.run(
                    compile_cmd,
                    capture_output=True,
                    text=True,
                    timeout=30,
                    cwd=tmpdir,
                )
                if compile_result.returncode != 0:
                    return ExecutionResult(
                        status=ExecutionStatus.COMPILE_ERROR,
                        stdout="",
                        stderr=compile_result.stderr,
                        exit_code=compile_result.returncode,
                        execution_time_ms=0,
                    )
            except subprocess.TimeoutExpired:
                return ExecutionResult(
                    status=ExecutionStatus.TIMEOUT,
                    stdout="",
                    stderr="Compilation timed out",
                    exit_code=-1,
                    execution_time_ms=0,
                )

        # Prepare run command
        if language == "java":
            run_cmd = [
                c.format(
                    file=str(source_file),
                    dir=tmpdir,
                    classname=classname,
                )
                for c in config["run_cmd"]
            ]
        else:
            run_cmd = [
                c.format(
                    file=str(source_file),
                    output=str(Path(tmpdir) / "a.out"),
                )
                for c in config["run_cmd"]
            ]

        # Execute
        start_time = time.time()
        try:
            result = subprocess.run(
                run_cmd,
                input=stdin_input,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=tmpdir,
            )
            execution_time = (time.time() - start_time) * 1000

            # Truncate output if too large
            stdout = result.stdout[:ExecutionService.MAX_OUTPUT_SIZE]
            stderr = result.stderr[:ExecutionService.MAX_OUTPUT_SIZE]

            status = (
                ExecutionStatus.SUCCESS
                if result.returncode == 0
                else ExecutionStatus.RUNTIME_ERROR
            )

            return ExecutionResult(
                status=status,
                stdout=stdout,
                stderr=stderr,
                exit_code=result.returncode,
                execution_time_ms=execution_time,
            )

        except subprocess.TimeoutExpired:
            execution_time = (time.time() - start_time) * 1000
            return ExecutionResult(
                status=ExecutionStatus.TIMEOUT,
                stdout="",
                stderr=f"Execution timed out after {timeout} seconds",
                exit_code=-1,
                execution_time_ms=execution_time,
            )

    @staticmethod
    def run_testcase(
        code: str,
        language: str,
        input_data: str,
        expected_output: str,
    ) -> dict:
        """
        Run code against a single test case.
        
        Returns:
            Dict with passed status, actual output, and execution details
        """
        result = ExecutionService.execute(
            code=code,
            language=language,
            stdin_input=input_data,
        )

        actual = result.stdout
        expected = expected_output

        passed = (
            result.status == ExecutionStatus.SUCCESS
            and ExecutionService._outputs_match(actual, expected)
        )

        return {
            "passed": passed,
            "status": result.status.value,
            "actual_output": result.stdout,
            "expected_output": expected_output,
            "stderr": result.stderr,
            "execution_time_ms": result.execution_time_ms,
            "exit_code": result.exit_code,
        }

    @staticmethod
    def _normalize_lines(text: str) -> list[str]:
        """Normalize output text into comparable non-empty lines."""
        return [line.strip() for line in (text or "").splitlines() if line.strip()]

    @staticmethod
    def _line_candidates(line: str) -> list[str]:
        """Return comparable variants for one output line."""
        cleaned = (line or "").strip()
        candidates = [cleaned]

        # Common prompt format: "Enter n: 3" should match expected "3".
        if ":" in cleaned:
            tail = cleaned.rsplit(":", 1)[-1].strip()
            if tail:
                candidates.append(tail)

        return candidates

    @staticmethod
    def _outputs_match(actual_output: str, expected_output: str) -> bool:
        """
        Match outputs using a clear rule set:
        1) Exact normalized line match.
        2) Expected lines match the trailing lines of actual output.
        3) For a single expected line, allow prompt-prefixed final output.
        """
        actual_lines = ExecutionService._normalize_lines(actual_output)
        expected_lines = ExecutionService._normalize_lines(expected_output)

        if not expected_lines:
            return len(actual_lines) == 0

        if actual_lines == expected_lines:
            return True

        # Accept extra leading lines/logs as long as final lines match expected output.
        if len(actual_lines) >= len(expected_lines):
            suffix = actual_lines[-len(expected_lines):]
            if suffix == expected_lines:
                return True

        # For single-line expectations, allow prompt text before the final value.
        if len(expected_lines) == 1 and actual_lines:
            expected_last = expected_lines[0]
            actual_last = actual_lines[-1]

            for candidate in ExecutionService._line_candidates(actual_last):
                if candidate == expected_last:
                    return True

        return False

    @staticmethod
    def run_all_testcases(
        code: str,
        language: str,
        testcases: list,
    ) -> dict:
        """
        Run code against all test cases.
        
        Args:
            code: Source code
            language: Programming language
            testcases: List of TestCase objects or dicts
            
        Returns:
            Dict with summary and individual results
        """
        results = []
        total_points = 0
        earned_points = 0

        for tc in testcases:
            # Handle both TestCase objects and dicts
            if hasattr(tc, "input_data"):
                input_data = tc.input_data
                expected_output = tc.expected_output
                testcase_name = tc.name if hasattr(tc, "name") else None
                points = tc.points if hasattr(tc, "points") else 1
                tc_id = tc.id if hasattr(tc, "id") else None
            else:
                input_data = tc.get("input_data", "")
                expected_output = tc.get("expected_output", "")
                testcase_name = tc.get("name")
                points = tc.get("points", 1)
                tc_id = tc.get("id")

            result = ExecutionService.run_testcase(
                code=code,
                language=language,
                input_data=input_data or "",
                expected_output=expected_output or "",
            )

            result["testcase_id"] = tc_id
            result["testcase_name"] = testcase_name
            result["input_data"] = input_data
            result["expected_output"] = expected_output
            result["points"] = points
            result["points_earned"] = points if result["passed"] else 0

            total_points += points
            if result["passed"]:
                earned_points += points

            results.append(result)

        return {
            "total_testcases": len(testcases),
            "passed_testcases": sum(1 for r in results if r["passed"]),
            "total_points": total_points,
            "earned_points": earned_points,
            "score_percentage": (earned_points / total_points * 100) if total_points > 0 else 0,
            "results": results,
        }
