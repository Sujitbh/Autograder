import { useState, useCallback } from 'react';
import { codeExecutionApiService, type ExecuteCodeRequest, type ExecuteCodeResponse } from '@/services/api/codeExecutionApiService';
import { runClientJavaScript } from '@/utils/clientExecution';

export function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecuteCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastStdinInput, setLastStdinInput] = useState('');

  const runExecution = useCallback(async (payload: ExecuteCodeRequest) => {
    setIsRunning(true);
    setError(null);
    setLastStdinInput(payload.stdin_input || '');
    try {
      let res: ExecuteCodeResponse;
      const language = payload.language;
      const code = payload.code;
      const stdin = payload.stdin_input || '';
      const compileOnly = payload.compile_only === true;

      if (language === 'javascript' && !compileOnly) {
        res = await runClientJavaScript(code, stdin || '');
      } else {
        res = await codeExecutionApiService.execute(payload);
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

  const execute = useCallback(async (code: string, language: string, stdin?: string) => {
    return runExecution({
      code,
      language,
      stdin_input: stdin || '',
      compile_only: false,
    });
  }, [runExecution]);

  const compile = useCallback(async (code: string, language: string) => {
    return runExecution({
      code,
      language,
      stdin_input: '',
      compile_only: true,
    });
  }, [runExecution]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setLastStdinInput('');
  }, []);

  return { execute, compile, isRunning, result, error, clearResult, lastStdinInput };
}
