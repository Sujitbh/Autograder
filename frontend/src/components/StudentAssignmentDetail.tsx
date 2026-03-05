'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { Button } from './ui/button';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { TestResultsPanel } from './TestResultsPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useAssignment } from '@/hooks/queries/useAssignments';
import { useSubmissions } from '@/hooks/queries/useSubmissions';
import { useCourses } from '@/hooks/queries/useCourses';
import { useAssignmentTestCases } from '@/hooks/queries/useTestCases';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { useTestCaseRunner } from '@/hooks/useTestCaseRunner';
import { submissionService } from '@/services/api';
import {
  Play,
  FlaskConical,
  Upload,
  RotateCcw,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Code2,
  FileUp,
  Terminal,
  TestTube2,
  Loader2,
} from 'lucide-react';

interface StudentAssignmentDetailProps {
  courseId: string;
  assignmentId: string;
}

const LANGUAGE_EXTENSION_MAP: Record<string, string> = {
  python: '.py',
  java: '.java',
  cpp: '.cpp',
  c: '.c',
  javascript: '.js',
};

const STARTER_COMMENTS: Record<string, string> = {
  python: '# Write your solution here\n\n',
  java: '// Write your solution here\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  cpp: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
  c: '// Write your solution here\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}\n',
  javascript: '// Write your solution here\n\n',
};

