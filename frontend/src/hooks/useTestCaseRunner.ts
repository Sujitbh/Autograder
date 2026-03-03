import { useState, useCallback } from 'react';
import { codeExecutionApiService } from '@/services/api/codeExecutionApiService';
import type { BackendTestCase } from '@/services/api/testcaseService';
import type { TestCaseRunResult } from '@/components/TestResultsPanel';

export function useTestCaseRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestCaseRunResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const runTests = useCallback(async (
    code: string,
    language: string,
    testCases: BackendTestCase[],
  ) => {
    setIsRunning(true);
    setResults([]);
    setProgress({ current: 0, total: testCases.length });

    const newResults: TestCaseRunResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const testName = tc.name || `Test ${i + 1}`;
      try {
        const execResult = await codeExecutionApiService.execute({
          code,
          language,
          stdin_input: tc.input_data ?? '',
        });

        const actual = execResult.stdout.trim();
        const expected = (tc.expected_output ?? '').trim();

        newResults.push({
          testcaseId: tc.id,
          testName,
          passed: (execResult.status === 'success' || execResult.status === 'SUCCESS') && actual === expected,
          actualOutput: execResult.stdout,
          expectedOutput: tc.expected_output ?? '',
          executionTimeMs: execResult.execution_time_ms,
          points: tc.points,
          pointsEarned: ((execResult.status === 'success' || execResult.status === 'SUCCESS') && actual === expected) ? tc.points : 0,
          error: execResult.stderr || undefined,
          status: execResult.status,
        });
      } catch {
        newResults.push({
          testcaseId: tc.id,
          testName,
          passed: false,
          actualOutput: '',
          expectedOutput: tc.expected_output ?? '',
          executionTimeMs: 0,
          points: tc.points,
          pointsEarned: 0,
          error: 'Execution request failed',
          status: 'error',
        });
      }

      setProgress({ current: i + 1, total: testCases.length });
      setResults([...newResults]);
    }

    setIsRunning(false);
    return newResults;
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setProgress({ current: 0, total: 0 });
  }, []);

  return { runTests, isRunning, results, progress, clearResults };
}
