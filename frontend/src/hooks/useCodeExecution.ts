import { useState, useCallback } from 'react';
import { codeExecutionApiService, type ExecuteCodeResponse } from '@/services/api/codeExecutionApiService';
import { runClientJavaScript } from '@/utils/clientExecution';

export function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecuteCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (code: string, language: string, stdin?: string) => {
    setIsRunning(true);
    setError(null);
    try {
      let res: ExecuteCodeResponse;

      if (language === 'javascript') {
        res = await runClientJavaScript(code, stdin || '');
      } else {
        res = await codeExecutionApiService.execute({
          code,
          language,
          stdin_input: stdin || '',
        });
      }

      setResult(res);
      return res;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Execution failed';
      setError(msg);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { execute, isRunning, result, error, clearResult };
}
