'use client';

import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle, Play } from 'lucide-react';
import type { ExecuteCodeResponse } from '@/services/api/codeExecutionApiService';

interface OutputPanelProps {
  result: ExecuteCodeResponse | null;
  isRunning: boolean;
  error?: string | null;
  stdinInput?: string;
  showInputEditor?: boolean;
  inputDraft?: string;
  onInputDraftChange?: (value: string) => void;
  onRunWithInput?: () => void;
  isRunWithInputDisabled?: boolean;
}

/** Shared stdin input composer shown inside the output panel */
function StdinComposer({
  inputDraft,
  onChange,
  onRun,
  disabled,
  withButton,
}: {
  inputDraft: string;
  onChange: (v: string) => void;
  onRun: () => void;
  disabled: boolean;
  withButton: boolean;
}) {
  return (
    <div className="p-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <p className="text-xs font-semibold font-mono uppercase mb-2" style={{ color: 'var(--color-text-light)' }}>
        Program Input (stdin)
      </p>
      <div className={withButton ? 'flex items-start gap-2' : undefined}>
        <textarea
          value={inputDraft}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md px-3 py-2 text-sm font-mono"
          rows={3}
          placeholder="Type input here..."
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-dark)',
            border: '1px solid var(--color-border)',
            resize: 'vertical',
          }}
        />
        {withButton && (
          <button
            onClick={onRun}
            disabled={disabled}
            className="px-3 py-2 rounded-md text-xs font-semibold uppercase"
            style={{
              backgroundColor: 'var(--color-success)',
              color: '#fff',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.7 : 1,
              flexShrink: 0,
            }}
          >
            <span className="inline-flex items-center gap-1">
              <Play className="w-3.5 h-3.5" />
              Run
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function OutputPanel({
  result,
  isRunning,
  error,
  stdinInput,
  showInputEditor = false,
  inputDraft = '',
  onInputDraftChange,
  onRunWithInput,
  isRunWithInputDisabled = false,
}: OutputPanelProps) {
  const showComposer = showInputEditor && !!onInputDraftChange && !!onRunWithInput;

  if (isRunning) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
        {showComposer && (
          <StdinComposer inputDraft={inputDraft} onChange={onInputDraftChange!} onRun={onRunWithInput!} disabled={isRunWithInputDisabled} withButton={false} />
        )}
        <div className="flex-1 flex items-center justify-center gap-2" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-mono">Executing your code...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
        {showComposer && (
          <StdinComposer inputDraft={inputDraft} onChange={onInputDraftChange!} onRun={onRunWithInput!} disabled={isRunWithInputDisabled} withButton />
        )}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4">
          <AlertCircle className="w-6 h-6" style={{ color: 'var(--color-error)' }} />
          <span className="text-sm font-mono text-center" style={{ color: 'var(--color-error)' }}>{error}</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
        {showComposer && (
          <StdinComposer inputDraft={inputDraft} onChange={onInputDraftChange!} onRun={onRunWithInput!} disabled={isRunWithInputDisabled} withButton />
        )}
        <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--color-text-light)' }}>
          <span className="text-sm font-mono">Run your code to see output here</span>
        </div>
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
      {showComposer && (
        <StdinComposer inputDraft={inputDraft} onChange={onInputDraftChange!} onRun={onRunWithInput!} disabled={isRunWithInputDisabled} withButton />
      )}

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
        {stdinInput && (
          <div className="mb-3">
            <p className="text-xs font-semibold font-mono uppercase mb-1" style={{ color: 'var(--color-text-light)' }}>
              Input (stdin)
            </p>
            <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: 'var(--color-text-mid)' }}>
              {stdinInput}
            </pre>
          </div>
        )}
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