export function StudentAssignmentDetail({ courseId, assignmentId }: StudentAssignmentDetailProps) {
  const router = useRouter();
  const { data: courses } = useCourses();
  const { data: assignment, isLoading: assignmentLoading } = useAssignment(courseId, assignmentId);
  const { data: submissions, isLoading: submissionsLoading, refetch: refetchSubmissions } = useSubmissions(assignmentId);
  const { data: testCases } = useAssignmentTestCases(assignmentId);

  // Determine language from assignment
  const assignmentLang = assignment?.language ?? (assignment as any)?.allowed_languages ?? 'python';
  const language = String(assignmentLang).split(',')[0].trim().toLowerCase();

  // Code state
  const starterCode = assignment?.starterCode
    ?? STARTER_COMMENTS[language]
    ?? '// Write your solution here\n';
  const [code, setCode] = useState<string>('');
  const [mode, setMode] = useState<'editor' | 'upload'>('editor');
  const [outputTab, setOutputTab] = useState<'output' | 'tests'>('output');

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dialogs
  const [stdinDialogOpen, setStdinDialogOpen] = useState(false);
  const [stdinValue, setStdinValue] = useState('');
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Execution hooks
  const { execute, isRunning: isExecuting, result: execResult, error: execError } = useCodeExecution();
  const { runTests, isRunning: isTestsRunning, results: testResults, progress: testProgress } = useTestCaseRunner();

  // Auto-save
  const autoSaveKey = `autograder_code_${assignmentId}`;
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load saved code on mount
  useEffect(() => {
    const saved = localStorage.getItem(autoSaveKey);
    if (saved) {
      setCode(saved);
    } else {
      setCode(starterCode);
    }
  }, [autoSaveKey, starterCode]);

  // Auto-save code every 30 seconds
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (code && code !== starterCode) {
        localStorage.setItem(autoSaveKey, code);
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 30000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [code, autoSaveKey, starterCode]);

  const course = courses?.find((c) => c.id === courseId);
  const latestSubmission = submissions && submissions.length > 0 ? submissions[0] : null;

  // File upload handlers
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  // Run code
  const handleRunCode = async () => {
    await execute(code, language);
    setOutputTab('output');
  };

  // Run with stdin
  const handleRunWithStdin = async () => {
    setStdinDialogOpen(false);
    await execute(code, language, stdinValue);
    setOutputTab('output');
  };

  // Run public tests
  const handleRunTests = async () => {
    if (!testCases || testCases.length === 0) return;
    setOutputTab('tests');
    await runTests(code, language, testCases);
  };

  // Reset to starter code
  const handleReset = () => {
    setCode(starterCode);
    localStorage.removeItem(autoSaveKey);
    setConfirmResetOpen(false);
  };

  // Submit
  const handleSubmit = async () => {
    setConfirmSubmitOpen(false);
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      let filesToUpload: File[];
      if (mode === 'upload' && selectedFiles.length > 0) {
        filesToUpload = selectedFiles;
      } else {
        const ext = LANGUAGE_EXTENSION_MAP[language] ?? '.txt';
        const filename = `solution${ext}`;
        const blob = new File([code], filename, { type: 'text/plain' });
        filesToUpload = [blob];
      }

      await submissionService.uploadFiles(assignmentId, filesToUpload);
      setSubmitSuccess(true);
      refetchSubmissions();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading / error states
  if (assignmentLoading) {
    return (
      <PageLayout>
        <TopNav breadcrumbs={[{ label: 'My Courses', href: '/student' }, { label: 'Loading...' }]} />
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)', color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading assignment...
        </div>
      </PageLayout>
    );
  }

  if (!assignment) {
    return (
      <PageLayout>
        <TopNav breadcrumbs={[{ label: 'My Courses', href: '/student' }]} />
        <div className="flex items-center justify-center flex-col gap-3" style={{ height: 'calc(100vh - 64px)' }}>
          <AlertCircle className="w-12 h-12" style={{ color: 'var(--color-error)' }} />
          <p className="font-medium" style={{ color: 'var(--color-text-dark)' }}>Assignment not found</p>
          <Button variant="outline" onClick={() => router.push(`/student/courses/${courseId}`)}>Back to Course</Button>
        </div>
      </PageLayout>
    );
  }

  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date();

  return (
    <PageLayout>
      <TopNav breadcrumbs={[
        { label: 'My Courses', href: '/student' },
        { label: course?.name ?? 'Course', href: `/student/courses/${courseId}` },
        { label: assignment.name },
      ]} />

      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Assignment Header Bar */}
          <div
            className="flex items-center justify-between px-5 py-3 border-b shrink-0"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/student/courses/${courseId}`)}>
                ← Back
              </Button>
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-dark)' }}>
                  {assignment.name}
                </h1>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-mid)' }}>
                  {dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isOverdue && <span style={{ color: 'var(--color-error)', fontWeight: 600 }}> (Overdue)</span>}
                    </span>
                  )}
                  {assignment.maxPoints && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {assignment.maxPoints} pts
                    </span>
                  )}
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold text-white uppercase"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {language}
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
                  <CheckCircle2 className="w-3 h-3" /> Saved at {lastSaved}
                </span>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b shrink-0"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <div className="flex rounded-md border" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  onClick={() => setMode('editor')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: mode === 'editor' ? 'var(--color-primary)' : 'transparent',
                    color: mode === 'editor' ? '#fff' : 'var(--color-text-mid)',
                  }}
                >
                  <Code2 className="w-3.5 h-3.5" /> Write Code
                </button>
                <button
                  onClick={() => setMode('upload')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: mode === 'upload' ? 'var(--color-primary)' : 'transparent',
                    color: mode === 'upload' ? '#fff' : 'var(--color-text-mid)',
                  }}
                >
                  <FileUp className="w-3.5 h-3.5" /> Upload File
                </button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmResetOpen(true)}
                className="text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Run Code */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleRunCode}
                disabled={isExecuting || isTestsRunning}
                className="text-xs"
                style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
              >
                {isExecuting ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                Run
              </Button>

              {/* Run with Input */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStdinDialogOpen(true)}
                disabled={isExecuting || isTestsRunning}
                className="text-xs"
                style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
              >
                <Terminal className="w-3.5 h-3.5 mr-1" /> Run with Input
              </Button>

              {/* Run Public Tests */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleRunTests}
                disabled={isExecuting || isTestsRunning || !testCases || testCases.length === 0}
                className="text-xs"
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                {isTestsRunning ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <FlaskConical className="w-3.5 h-3.5 mr-1" />}
                Run Tests{testCases && testCases.length > 0 ? ` (${testCases.length})` : ''}
              </Button>

              {/* Submit */}
              <Button
                size="sm"
                onClick={() => setConfirmSubmitOpen(true)}
                disabled={isSubmitting || isExecuting || isTestsRunning}
                className="text-xs text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1" />}
                Submit
              </Button>
            </div>
          </div>

          {/* Success/Error banners */}
          {submitSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 text-sm" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <CheckCircle2 className="w-4 h-4" /> Assignment submitted successfully!
            </div>
          )}
          {submitError && (
            <div className="flex items-center gap-2 px-4 py-2 text-sm" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)' }}>
              <AlertCircle className="w-4 h-4" /> {submitError}
            </div>
          )}

          {/* Editor + Output Panel (Resizable) */}
          <ResizablePanelGroup direction="vertical" className="flex-1">
            <ResizablePanel defaultSize={65} minSize={30}>
              {mode === 'editor' ? (
                <CodeEditor language={language} value={code} onChange={setCode} />
              ) : (
                /* File Upload Mode */
                <div className="h-full flex items-center justify-center p-8" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="w-full max-w-lg border-2 border-dashed rounded-2xl p-10 text-center transition-all hover:border-[var(--color-primary)] hover:shadow-md"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
                    {selectedFiles.length > 0 ? (
                      <div className="space-y-3">
                        {selectedFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                              <span className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>{f.name}</span>
                              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>({(f.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}>
                              <X className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                            </button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFiles([])}
                          className="text-xs"
                        >
                          Clear Files
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold mb-1" style={{ color: 'var(--color-text-dark)' }}>
                          Drag & drop your file here
                        </p>
                        <p className="text-sm mb-4" style={{ color: 'var(--color-text-mid)' }}>
                          or click to browse
                        </p>
                        <label>
                          <Button size="sm" className="cursor-pointer" onClick={() => document.getElementById('file-input-ide')?.click()}>
                            Browse Files
                          </Button>
                          <input
                            id="file-input-ide"
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )}
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={35} minSize={15}>
              {/* Output Tab Selector */}
              <div className="h-full flex flex-col">
                <div className="flex border-b shrink-0" style={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)' }}>
                  <button
                    onClick={() => setOutputTab('output')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors"
                    style={{
                      color: outputTab === 'output' ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                      borderBottom: outputTab === 'output' ? '2px solid var(--color-primary)' : '2px solid transparent',
                    }}
                  >
                    <Terminal className="w-3.5 h-3.5" /> Output
                  </button>
                  <button
                    onClick={() => setOutputTab('tests')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors"
                    style={{
                      color: outputTab === 'tests' ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                      borderBottom: outputTab === 'tests' ? '2px solid var(--color-primary)' : '2px solid transparent',
                    }}
                  >
                    <TestTube2 className="w-3.5 h-3.5" /> Test Results
                    {testResults.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style={{
                        backgroundColor: testResults.every(r => r.passed) ? 'var(--color-success)' : 'var(--color-error)',
                      }}>
                        {testResults.filter(r => r.passed).length}/{testResults.length}
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex-1 min-h-0">
                  {outputTab === 'output' ? (
                    <OutputPanel result={execResult} isRunning={isExecuting} error={execError} />
                  ) : (
                    <TestResultsPanel results={testResults} isRunning={isTestsRunning} progress={testProgress} />
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Right Sidebar — Info Panel */}
        <div
          className="w-72 border-l overflow-y-auto shrink-0"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="p-5 space-y-5">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Description</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-mid)' }}>
                {assignment.description || 'No description provided.'}
              </p>
            </div>

            {/* Submission Status */}
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Submission Status</h3>
              {submissionsLoading ? (
                <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Loading...</p>
              ) : latestSubmission ? (
                <div className="space-y-2">
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: latestSubmission.status === 'graded' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                      color: latestSubmission.status === 'graded' ? 'var(--color-success)' : 'var(--color-warning)',
                    }}
                  >
                    {latestSubmission.status === 'graded' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    <span className="capitalize">{latestSubmission.status}</span>
                  </div>
                  {latestSubmission.grade && (
                    <p className="text-xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
                      {latestSubmission.grade.totalScore} / {latestSubmission.grade.maxScore}
                      <span className="text-sm font-normal ml-2" style={{ color: 'var(--color-text-mid)' }}>
                        ({latestSubmission.grade.percentage}%)
                      </span>
                    </p>
                  )}
                  {latestSubmission.submittedAt && (
                    <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>
                      Submitted: {new Date(latestSubmission.submittedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>No submissions yet</p>
              )}
            </div>

            {/* Previous Submissions */}
            {submissions && submissions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Previous Submissions ({submissions.length})
                </h3>
                <div className="space-y-2">
                  {submissions.slice(0, 5).map((sub, idx) => (
                    <div
                      key={sub.id}
                      className="p-2 rounded border text-xs"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium" style={{ color: 'var(--color-text-dark)' }}>
                          Attempt #{submissions.length - idx}
                        </span>
                        <span className="capitalize" style={{ color: 'var(--color-text-mid)' }}>
                          {sub.status}
                        </span>
                      </div>
                      {sub.grade && (
                        <p style={{ color: 'var(--color-text-mid)' }}>
                          Score: {sub.grade.totalScore}/{sub.grade.maxScore}
                        </p>
                      )}
                      {sub.submittedAt && (
                        <p className="mt-0.5" style={{ color: 'var(--color-text-light)' }}>
                          {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Cases Info */}
            {testCases && testCases.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Public Test Cases
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                  {testCases.length} public test{testCases.length !== 1 ? 's' : ''} available.
                  Additional private tests may be used for final grading.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stdin Dialog */}
      <Dialog open={stdinDialogOpen} onOpenChange={setStdinDialogOpen}>
        <DialogContent style={{ maxWidth: '500px' }}>
          <DialogHeader>
            <DialogTitle>Run with Input</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>
              Enter program input (stdin):
            </label>
            <Textarea
              value={stdinValue}
              onChange={(e) => setStdinValue(e.target.value)}
              placeholder="Type your input here..."
              className="mt-2 font-mono text-sm"
              rows={6}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setStdinDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRunWithStdin} className="text-white" style={{ backgroundColor: 'var(--color-success)' }}>
              <Play className="w-4 h-4 mr-2" /> Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Submit Dialog */}
      <Dialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
        <DialogContent style={{ maxWidth: '440px' }}>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
              You are submitting your solution for:
            </p>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-text-dark)' }}>{assignment.name}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-mid)' }}>
                {mode === 'upload' && selectedFiles.length > 0
                  ? `File: ${selectedFiles[0].name}`
                  : `File: solution${LANGUAGE_EXTENSION_MAP[language] ?? '.txt'}`
                }
              </p>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              This will run your code against all test cases (public + private) for final grading.
              {submissions && submissions.length > 0 && ` This will be attempt #${submissions.length + 1}.`}
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmSubmitOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Reset Dialog */}
      <Dialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
        <DialogContent style={{ maxWidth: '400px' }}>
          <DialogHeader>
            <DialogTitle>Reset Code</DialogTitle>
          </DialogHeader>
          <p className="text-sm mt-4" style={{ color: 'var(--color-text-mid)' }}>
            This will replace your current code with the original starter code. This action cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmResetOpen(false)}>Cancel</Button>
            <Button onClick={handleReset} variant="outline" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
