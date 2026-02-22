import { X, CheckCircle, XCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Save, Send, AlertTriangle, Shield, Copy, Users } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface RubricItem {
  name: string;
  description?: string;
  maxPoints: number;
}

interface GradingModalProps {
  onClose: () => void;
  studentName?: string;
  assignmentName?: string;
  submittedAt?: string;
  autoScore?: number | null;
  maxPoints?: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  /* Rubric from assignment meta */
  rubric?: RubricItem[];
  /* Callbacks */
  onSubmitGrade?: (grade: number, feedback: string) => void;
  onSaveDraft?: (grade: number, feedback: string) => void;
  /* Group grading */
  isGroupAssignment?: boolean;
  groupName?: string;
  groupMemberNames?: string[];
  onApplyToGroup?: (grade: number) => void;
}

export function GradingModal({
  onClose,
  studentName = 'John Smith',
  assignmentName = 'Variables and Data Types',
  submittedAt = '2026-02-18T14:30:00',
  autoScore = 85,
  maxPoints = 100,
  hasPrev = false,
  hasNext = false,
  onPrev,
  onNext,
  rubric,
  onSubmitGrade,
  onSaveDraft,
  isGroupAssignment = false,
  groupName,
  groupMemberNames = [],
  onApplyToGroup,
}: GradingModalProps) {
  const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({
    public: true,
    private: false,
  });

  const [expandedAIAlerts, setExpandedAIAlerts] = useState(true);

  // Mock AI detection results
  const aiDetectionResults = {
    plagiarismDetected: true,
    plagiarismScore: 76,
    similarSubmissions: [
      { student: 'Sarah Jones', similarity: 76, matchedLines: 45 },
      { student: 'Mike Wilson', similarity: 42, matchedLines: 22 }
    ],
    aiCodeDetected: true,
    aiConfidence: 68,
    suspiciousSections: [
      { startLine: 15, endLine: 28, reason: 'Pattern matches common AI-generated code structure' },
      { startLine: 35, endLine: 42, reason: 'Unusual commenting style consistent with AI output' }
    ]
  };

  const testResults = {
    public: [
      { id: '1', name: 'Test Case 1: Basic Input', status: 'pass', input: '5', expected: '25', actual: '25' },
      { id: '2', name: 'Test Case 2: Zero Input', status: 'pass', input: '0', expected: '0', actual: '0' },
      { id: '3', name: 'Test Case 3: Negative Input', status: 'fail', input: '-3', expected: '9', actual: 'Error: invalid input' },
    ],
    private: [
      { id: '4', name: 'Private Test 1: Large Numbers', status: 'pass', input: '100', expected: '10000', actual: '10000' },
      { id: '5', name: 'Private Test 2: Edge Case', status: 'pass', input: '999', expected: '998001', actual: '998001' },
    ],
  };

  const defaultRubric: RubricItem[] = [
    { name: 'Code Correctness', maxPoints: 50 },
    { name: 'Code Style', maxPoints: 20 },
    { name: 'Documentation', maxPoints: 30 },
  ];
  const rubricCriteria = rubric && rubric.length > 0 ? rubric : defaultRubric;

  // Stateful scores per rubric criterion — initialise from autoScore proportionally, or 0
  const [rubricScores, setRubricScores] = useState<number[]>(() => {
    const totalMax = rubricCriteria.reduce((s, c) => s + c.maxPoints, 0);
    if (autoScore != null && totalMax > 0) {
      return rubricCriteria.map(c => Math.round((autoScore / totalMax) * c.maxPoints));
    }
    return rubricCriteria.map(() => 0);
  });

  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  const toggleTestSection = (section: string) => {
    setExpandedTests(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getTotalScore = () => rubricScores.reduce((sum, s) => sum + s, 0);
  const getTotalMaxPoints = () => rubricCriteria.reduce((sum, c) => sum + c.maxPoints, 0);

  const updateRubricScore = (idx: number, value: number) => {
    setRubricScores(prev => {
      const next = [...prev];
      next[idx] = Math.max(0, Math.min(value, rubricCriteria[idx].maxPoints));
      return next;
    });
  };

  /* ─── Keyboard shortcuts ─── */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); onSaveDraft?.(getTotalScore(), feedback); setSavedDraft(true); setTimeout(() => setSavedDraft(false), 1500); return; }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); onSubmitGrade?.(getTotalScore(), feedback); setSubmitted(true); setTimeout(() => { setSubmitted(false); onClose(); }, 1200); return; }
    if (e.key === 'ArrowLeft' && hasPrev && onPrev) { onPrev(); return; }
    if (e.key === 'ArrowRight' && hasNext && onNext) { onNext(); return; }
  }, [onClose, hasPrev, hasNext, onPrev, onNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  const autoScorePct = autoScore !== null && autoScore !== undefined && maxPoints ? Math.round((autoScore / maxPoints) * 100) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div
        className="bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: '90vw',
          height: '90vh',
          maxWidth: '1600px',
          boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4">
            {/* Prev / Next navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="p-1.5 rounded hover:bg-[var(--color-primary-bg)] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Previous student"
                title="Previous student (←)"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="p-1.5 rounded hover:bg-[var(--color-primary-bg)] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Next student"
                title="Next student (→)"
              >
                <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </button>
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#6B0000' }}>
                {studentName}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '2px' }}>
                {assignmentName}{formattedDate ? ` — Submitted ${formattedDate}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
            aria-label="Close modal (Esc)"
          >
            <X className="w-6 h-6 text-[var(--color-text-mid)]" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Code & Test Results (60%) */}
          <div className="w-[60%] border-r overflow-auto" style={{ borderColor: 'var(--color-border)' }}>
            {/* AI Detection Alerts */}
            {(aiDetectionResults.plagiarismDetected || aiDetectionResults.aiCodeDetected) && (
              <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-warning-bg)' }}>
                <button
                  onClick={() => setExpandedAIAlerts(!expandedAIAlerts)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-warning)' }}>
                      AI Detection Alerts (Advisory Only)
                    </h3>
                  </div>
                  {expandedAIAlerts ? (
                    <ChevronUp className="w-5 h-5 text-[var(--color-warning)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--color-warning)]" />
                  )}
                </button>

                {expandedAIAlerts && (
                  <div className="space-y-4">
                    {/* Plagiarism Alert */}
                    {aiDetectionResults.plagiarismDetected && (
                      <div className="bg-white rounded-lg p-4" style={{ border: '1px solid var(--color-warning)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Copy className="w-4 h-4 text-[var(--color-warning)]" />
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-warning)' }}>
                              Plagiarism Detection
                            </span>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-warning)' }}>
                            {aiDetectionResults.plagiarismScore}% Similar
                          </span>
                        </div>

                        <p style={{ fontSize: '12px', color: 'var(--color-warning)', marginBottom: '12px' }}>
                          Code shows high similarity to other submissions
                        </p>

                        <div className="space-y-2">
                          {aiDetectionResults.similarSubmissions.map((match, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span style={{ fontSize: '12px', color: 'var(--color-text-dark)' }}>
                                {match.student}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--color-warning)', fontWeight: 500 }}>
                                {match.similarity}% ({match.matchedLines} lines)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Code Detection Alert */}
                    {aiDetectionResults.aiCodeDetected && (
                      <div className="bg-white rounded-lg p-4" style={{ border: '1px solid var(--color-warning)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[var(--color-warning)]" />
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-warning)' }}>
                              AI-Generated Code Detection
                            </span>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-warning)' }}>
                            {aiDetectionResults.aiConfidence}% Confidence
                          </span>
                        </div>

                        <p style={{ fontSize: '12px', color: 'var(--color-warning)', marginBottom: '12px' }}>
                          Code patterns suggest possible AI generation
                        </p>

                        <div className="space-y-2">
                          {aiDetectionResults.suspiciousSections.map((section, index) => (
                            <div key={index} className="text-sm">
                              <span style={{ fontSize: '12px', color: 'var(--color-text-dark)', fontWeight: 500 }}>
                                Lines {section.startLine}-{section.endLine}:
                              </span>
                              <p style={{ fontSize: '11px', color: 'var(--color-text-mid)', marginTop: '2px' }}>
                                {section.reason}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2 p-3 rounded" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
                      <AlertTriangle className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
                      <p style={{ fontSize: '11px', color: 'var(--color-warning)' }}>
                        <strong>Important:</strong> These are advisory alerts only. Review the code and make your final judgment. Do not automatically deduct points based on AI detection.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Code Viewer */}
            <div className="p-6">
              <h3 className="mb-3" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                Student Code
              </h3>
              <div
                className="rounded-lg p-4 overflow-x-auto"
                style={{
                  backgroundColor: '#1E1E1E',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '13px',
                  lineHeight: '20px'
                }}
              >
                <pre className="text-white">
                  {`def square(n):
    """
    Calculate the square of a number.
    
    Args:
        n (int): The number to square
        
    Returns:
        int: The square of n
    """
    if n < 0:
        raise ValueError("Negative numbers not supported")
    
    result = n * n
    return result

# Test the function
print(square(5))`}
                </pre>
              </div>
            </div>

            {/* Test Results */}
            <div className="px-6 pb-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                Test Results
              </h3>

              {/* Public Tests */}
              <div className="mb-4">
                <button
                  onClick={() => toggleTestSection('public')}
                  className="w-full flex items-center justify-between p-3 rounded-t-lg transition-colors hover:bg-[var(--color-primary-bg)]"
                  style={{ backgroundColor: 'var(--color-primary-bg)' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                    Public Test Cases (2/3 passed)
                  </span>
                  {expandedTests.public ? (
                    <ChevronUp className="w-5 h-5 text-[var(--color-primary)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--color-primary)]" />
                  )}
                </button>

                {expandedTests.public && (
                  <div className="border border-t-0 rounded-b-lg" style={{ borderColor: 'var(--color-border)' }}>
                    {testResults.public.map((test) => (
                      <div key={test.id} className="p-4 border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                            {test.name}
                          </span>
                          {test.status === 'pass' ? (
                            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[var(--color-error)]" />
                          )}
                        </div>
                        <div className="space-y-1" style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
                          <div><strong>Input:</strong> {test.input}</div>
                          <div><strong>Expected:</strong> {test.expected}</div>
                          <div><strong>Actual:</strong> {test.actual}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Private Tests */}
              <div>
                <button
                  onClick={() => toggleTestSection('private')}
                  className="w-full flex items-center justify-between p-3 rounded-t-lg transition-colors hover:bg-[var(--color-warning-bg)]"
                  style={{ backgroundColor: 'var(--color-warning-bg)' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-warning)' }}>
                    Private Test Cases (2/2 passed)
                  </span>
                  {expandedTests.private ? (
                    <ChevronUp className="w-5 h-5 text-[var(--color-warning)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--color-warning)]" />
                  )}
                </button>

                {expandedTests.private && (
                  <div className="border border-t-0 rounded-b-lg" style={{ borderColor: 'var(--color-border)' }}>
                    {testResults.private.map((test) => (
                      <div key={test.id} className="p-4 border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                            {test.name}
                          </span>
                          {test.status === 'pass' ? (
                            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[var(--color-error)]" />
                          )}
                        </div>
                        <div className="space-y-1" style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
                          <div><strong>Input:</strong> {test.input}</div>
                          <div><strong>Expected:</strong> {test.expected}</div>
                          <div><strong>Actual:</strong> {test.actual}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Rubric & Feedback (40%) */}
          <div className="w-[40%] flex flex-col">
            <div className="flex-1 overflow-auto p-6">
              {/* Auto Score Card */}
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FF' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A4D7A', marginBottom: '4px' }}>Auto Score</p>
                <div className="flex items-baseline gap-2">
                  <span style={{ fontSize: '28px', fontWeight: 700, color: '#6B0000' }}>
                    {autoScore !== null && autoScore !== undefined ? autoScore : '—'} / {maxPoints}
                  </span>
                  {autoScorePct !== null && (
                    <span style={{ fontSize: '14px', color: '#595959' }}>({autoScorePct}%)</span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#1A4D7A', marginTop: '6px' }}>
                  Tests Passed: {testResults.public.filter(t => t.status === 'pass').length + testResults.private.filter(t => t.status === 'pass').length} / {testResults.public.length + testResults.private.length}
                </p>
              </div>

              {/* Rubric Grading */}
              <div className="mb-6">
                <h3 className="mb-4" style={{ fontSize: '16px', fontWeight: 600, color: '#2D2D2D' }}>
                  Rubric Grading
                </h3>
                <div className="space-y-3">
                  {rubricCriteria.map((criterion, index) => (
                    <div key={index} className="p-4 border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                          {criterion.name}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                          {rubricScores[index]} / {criterion.maxPoints}
                        </span>
                      </div>
                      <Input
                        type="number"
                        value={rubricScores[index]}
                        onChange={(e) => updateRubricScore(index, parseInt(e.target.value) || 0)}
                        max={criterion.maxPoints}
                        min={0}
                        className="border-[var(--color-border)]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Score */}
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                    TOTAL
                  </span>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: (getTotalScore() / getTotalMaxPoints()) >= 0.9 ? '#2D6A2D'
                      : (getTotalScore() / getTotalMaxPoints()) >= 0.7 ? '#6B0000' : '#8B0000',
                  }}>
                    {getTotalScore()} / {getTotalMaxPoints()}
                  </span>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block mb-2" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                  Overall Feedback
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => { if (e.target.value.length <= 500) setFeedback(e.target.value); }}
                  placeholder="Provide feedback on the student's work..."
                  rows={8}
                  className="border-[var(--color-border)]"
                  maxLength={500}
                />
                <p className="text-right mt-1" style={{ fontSize: '11px', color: feedback.length >= 450 ? '#8B0000' : '#8A8A8A' }}>
                  {feedback.length} / 500
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t p-6" style={{ borderColor: 'var(--color-border)' }}>
              {/* Group Assignment Banner */}
              {isGroupAssignment && groupName && groupMemberNames.length > 0 && (
                <div className="mb-4 p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#F5EDED', border: '1px solid #6B0000' }}>
                  <Users className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#6B0000' }} />
                  <div className="flex-1">
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B0000' }}>
                      Group Assignment — {groupName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#595959', marginTop: '2px' }}>
                      Other members: {groupMemberNames.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <button className="hover:underline" style={{ fontSize: '13px', color: '#6B0000' }}>
                  Request Resubmission
                </button>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onSaveDraft?.(getTotalScore(), feedback);
                    setSavedDraft(true);
                    setTimeout(() => setSavedDraft(false), 1500);
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savedDraft ? 'Saved!' : 'Save Draft'}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  style={{ backgroundColor: submitted ? '#2D6A2D' : 'var(--color-primary)' }}
                  onClick={() => {
                    onSubmitGrade?.(getTotalScore(), feedback);
                    setSubmitted(true);
                    setTimeout(() => {
                      setSubmitted(false);
                      onClose();
                    }, 1200);
                  }}
                >
                  {submitted ? (
                    <><CheckCircle className="w-4 h-4 mr-2" /> Submitted!</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Submit Grade</>
                  )}
                </Button>
              </div>

              {/* Apply to Group button - only for group assignments */}
              {isGroupAssignment && groupName && groupMemberNames.length > 0 && onApplyToGroup && (
                <Button
                  type="button"
                  className="w-full mt-3 text-white"
                  style={{ backgroundColor: '#2D6A2D' }}
                  onClick={() => onApplyToGroup(getTotalScore())}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Apply Grade ({getTotalScore()}/{getTotalMaxPoints()}) to All Group Members
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
