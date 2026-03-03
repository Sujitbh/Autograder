'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronRight, Loader2, Info } from 'lucide-react';
import { Progress } from './ui/progress';

export interface TestCaseRunResult {
  testcaseId: number;
  testName?: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTimeMs: number;
  points: number;
  pointsEarned: number;
  error?: string;
  status?: string;
}

interface TestResultsPanelProps {
  results: TestCaseRunResult[];
  isRunning: boolean;
  progress?: { current: number; total: number };
}

export function TestResultsPanel({ results, isRunning, progress }: TestResultsPanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isRunning) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-info)' }} />
          <span className="text-sm font-mono" style={{ color: 'var(--color-text-mid)' }}>
            Running Tests... ({progress?.current ?? 0}/{progress?.total ?? 0})
          </span>
        </div>
        {progress && progress.total > 0 && (
          <div className="px-4 py-2">
            <Progress value={(progress.current / progress.total) * 100} className="h-2" />
          </div>
        )}
        <div className="flex-1 overflow-auto px-4 py-2">
          {results.map((r, idx) => (
            <TestCaseRow key={r.testcaseId} result={r} index={idx} expanded={false} onToggle={() => {}} />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-light)' }}
      >
        <span className="text-sm font-mono">Run public tests to see results here</span>
      </div>
    );
  }

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const earnedPoints = results.reduce((s, r) => s + r.pointsEarned, 0);
  const totalPoints = results.reduce((s, r) => s + r.points, 0);
  const percentage = total > 0 ? (passed / total) * 100 : 0;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
      {/* Summary Bar */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-semibold font-mono"
              style={{ color: passed === total ? 'var(--color-success)' : 'var(--color-error)' }}
            >
              {passed}/{total} Tests Passed
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-mid)' }}>
              {earnedPoints}/{totalPoints} Points
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-mid)' }}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>

      {/* Test Case List */}
      <div className="flex-1 overflow-auto">
        {results.map((r, idx) => (
          <TestCaseRow
            key={r.testcaseId}
            result={r}
            index={idx}
            expanded={expandedIds.has(r.testcaseId)}
            onToggle={() => toggleExpanded(r.testcaseId)}
          />
        ))}
      </div>

      {/* Private test notice */}
      <div className="px-4 py-3 border-t flex items-start gap-2" style={{ borderColor: 'var(--color-border)' }}>
        <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--color-info)' }} />
        <p className="text-xs font-mono" style={{ color: 'var(--color-text-mid)' }}>
          Your final grade may include additional private test cases not shown here.
        </p>
      </div>
    </div>
  );
}

function TestCaseRow({
  result,
  index,
  expanded,
  onToggle,
}: {
  result: TestCaseRunResult;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isTimeout = result.status === 'timeout' || result.status === 'TIMEOUT';
  const Icon = result.passed ? CheckCircle2 : isTimeout ? AlertTriangle : XCircle;
  const iconColor = result.passed
    ? 'var(--color-success)'
    : isTimeout
    ? 'var(--color-warning)'
    : 'var(--color-error)';
  const bgColor = result.passed
    ? 'var(--color-success-bg)'
    : isTimeout
    ? 'var(--color-warning-bg)'
    : 'var(--color-error-bg)';

  return (
    <div style={{ borderBottom: '1px solid var(--color-border)' }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        style={{ backgroundColor: expanded ? bgColor : 'transparent' }}
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--color-text-mid)' }} />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-mid)' }} />
          )}
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
          <span className="text-sm font-mono" style={{ color: 'var(--color-text-dark)' }}>
            {result.testName ?? `Test ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono" style={{ color: 'var(--color-text-mid)' }}>
          <span>{result.passed ? 'Passed' : isTimeout ? 'Timeout' : 'Failed'}</span>
          <span>{result.executionTimeMs.toFixed(0)}ms</span>
          <span>{result.pointsEarned}/{result.points}pts</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3" style={{ paddingLeft: '52px' }}>
          {result.expectedOutput && (
            <div>
              <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-mid)' }}>Expected Output:</p>
              <pre
                className="text-xs font-mono p-2 rounded"
                style={{
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {result.expectedOutput}
              </pre>
            </div>
          )}
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-mid)' }}>Your Output:</p>
            <pre
              className="text-xs font-mono p-2 rounded"
              style={{
                backgroundColor: result.passed ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                color: result.passed ? 'var(--color-success)' : 'var(--color-error)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {result.actualOutput || '(no output)'}
            </pre>
          </div>
          {result.error && (
            <div>
              <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-mid)' }}>Error:</p>
              <pre
                className="text-xs font-mono p-2 rounded"
                style={{
                  backgroundColor: 'var(--color-error-bg)',
                  color: 'var(--color-error)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {result.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
