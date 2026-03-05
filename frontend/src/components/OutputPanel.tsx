'use client';

import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import type { ExecuteCodeResponse } from '@/services/api/codeExecutionApiService';

interface OutputPanelProps {
  result: ExecuteCodeResponse | null;
  isRunning: boolean;
  error?: string | null;
}

export function OutputPanel({ result, isRunning, error }: OutputPanelProps) {
  if (isRunning) {
    return (
      <div
        className="h-full flex items-center justify-center gap-2"
        style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-mid)' }}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-mono">Executing your code...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center gap-2 p-4"
        style={{ backgroundColor: 'var(--color-surface-elevated)' }}
      >
        <AlertCircle className="w-6 h-6" style={{ color: 'var(--color-error)' }} />
        <span className="text-sm font-mono text-center" style={{ color: 'var(--color-error)' }}>{error}</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-light)' }}
      >
        <span className="text-sm font-mono">Run your code to see output here</span>
      </div>
    );
  }

  const isSuccess = result.status === 'success' || result.status === 'SUCCESS';
  const isTimeout = result.status === 'timeout' || result.status === 'TIMEOUT';

  const statusColor = isSuccess
    ? 'var(--color-success)'
    : isTimeout
      ? 'var(--color-warning)'
      : 'var(--color-error)';

  const StatusIcon = isSuccess ? CheckCircle2 : isTimeout ? Clock : XCircle;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
      {/* Status Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <StatusIcon className="w-4 h-4" style={{ color: statusColor }} />
          <span className="text-xs font-semibold font-mono uppercase" style={{ color: statusColor }}>
            {isSuccess ? 'Success' : isTimeout ? 'Time Limit Exceeded' : result.status.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono" style={{ color: 'var(--color-text-mid)' }}>
          <span>Time: {result.execution_time_ms.toFixed(0)}ms</span>
          <span>Exit: {result.exit_code}</span>
        </div>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-auto p-4">
        {result.stdout && (
          <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: 'var(--color-text-dark)' }}>
            {result.stdout}
          </pre>
        )}
        {result.stderr && (
          <pre className="text-sm font-mono whitespace-pre-wrap mt-2" style={{ color: 'var(--color-error)' }}>
            {result.stderr}
          </pre>
        )}
        {!result.stdout && !result.stderr && (
          <span className="text-sm font-mono" style={{ color: 'var(--color-text-light)' }}>
            (no output)
          </span>
        )}
      </div>
    </div>
  );
}
