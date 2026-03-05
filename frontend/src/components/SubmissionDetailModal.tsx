'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, FileText, Clock, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import api from '@/services/api/client';

interface SubmissionDetail {
  id: number;
  status: string;
  score: number | null;
  max_score: number | null;
  submitted_at: string;
  files: { id: number; filename: string; content?: string }[];
  results: {
    testcase_id: number;
    test_name: string;
    passed: boolean;
    actual_output: string;
    expected_output: string;
    execution_time_ms: number;
    points: number;
    points_earned: number;
    error?: string;
  }[];
}

interface SubmissionDetailModalProps {
  open: boolean;
  onClose: () => void;
  submissionId: number | null;
  assignmentName?: string;
}

export function SubmissionDetailModal({ open, onClose, submissionId, assignmentName }: SubmissionDetailModalProps) {
  const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'code' | 'results'>('code');

  const { data: submission, isLoading } = useQuery({
    queryKey: ['submissionDetail', submissionId],
    queryFn: async () => {
      const { data } = await api.get<SubmissionDetail>(`/submissions/${submissionId}/detail`);
      return data;
    },
    enabled: !!submissionId && open,
  });

  const toggleTest = (id: number) => {
    setExpandedTests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!open || !submissionId) return null;

  const statusColor =
    submission?.status === 'graded'
      ? 'var(--color-success)'
      : submission?.status === 'pending'
      ? 'var(--color-warning)'
      : 'var(--color-text-mid)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative rounded-2xl w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-modal)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)' }}>
              <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-dark)' }}>
                Submission #{submissionId}
              </h2>
              {assignmentName && <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>{assignmentName}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--color-text-mid)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
          </div>
        ) : submission ? (
          <>
            {/* Status Bar */}
            <div className="px-6 py-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: statusColor === 'var(--color-success)' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)', color: statusColor }}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
                {submission.score !== null && submission.max_score !== null && (
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>
                    Score: {submission.score}/{submission.max_score}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-mid)' }}>
                <Clock className="w-3.5 h-3.5" />
                {new Date(submission.submitted_at).toLocaleString()}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-6 shrink-0" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setActiveTab('code')}
                className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
                style={{
                  borderColor: activeTab === 'code' ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === 'code' ? 'var(--color-primary)' : 'var(--color-text-mid)',
                }}
              >
                Submitted Code
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
                style={{
                  borderColor: activeTab === 'results' ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === 'results' ? 'var(--color-primary)' : 'var(--color-text-mid)',
                }}
              >
                Test Results
                {submission.results && submission.results.length > 0 && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-mid)' }}>
                    {submission.results.filter((r) => r.passed).length}/{submission.results.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'code' ? (
                <div className="p-6">
                  {submission.files && submission.files.length > 0 ? (
                    <div className="space-y-4">
                      {submission.files.map((file) => (
                        <div key={file.id} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                          <div className="px-4 py-2 border-b flex items-center gap-2" style={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)' }}>
                            <FileText className="w-4 h-4" style={{ color: 'var(--color-text-mid)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>{file.filename}</span>
                          </div>
                          {file.content ? (
                            <pre className="p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap" style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-dark)' }}>
                              {file.content}
                            </pre>
                          ) : (
                            <div className="p-4 text-sm" style={{ color: 'var(--color-text-mid)' }}>File content not available</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-mid)' }}>No files found for this submission.</p>
                  )}
                </div>
              ) : (
                <div>
                  {submission.results && submission.results.length > 0 ? (
                    <>
                      {/* Summary */}
                      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold" style={{ color: 'var(--color-text-dark)' }}>
                            {submission.results.filter((r) => r.passed).length}/{submission.results.length} Tests Passed
                          </span>
                          <span className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                            {submission.results.reduce((s, r) => s + r.points_earned, 0)}/
                            {submission.results.reduce((s, r) => s + r.points, 0)} Points
                          </span>
                        </div>
                      </div>

                      {/* Test List */}
                      {submission.results.map((result) => {
                        const expanded = expandedTests.has(result.testcase_id);
                        const Icon = result.passed ? CheckCircle2 : XCircle;
                        const iconColor = result.passed ? 'var(--color-success)' : 'var(--color-error)';

                        return (
                          <div key={result.testcase_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <button
                              onClick={() => toggleTest(result.testcase_id)}
                              className="w-full flex items-center justify-between px-6 py-3 transition-colors text-left"
                              style={{ backgroundColor: expanded ? (result.passed ? 'var(--color-success-bg)' : 'var(--color-error-bg)') : 'transparent' }}
                            >
                              <div className="flex items-center gap-3">
                                {expanded ? (
                                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-mid)' }} />
                                ) : (
                                  <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-mid)' }} />
                                )}
                                <Icon className="w-4 h-4" style={{ color: iconColor }} />
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>
                                  {result.test_name || `Test ${result.testcase_id}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-mid)' }}>
                                <span>{result.execution_time_ms.toFixed(0)}ms</span>
                                <span>{result.points_earned}/{result.points}pts</span>
                              </div>
                            </button>

                            {expanded && (
                              <div className="px-6 pb-4 pt-1 space-y-3" style={{ paddingLeft: '56px' }}>
                                {result.expected_output && (
                                  <div>
                                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>Expected Output:</p>
                                    <pre className="text-xs font-mono p-2 rounded border whitespace-pre-wrap" style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-border)', color: 'var(--color-success)' }}>
                                      {result.expected_output}
                                    </pre>
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>Actual Output:</p>
                                  <pre
                                    className="text-xs font-mono p-2 rounded border whitespace-pre-wrap"
                                    style={{
                                      backgroundColor: result.passed ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                                      borderColor: 'var(--color-border)',
                                      color: result.passed ? 'var(--color-success)' : 'var(--color-error)',
                                    }}
                                  >
                                    {result.actual_output || '(no output)'}
                                  </pre>
                                </div>
                                {result.error && (
                                  <div>
                                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>Error:</p>
                                    <pre className="text-xs font-mono p-2 rounded border whitespace-pre-wrap" style={{ backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
                                      {result.error}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
                      <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>No test results available for this submission.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t flex justify-end shrink-0" style={{ borderColor: 'var(--color-border)' }}>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center py-12">
            <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Submission not found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
