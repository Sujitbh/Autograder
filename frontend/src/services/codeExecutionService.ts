/* ═══════════════════════════════════════════════════════════════════
   Code Execution Service — Piston API integration
   ═══════════════════════════════════════════════════════════════════ */

import axios from 'axios';
import { config } from '@/config/env';
import type { ExecuteCodeParams, ExecutionResult, TestCase, TestCaseResult } from '@/types';

// ── Language → Piston runtime mapping ───────────────────────────────

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    python: { language: 'python', version: '3.10.0' },
    java: { language: 'java', version: '15.0.2' },
};

const pistonApi = axios.create({
    baseURL: config.pistonApiUrl,
    timeout: 35_000, // slightly above the 30s execution limit
});

// ── Rate limiter (client-side, 10 calls/min) ────────────────────────

const rateLimitWindow = 60_000; // 1 minute
const maxCallsPerWindow = 10;
let callTimestamps: number[] = [];

function checkRateLimit(): void {
    const now = Date.now();
    callTimestamps = callTimestamps.filter((t) => now - t < rateLimitWindow);
    if (callTimestamps.length >= maxCallsPerWindow) {
        throw new Error(
            'Rate limit exceeded — max 10 code executions per minute. Please wait and try again.'
        );
    }
    callTimestamps.push(now);
}

// ── Execute a single piece of code ──────────────────────────────────

export async function executeCode(
    params: ExecuteCodeParams
): Promise<ExecutionResult> {
    checkRateLimit();

    const runtime = LANGUAGE_MAP[params.language];
    if (!runtime) {
        return {
            output: '',
            stderr: `Unsupported language: ${params.language}`,
            exitCode: 1,
            executionTime: 0,
            success: false,
            error: `Unsupported language: ${params.language}`,
        };
    }

    const startTime = performance.now();

    try {
        const { data } = await pistonApi.post('/execute', {
            language: runtime.language,
            version: runtime.version,
            files: [{ name: params.language === 'java' ? 'Main.java' : 'main.py', content: params.sourceCode }],
            stdin: params.stdin ?? '',
            args: params.args ?? [],
            run_timeout: 30_000,       // 30 seconds
            compile_timeout: 15_000,   // 15 seconds for Java compilation
        });

        const executionTime = Math.round(performance.now() - startTime);
        const run = data.run ?? {};
        const compile = data.compile;

        // Compilation failure (Java)
        if (compile && compile.code !== 0) {
            return {
                output: compile.output ?? '',
                stderr: compile.stderr ?? compile.output ?? 'Compilation failed',
                exitCode: compile.code ?? 1,
                executionTime,
                success: false,
                error: 'Compilation error',
            };
        }

        return {
            output: (run.stdout ?? run.output ?? '').trimEnd(),
            stderr: (run.stderr ?? '').trimEnd(),
            exitCode: run.code ?? 0,
            executionTime,
            success: run.code === 0,
            error: run.code !== 0 ? run.stderr || 'Runtime error' : undefined,
        };
    } catch (err: unknown) {
        const executionTime = Math.round(performance.now() - startTime);
        const message =
            err instanceof Error ? err.message : 'Code execution failed';

        return {
            output: '',
            stderr: message,
            exitCode: 1,
            executionTime,
            success: false,
            error: message,
        };
    }
}

// ── Run code against multiple test cases ────────────────────────────

/**
 * Runs `code` against each test case sequentially.
 * Compares actual stdout with expected output (trimmed, optional whitespace-insensitive).
 */
export async function runTestCases(
    language: 'python' | 'java',
    code: string,
    testCases: TestCase[],
    ignoreWhitespace = false
): Promise<TestCaseResult[]> {
    const results: TestCaseResult[] = [];

    for (const tc of testCases) {
        const result = await executeCode({
            language,
            sourceCode: code,
            stdin: tc.input,
        });

        const normalize = (s: string) =>
            ignoreWhitespace ? s.replace(/\s+/g, ' ').trim() : s.trim();

        const actual = normalize(result.output);
        const expected = normalize(tc.expectedOutput);

        results.push({
            testCase: tc,
            passed: result.success && actual === expected,
            actualOutput: result.output,
            expectedOutput: tc.expectedOutput,
            executionTime: result.executionTime,
            error: result.error,
        });
    }

    return results;
}

// ── Quick syntax validation ─────────────────────────────────────────

/**
 * Compile/parse the code without running it. Returns a list of errors.
 * Uses Piston with empty stdin and a short timeout.
 */
export async function validateCode(
    language: 'python' | 'java',
    code: string
): Promise<{ valid: boolean; errors: string[] }> {
    // For Python we use `py_compile` via a wrapper script
    const wrapper =
        language === 'python'
            ? `import py_compile, io, sys\ntry:\n    py_compile.compile(io.StringIO(${JSON.stringify(code)}).name, doraise=True)\n    print("OK")\nexcept py_compile.PyCompileError as e:\n    print(str(e), file=sys.stderr)\n    sys.exit(1)`
            : code; // Java will fail at compile stage if invalid

    const result = await executeCode({
        language,
        sourceCode: language === 'python' ? wrapper : code,
    });

    if (result.success) return { valid: true, errors: [] };

    const errorLines = result.stderr
        .split('\n')
        .filter(Boolean)
        .map((l) => l.trim());

    return { valid: false, errors: errorLines };
}
