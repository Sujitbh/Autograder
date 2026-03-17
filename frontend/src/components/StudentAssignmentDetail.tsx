'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/utils/ThemeContext';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { Button } from './ui/button';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { useAssignment } from '@/hooks/queries/useAssignments';
import { useSubmissions } from '@/hooks/queries/useSubmissions';
import { useCourses } from '@/hooks/queries/useCourses';
import { useAssignmentTestCases } from '@/hooks/queries/useTestCases';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { useTestCaseRunner } from '@/hooks/useTestCaseRunner';
import { useAuth } from '@/utils/AuthContext';
import { submissionService } from '@/services/api';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FilePlus,
} from 'lucide-react';

interface StudentAssignmentDetailProps {
  courseId: string;
  assignmentId: string;
}

/* ── Multi-file type ── */
interface EditorFile {
  name: string;
  content: string;
  savedContent: string;
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

const FILE_ICONS: Record<string, string> = {
  java: '☕', cpp: '⚙️', c: '⚙️', js: '🟨', ts: '🔷',
  html: '🌐', css: '🎨', json: '{}', md: '📝', txt: '📄',
};
function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'py') return (
    <svg viewBox="0 0 256 255" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <path fill="#3776ab" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" />
      <path fill="#ffd343" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" />
    </svg>
  );
  return FILE_ICONS[ext] ?? '📄';
}

/* ── Confetti launcher ── */
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100000';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const colors = ['#6B0000', '#C9A84C', '#2D6A2D', '#1A4D7A', '#D4544C', '#E8CC6E', '#81C784', '#90CAF9'];
  const particles: {
    x: number; y: number; vx: number; vy: number;
    color: string; size: number; rotation: number; rotSpeed: number;
    life: number; decay: number; shape: 'rect' | 'circle';
  }[] = [];

  for (let i = 0; i < 120; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: Math.cos(angle) * speed * (0.5 + Math.random()),
      vy: Math.sin(angle) * speed * (0.5 + Math.random()) - 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 12,
      life: 1, decay: 0.008 + Math.random() * 0.012,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    });
  }

  function animate() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx; p.y += p.vy; p.vy += 0.15;
      p.rotation += p.rotSpeed; p.life -= p.decay;
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation * Math.PI / 180);
      ctx!.globalAlpha = Math.max(0, p.life);
      ctx!.fillStyle = p.color;
      if (p.shape === 'rect') ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      else { ctx!.beginPath(); ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx!.fill(); }
      ctx!.restore();
    }
    if (alive) requestAnimationFrame(animate);
    else canvas.remove();
  }
  requestAnimationFrame(animate);
}

export function StudentAssignmentDetail({ courseId, assignmentId }: StudentAssignmentDetailProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { data: courses } = useCourses();
  const { data: assignment, isLoading: assignmentLoading } = useAssignment(courseId, assignmentId);
  const { data: submissions, isLoading: submissionsLoading, refetch: refetchSubmissions } = useSubmissions(assignmentId);
  const { data: testCases } = useAssignmentTestCases(assignmentId);

  // Determine language from assignment
  const assignmentLang = assignment?.language ?? (assignment as any)?.allowed_languages ?? 'python';
  const language = String(assignmentLang).split(',')[0].trim().toLowerCase();

  // Code state — multi-file
  const starterCode = assignment?.starterCode
    ?? STARTER_COMMENTS[language]
    ?? '// Write your solution here\n';
  const defaultFileName = `solution${LANGUAGE_EXTENSION_MAP[language] ?? '.txt'}`;
  const [editorFiles, setEditorFiles] = useState<EditorFile[]>([]);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const activeFile = editorFiles[activeFileIdx] ?? null;
  const code = activeFile?.content ?? '';
  const setCode = (val: string) => {
    setEditorFiles(prev => prev.map((f, i) => i === activeFileIdx ? { ...f, content: val } : f));
  };
  const [mode, setMode] = useState<'editor' | 'upload'>('editor');
  const [infoTab, setInfoTab] = useState<'desc' | 'rubric' | 'tests' | 'submit'>('desc');
  const [outputOpen, setOutputOpen] = useState(false);
  const [outputPanelHeight, setOutputPanelHeight] = useState(280);

  // Panel visibility
  const [showExplorer, setShowExplorer] = useState(true);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [infoPanelWidth, setInfoPanelWidth] = useState(360);

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dialogs
  const [stdinValue, setStdinValue] = useState('');
  const [showInlineInput, setShowInlineInput] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Execution hooks
  const { execute, isRunning: isExecuting, result: execResult, error: execError, lastStdinInput } = useCodeExecution();
  const { runTests, isRunning: isTestsRunning, results: testResults, progress: testProgress } = useTestCaseRunner();

  // Auto-save
  const autoSaveKey = `autograder_code_${user?.id ?? 'anon'}_${courseId}_${assignmentId}`;
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load saved code on mount
  useEffect(() => {
    const savedJson = localStorage.getItem(autoSaveKey);
    if (savedJson) {
      try {
        const parsed = JSON.parse(savedJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEditorFiles(parsed.map((f: EditorFile) => ({ ...f, savedContent: f.content })));
          return;
        }
      } catch {
        // legacy string format
        const content = savedJson;
        setEditorFiles([{ name: defaultFileName, content, savedContent: content }]);
        return;
      }
    }
    setEditorFiles([{ name: defaultFileName, content: starterCode, savedContent: starterCode }]);
  }, [autoSaveKey, starterCode, defaultFileName]);

  // Auto-save code every 30 seconds
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (editorFiles.length > 0) {
        localStorage.setItem(autoSaveKey, JSON.stringify(editorFiles));
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 30000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [editorFiles, autoSaveKey]);

  const course = courses?.find((c) => c.id === courseId);
  const latestSubmission = submissions && submissions.length > 0 ? submissions[0] : null;
  const sectionWeightPercent = (weight?: number | null) => {
    if (weight == null || Number.isNaN(weight)) return 100;
    return weight <= 1.5 ? weight * 100 : weight;
  };
  const rubricSections = assignment?.rubric ?? [];
  const rubricTotalPoints = rubricSections.reduce((sum, section) => 
    sum + (section.criteria || []).reduce((sectionSum, crit) => sectionSum + (crit.maxPoints ?? 0), 0), 0);
  const getSectionFallbackPoints = (section: any) => {
    const assignmentMaxPoints = assignment?.maxPoints ?? 0;
    if (assignmentMaxPoints <= 0) return null;
    if (rubricSections.length === 1) return assignmentMaxPoints;
    if (isWeightedRubric) return Math.round((assignmentMaxPoints * sectionWeightPercent(section.weight)) / 100);
    return null;
  };
  const inferredWeightedRubric = rubricSections.some((section) => 
    Math.abs(sectionWeightPercent(section.weight) - 100) > 0.0001 || 
    (section.criteria || []).some((crit) => Math.abs((crit.weight ?? 1) - 1) > 0.0001)
  );
  const isWeightedRubric = assignment?.rubricMode === 'weighted' || inferredWeightedRubric;

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

  // Detect common stdin patterns by language to offer inline input automatically.
  const codeUsesInput = (codeStr: string, lang: string) => {
    const lines = codeStr.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) continue;
      if (lang === 'python' && trimmed.includes('input(')) return true;
      if (
        lang === 'java' && (
          trimmed.includes('Scanner')
          || trimmed.includes('System.in')
          || /\bnext(Line|Int|Double|Float|Long|Short|Byte|Boolean)?\s*\(/.test(trimmed)
        )
      ) {
        return true;
      }
    }
    return false;
  };

  // Run code
  const handleRunCode = async () => {
    setOutputOpen(true);
    if (codeUsesInput(code, language)) {
      if (!showInlineInput) {
        setShowInlineInput(true);
        return; // open input area on first click; user types then clicks Run inside
      }
      // input area already open — run with whatever is currently in stdinValue
      await execute(code, language, stdinValue);
      return;
    }
    setShowInlineInput(false);
    await execute(code, language);
  };

  const handleOpenInlineInput = () => {
    setOutputOpen(true);
    setShowInlineInput(true);
  };

  // Run with stdin
  const handleRunWithStdin = async () => {
    setOutputOpen(true);
    setShowInlineInput(true);
    await execute(code, language, stdinValue);
  };

  // Run public tests
  const handleRunTests = async () => {
    if (!testCases || testCases.length === 0) return;
    setInfoTab('tests');
    await runTests(code, language, testCases);
  };

  // Reset to starter code
  const handleReset = () => {
    setEditorFiles([{ name: defaultFileName, content: starterCode, savedContent: starterCode }]);
    setActiveFileIdx(0);
    localStorage.removeItem(autoSaveKey);
    setConfirmResetOpen(false);
  };

  // Multi-file helpers
  const addFile = (name: string) => {
    if (!name.trim()) return;
    if (editorFiles.find(f => f.name === name)) { setActiveFileIdx(editorFiles.findIndex(f => f.name === name)); return; }
    setEditorFiles(prev => [...prev, { name, content: '', savedContent: '' }]);
    setActiveFileIdx(editorFiles.length);
    setNewFileDialogOpen(false);
    setNewFileName('');
  };

  const closeEditorFile = (idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editorFiles.length <= 1) return; // keep at least one
    setEditorFiles(prev => prev.filter((_, i) => i !== idx));
    if (activeFileIdx >= idx && activeFileIdx > 0) setActiveFileIdx(prev => prev - 1);
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
        // Upload all editor files
        filesToUpload = editorFiles.map(f =>
          new File([f.content], f.name, { type: 'text/plain' })
        );
      }

      await submissionService.uploadFiles(assignmentId, filesToUpload);
      setSubmitSuccess(true);
      launchConfetti();
      refetchSubmissions();
      setTimeout(() => {
        setSubmitSuccess(false);
        router.push(`/student/courses/${courseId}`);
      }, 3000);
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

      <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex flex-1 overflow-hidden relative">

          {/* ── LEFT: Explorer ── */}
          {showExplorer && (
            <div
              className="flex flex-col shrink-0 overflow-hidden"
              style={{
                width: 220, minWidth: 220,
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                transition: 'margin-left .25s ease, opacity .25s ease',
              }}
            >
              <div style={{ padding: '12px 14px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', color: 'var(--color-text-light)', textTransform: 'uppercase' as const }}>
                Explorer
              </div>
              <div className="flex-1 overflow-y-auto" style={{ padding: '4px 0' }}>
                {editorFiles.map((f, idx) => {
                  const isActive = idx === activeFileIdx;
                  const isModified = f.content !== f.savedContent;
                  return (
                    <div
                      key={f.name}
                      onClick={() => setActiveFileIdx(idx)}
                      className="group"
                      style={{
                        display: 'flex', alignItems: 'center',
                        padding: '5px 14px', cursor: 'pointer',
                        fontSize: 13, color: isActive ? 'var(--color-text-dark)' : 'var(--color-text-mid)',
                        borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                        background: isActive ? 'var(--color-surface-elevated)' : 'transparent',
                        gap: 6, transition: 'background .15s',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? 'var(--color-surface-elevated)' : 'transparent'; }}
                    >
                      <span style={{ fontSize: 14, flexShrink: 0, display: 'inline-flex', alignItems: 'center', width: 16, height: 16 }}>{getFileIcon(f.name)}</span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{f.name}</span>
                      {isModified && <span style={{ color: 'var(--color-primary)', fontSize: 16, lineHeight: '1', marginRight: 2, flexShrink: 0 }}>●</span>}
                      {editorFiles.length > 1 && (
                        <button
                          onClick={(e) => closeEditorFile(idx, e)}
                          className="opacity-0 group-hover:opacity-100"
                          style={{ fontSize: 14, color: 'var(--color-text-light)', padding: '2px 4px', borderRadius: 3, transition: 'opacity .15s, background .15s', flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-error)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-light)'; }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column' as const, gap: 4, borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => setNewFileDialogOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: 'var(--color-text-mid)', transition: 'background .15s', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: 15 }}>＋</span> New File
                </button>
                <button
                  onClick={() => document.getElementById('upload-input-explorer')?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: 'var(--color-text-mid)', transition: 'background .15s', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: 15 }}>⬆</span> Upload Files
                </button>
                <input
                  type="file"
                  id="upload-input-explorer"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    Array.from(e.target.files).forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const content = ev.target?.result as string ?? '';
                        setEditorFiles(prev => {
                          const existing = prev.findIndex(ef => ef.name === file.name);
                          if (existing >= 0) {
                            const updated = [...prev];
                            updated[existing] = { name: file.name, content, savedContent: content };
                            return updated;
                          }
                          return [...prev, { name: file.name, content, savedContent: content }];
                        });
                        setActiveFileIdx(editorFiles.length);
                      };
                      reader.readAsText(file);
                    });
                    e.target.value = '';
                  }}
                />
              </div>
            </div>
          )}

          {/* ── CENTER: Editor ── */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            {/* Editor Topbar (matches codelab.html) */}
            <div style={{
              height: 38, background: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-dark)' }}>
                {activeFile?.name ?? 'No file open'}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const,
                letterSpacing: '.6px', padding: '2px 8px', borderRadius: 10,
                background: isDark ? '#3b1a1a' : '#fef3c7',
                color: isDark ? '#fca5a5' : '#92400e',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                {language.charAt(0).toUpperCase() + language.slice(1)}
              </span>
              <div style={{ flex: 1 }} />

              {/* Run button */}
              <button
                onClick={handleRunCode}
                disabled={isExecuting || isTestsRunning}
                style={{
                  padding: '5px 16px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                  background: '#16a34a', color: '#fff', letterSpacing: '.3px',
                  transition: 'background .15s, box-shadow .2s',
                  opacity: isExecuting || isTestsRunning ? 0.7 : 1,
                  cursor: isExecuting || isTestsRunning ? 'not-allowed' : 'pointer',
                  border: 'none',
                }}
                onMouseEnter={e => { if (!isExecuting && !isTestsRunning) { e.currentTarget.style.background = '#15803d'; e.currentTarget.style.boxShadow = '0 0 10px rgba(22,163,74,.5)'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {isExecuting ? '⏳ Running...' : '▶ Run'}
              </button>

              <button
                onClick={handleOpenInlineInput}
                disabled={isExecuting || isTestsRunning}
                style={{
                  padding: '5px 12px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                  background: 'var(--color-surface-elevated)', color: 'var(--color-text-dark)', letterSpacing: '.3px',
                  transition: 'background .15s',
                  opacity: isExecuting || isTestsRunning ? 0.7 : 1,
                  cursor: isExecuting || isTestsRunning ? 'not-allowed' : 'pointer',
                  border: '1px solid var(--color-border)',
                }}
                onMouseEnter={e => { if (!isExecuting && !isTestsRunning) { e.currentTarget.style.background = 'var(--color-border)'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
              >
                ⌨ Input
              </button>

              <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 6px' }} />

              {/* Layout toggles (matching codelab SVG icons) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <button
                  onClick={() => setShowExplorer(v => !v)}
                  title="Toggle Explorer"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: showExplorer ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                    transition: 'background .12s, color .12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = showExplorer ? 'var(--color-text-dark)' : 'var(--color-text-light)'; }}
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}>
                    <rect x="1" y="1" width="4.5" height="14" rx="1" fill="currentColor" opacity=".35" />
                    <rect x="1" y="1" width="14" height="14" rx="1.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setOutputOpen(v => !v)}
                  title="Toggle Output Panel"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: outputOpen ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                    transition: 'background .12s, color .12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = outputOpen ? 'var(--color-text-dark)' : 'var(--color-text-light)'; }}
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}>
                    <rect x="1" y="9.5" width="14" height="5.5" rx="1" fill="currentColor" opacity=".35" />
                    <rect x="1" y="1" width="14" height="14" rx="1.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowInfoPanel(v => !v)}
                  title="Toggle Info Panel"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: showInfoPanel ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                    transition: 'background .12s, color .12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = showInfoPanel ? 'var(--color-text-dark)' : 'var(--color-text-light)'; }}
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}>
                    <rect x="10.5" y="1" width="4.5" height="14" rx="1" fill="currentColor" opacity=".35" />
                    <rect x="1" y="1" width="14" height="14" rx="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Editor area */}
            <div className="flex-1 overflow-hidden relative">
              <CodeEditor language={language} value={code} onChange={setCode} />
            </div>

            {/* Output Panel (collapsible, matching codelab) */}
            <div style={{
              height: outputOpen ? outputPanelHeight : 0,
              background: 'var(--color-surface)',
              borderTop: outputOpen ? '1px solid var(--color-border)' : 'none',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column' as const,
            }}>
              {/* Drag-to-resize handle */}
              <div
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startH = outputPanelHeight;
                  const onMove = (ev: MouseEvent) => setOutputPanelHeight(Math.max(120, Math.min(700, startH + (startY - ev.clientY))));
                  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                  window.addEventListener('mousemove', onMove);
                  window.addEventListener('mouseup', onUp);
                }}
                style={{ height: 5, cursor: 'ns-resize', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-elevated)' }}
              >
                <div style={{ width: 28, height: 3, borderRadius: 2, background: 'var(--color-border)' }} />
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 14px', background: 'var(--color-surface-elevated)',
                borderBottom: '1px solid var(--color-border)',
                fontSize: 11, fontWeight: 600, color: 'var(--color-text-light)', flexShrink: 0,
              }}>
                <span>⬤ OUTPUT</span>
                <button
                  onClick={() => setOutputOpen(false)}
                  style={{
                    fontSize: 14, color: 'var(--color-text-light)', padding: '2px 6px', borderRadius: 3,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-light)'; }}
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <OutputPanel
                  result={execResult}
                  isRunning={isExecuting}
                  error={execError}
                  stdinInput={lastStdinInput}
                  showInputEditor={showInlineInput}
                  inputDraft={stdinValue}
                  onInputDraftChange={setStdinValue}
                  onRunWithInput={handleRunWithStdin}
                  isRunWithInputDisabled={isExecuting || isTestsRunning}
                />
              </div>
            </div>

            {/* Success/Error banners */}
            {submitSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', fontSize: 13, background: isDark ? 'rgba(74,222,128,.12)' : 'rgba(22,163,74,.10)', color: isDark ? '#4ade80' : '#16a34a', flexShrink: 0 }}>
                <CheckCircle2 className="w-4 h-4" /> You have successfully submitted the assignment! Redirecting back to assignment page…
              </div>
            )}
            {submitError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', fontSize: 13, background: isDark ? 'rgba(248,113,113,.12)' : 'rgba(220,38,38,.08)', color: isDark ? '#f87171' : '#dc2626', flexShrink: 0 }}>
                <AlertCircle className="w-4 h-4" /> {submitError}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info Panel (tabbed, matching codelab) ── */}
          {showInfoPanel && (
            <div
              className="flex flex-col overflow-hidden shrink-0"
              style={{
                width: infoPanelWidth, minWidth: infoPanelWidth,
                background: 'var(--color-surface)',
                borderLeft: '1px solid var(--color-border)',
                transition: 'width .3s ease, min-width .3s ease, opacity .25s ease',
                position: 'relative',
              }}
            >
              <div
                onMouseDown={(e) => {
                  const startX = e.clientX;
                  const startWidth = infoPanelWidth;
                  const onMove = (ev: MouseEvent) => {
                    const next = Math.max(300, Math.min(760, startWidth + (startX - ev.clientX)));
                    setInfoPanelWidth(next);
                  };
                  const onUp = () => {
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                  };
                  window.addEventListener('mousemove', onMove);
                  window.addEventListener('mouseup', onUp);
                }}
                title="Drag to resize panel"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 6,
                  cursor: 'col-resize',
                  zIndex: 20,
                  background: 'transparent',
                }}
              />
              {/* Tabs */}
              <div style={{ display: 'flex', padding: '8px 10px 0', gap: 4, flexShrink: 0, flexWrap: 'wrap' as const }}>
                {(['desc', 'rubric', 'tests', 'submit'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setInfoTab(tab)}
                    style={{
                      padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 600,
                      whiteSpace: 'nowrap' as const, transition: 'all .2s',
                      background: infoTab === tab ? '#7f1d1d' : 'transparent',
                      color: infoTab === tab ? '#fff' : 'var(--color-text-light)',
                      border: 'none', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (infoTab !== tab) { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-mid)'; } }}
                    onMouseLeave={e => { if (infoTab !== tab) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-light)'; } }}
                  >
                    {tab === 'desc' ? '📋 Description' : tab === 'rubric' ? '📊 Rubric' : tab === 'tests' ? '🧪 Tests' : '📤 Submit'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto" style={{ padding: 16 }}>
                {/* ── Description Tab ── */}
                {infoTab === 'desc' && (
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 6 }}>
                      {assignment.name}
                    </h2>
                    {dueDate && (
                      <div style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 600,
                        padding: '4px 12px', borderRadius: 12,
                        background: isDark ? 'rgba(251,191,36,.12)' : 'rgba(180,83,9,.10)',
                        color: isDark ? '#fbbf24' : '#b45309',
                        margin: '8px 0 16px',
                      }}>
                        📅 Due: {dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isOverdue && ' (Overdue!)'}
                      </div>
                    )}
                    <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-mid)', whiteSpace: 'pre-wrap' as const }}>
                      {assignment.description || 'No description provided.'}
                    </div>
                    {assignment.maxPoints && (
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 12px', marginTop: 16, borderRadius: 6,
                        background: isDark ? 'rgba(74,222,128,.12)' : 'rgba(22,163,74,.10)',
                        fontWeight: 700, color: isDark ? '#4ade80' : '#16a34a', fontSize: 14,
                      }}>
                        <span>Total Points</span><span>{assignment.maxPoints}</span>
                      </div>
                    )}

                    {/* Submission Status */}
                    {latestSubmission && (
                      <div style={{ marginTop: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: 8 }}>
                          Submission Status
                        </h3>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                          background: latestSubmission.status === 'graded'
                            ? (isDark ? 'rgba(74,222,128,.12)' : 'rgba(22,163,74,.10)')
                            : (isDark ? 'rgba(251,191,36,.12)' : 'rgba(180,83,9,.10)'),
                          color: latestSubmission.status === 'graded'
                            ? (isDark ? '#4ade80' : '#16a34a')
                            : (isDark ? '#fbbf24' : '#b45309'),
                        }}>
                          {latestSubmission.status === 'graded' ? '✅' : '⏳'} {latestSubmission.status.charAt(0).toUpperCase() + latestSubmission.status.slice(1)}
                        </div>
                        {latestSubmission.grade && (
                          <>
                            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-dark)', marginTop: 8 }}>
                              {latestSubmission.grade.totalScore} / {latestSubmission.grade.maxScore}
                              <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 8, color: 'var(--color-text-mid)' }}>
                                ({latestSubmission.grade.percentage}%)
                              </span>
                            </p>

                            {latestSubmission.grade.feedback && latestSubmission.grade.feedback.trim() && (
                              <div
                                style={{
                                  marginTop: 10,
                                  padding: '10px 12px',
                                  borderRadius: 6,
                                  border: '1px solid var(--color-border)',
                                  background: 'var(--color-surface-elevated)',
                                }}
                              >
                                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--color-text-light)', marginBottom: 5 }}>
                                  Faculty Feedback
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--color-text-dark)', whiteSpace: 'pre-wrap' }}>
                                  {latestSubmission.grade.feedback}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Rubric Tab ── */}
                {infoTab === 'rubric' && (
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 10 }}>
                      📊 Rubric &amp; Points
                    </h2>

                    {rubricSections.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '.4px',
                            textTransform: 'uppercase' as const,
                            color: isWeightedRubric ? '#6B0000' : '#2D6A2D',
                            background: isWeightedRubric ? 'rgba(107,0,0,.10)' : 'rgba(45,106,45,.12)',
                            border: `1px solid ${isWeightedRubric ? 'rgba(107,0,0,.24)' : 'rgba(45,106,45,.24)'}`,
                          }}
                        >
                          {isWeightedRubric ? 'Weighted Rubric' : 'Unweighted Rubric'}
                        </span>
                      </div>
                    )}

                    {rubricSections.length > 0 ? (
                      <>
                        {/* Rubric sections */}
                        {rubricSections.map((section, sectionIdx) => (
                          <div key={sectionIdx} style={{ marginBottom: 16 }}>
                            {/* Section header */}
                            <div style={{
                              padding: '10px 12px',
                              background: 'var(--color-surface)',
                              borderRadius: '6px 6px 0 0',
                              borderBottom: '1px solid var(--color-border)',
                              fontWeight: 700,
                              fontSize: 13,
                              color: 'var(--color-text-dark)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                              <span>{section.name}</span>
                              {isWeightedRubric && <span style={{ fontSize: 11, color: 'var(--color-text-light)' }}>Weight: {sectionWeightPercent(section.weight).toFixed(1)}%</span>}
                            </div>

                            {(section.criteria || []).length > 0 ? (
                              <table style={{
                                width: '100%',
                                borderCollapse: 'collapse' as const,
                                fontSize: 12,
                                borderRadius: '0 0 6px 6px',
                                overflow: 'hidden',
                                marginBottom: sectionIdx < rubricSections.length - 1 ? 12 : 0,
                              }}>
                                <thead>
                                  <tr style={{ background: 'var(--color-surface-elevated)' }}>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-light)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>Criteria</th>
                                    <th style={{ textAlign: 'center', width: 70, padding: '8px 12px', color: 'var(--color-text-light)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>Points</th>
                                    {isWeightedRubric && <th style={{ textAlign: 'center', width: 70, padding: '8px 12px', color: 'var(--color-text-light)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>Weight</th>}
                                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-light)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(section.criteria || []).map((criterion, critIdx) => (
                                    <tr key={critIdx} style={{ borderTop: '1px solid var(--color-border)' }}>
                                      <td style={{ padding: '10px 12px', color: 'var(--color-text-dark)', fontWeight: 500 }}>{criterion.name}</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'center', color: isDark ? '#4ade80' : '#16a34a', fontWeight: 700 }}>{criterion.maxPoints ?? 0}</td>
                                      {isWeightedRubric && <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--color-text-dark)', fontWeight: 600 }}>{((criterion.weight ?? 1) * 100).toFixed(0)}%</td>}
                                      <td style={{ padding: '10px 12px', color: 'var(--color-text-mid)', fontSize: 11 }}>{criterion.description || '—'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <div style={{
                                border: '1px solid var(--color-border)',
                                borderTop: 'none',
                                borderRadius: '0 0 6px 6px',
                                padding: '14px 12px',
                                background: 'var(--color-surface-elevated)',
                                marginBottom: sectionIdx < rubricSections.length - 1 ? 12 : 0,
                              }}>
                                {section.description ? (
                                  <p style={{ fontSize: 12, color: 'var(--color-text-mid)', lineHeight: 1.6, marginBottom: isWeightedRubric ? 10 : 0 }}>
                                    {section.description}
                                  </p>
                                ) : (
                                  <p style={{ fontSize: 12, color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                                    No criteria were defined for this section.
                                  </p>
                                )}
                                {getSectionFallbackPoints(section) !== null && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12 }}>
                                    <span style={{ color: 'var(--color-text-light)', fontWeight: 600 }}>Points</span>
                                    <span style={{ color: isDark ? '#4ade80' : '#16a34a', fontWeight: 700 }}>{getSectionFallbackPoints(section)}</span>
                                  </div>
                                )}
                                {isWeightedRubric && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12 }}>
                                    <span style={{ color: 'var(--color-text-light)', fontWeight: 600 }}>Section Weight</span>
                                    <span style={{ color: 'var(--color-text-dark)', fontWeight: 700 }}>{sectionWeightPercent(section.weight).toFixed(1)}%</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Total points summary */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          borderRadius: 6,
                          background: isDark ? 'rgba(74,222,128,.12)' : 'rgba(22,163,74,.10)',
                          color: isDark ? '#4ade80' : '#16a34a',
                          fontWeight: 700,
                          fontSize: 14,
                        }}>
                          <span>Total Points</span>
                          <span>{rubricTotalPoints || assignment.maxPoints || 0}</span>
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: 13, color: 'var(--color-text-mid)' }}>
                        No rubric has been published for this assignment.
                      </p>
                    )}
                  </div>
                )}

                {/* ── Tests Tab ── */}
                {infoTab === 'tests' && (
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 6 }}>
                      🧪 Test Cases
                    </h2>
                    {testCases && testCases.length > 0 ? (
                      <>
                        <button
                          onClick={handleRunTests}
                          disabled={isTestsRunning}
                          style={{
                            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                            background: '#7f1d1d', color: '#fff', marginBottom: 14,
                            transition: 'all .2s', border: 'none', cursor: isTestsRunning ? 'not-allowed' : 'pointer',
                            opacity: isTestsRunning ? 0.7 : 1,
                          }}
                          onMouseEnter={e => { if (!isTestsRunning) e.currentTarget.style.background = '#991b1b'; }}
                          onMouseLeave={e => e.currentTarget.style.background = '#7f1d1d'}
                        >
                          {isTestsRunning ? '⏳ Running...' : '▶ Run All Tests'}
                        </button>
                        {testCases.map((tc, i) => {
                          const result = testResults.find(r => r.testcaseId === tc.id) ?? testResults[i];
                          const status = result ? (result.passed ? 'pass' : 'fail') : 'pending';
                          return (
                            <div key={tc.id ?? i} style={{
                              background: 'var(--color-surface-elevated)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 6, padding: 14, marginBottom: 10,
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-dark)' }}>
                                  {tc.name ?? `Test ${i + 1}`}
                                </span>
                                <span style={{
                                  fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 10, textTransform: 'uppercase' as const,
                                  background: status === 'pass' ? (isDark ? 'rgba(74,222,128,.12)' : 'rgba(22,163,74,.10)')
                                    : status === 'fail' ? (isDark ? 'rgba(248,113,113,.12)' : 'rgba(220,38,38,.08)')
                                      : 'var(--color-surface)',
                                  color: status === 'pass' ? (isDark ? '#4ade80' : '#16a34a')
                                    : status === 'fail' ? (isDark ? '#f87171' : '#dc2626')
                                      : 'var(--color-text-light)',
                                }}>
                                  {status === 'pass' ? '✅ Passed' : status === 'fail' ? '❌ Failed' : '⏳ Not Run'}
                                </span>
                              </div>
                              {tc.input_data != null && tc.input_data !== '' && (
                                <div style={{ marginBottom: 8 }}>
                                  <div style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '.5px', color: 'var(--color-text-light)', marginBottom: 4, fontWeight: 600 }}>Input</div>
                                  <div style={{
                                    background: 'var(--color-surface)', padding: '8px 12px', borderRadius: 4,
                                    fontFamily: 'monospace', fontSize: 12, color: isDark ? '#4ade80' : '#16a34a',
                                    whiteSpace: 'pre' as const, overflowX: 'auto' as const,
                                  }}>
                                    {tc.input_data}
                                  </div>
                                </div>
                              )}
                              {tc.expected_output != null && tc.expected_output !== '' && (
                                <div style={{ marginBottom: 8 }}>
                                  <div style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '.5px', color: 'var(--color-text-light)', marginBottom: 4, fontWeight: 600 }}>Expected Output</div>
                                  <div style={{
                                    background: 'var(--color-surface)', padding: '8px 12px', borderRadius: 4,
                                    fontFamily: 'monospace', fontSize: 12, color: isDark ? '#4ade80' : '#16a34a',
                                    whiteSpace: 'pre' as const, overflowX: 'auto' as const,
                                  }}>
                                    {tc.expected_output}
                                  </div>
                                </div>
                              )}
                              {result && !result.passed && result.actualOutput && (
                                <div style={{ marginBottom: 8 }}>
                                  <div style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '.5px', color: 'var(--color-text-light)', marginBottom: 4, fontWeight: 600 }}>Actual Output</div>
                                  <div style={{
                                    background: 'var(--color-surface)', padding: '8px 12px', borderRadius: 4,
                                    fontFamily: 'monospace', fontSize: 12, color: isDark ? '#f87171' : '#dc2626',
                                    whiteSpace: 'pre' as const, overflowX: 'auto' as const,
                                  }}>
                                    {result.actualOutput}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <p style={{ fontSize: 13, color: 'var(--color-text-mid)' }}>No public test cases available.</p>
                    )}
                  </div>
                )}

                {/* ── Submit Tab ── */}
                {infoTab === 'submit' && (
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 6 }}>
                      📤 Submit Assignment
                    </h2>

                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-dark)', margin: '16px 0 8px' }}>
                      Pre-flight Checklist
                    </h3>
                    <ul style={{ listStyle: 'none', margin: '12px 0', padding: 0 }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', fontSize: 13, color: 'var(--color-text-mid)', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: 16 }}>{editorFiles.length > 0 ? '✅' : '⬜'}</span> Files added: <b>{editorFiles.length}</b>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', fontSize: 13, color: 'var(--color-text-mid)', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: 16 }}>
                          {testCases && testResults.length === testCases.length && testResults.every(r => r.passed) ? '✅' : '⬜'}
                        </span>
                        Tests passed: <b style={{ color: isDark ? '#4ade80' : '#16a34a' }}>{testResults.filter(r => r.passed).length}</b> / {testCases?.length ?? 0}
                      </li>
                      {testResults.filter(r => !r.passed).length > 0 && (
                        <li style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', fontSize: 13, color: 'var(--color-text-mid)', borderBottom: '1px solid var(--color-border)' }}>
                          <span style={{ fontSize: 16 }}>❌</span> Tests failed: <b style={{ color: isDark ? '#f87171' : '#dc2626' }}>{testResults.filter(r => !r.passed).length}</b>
                        </li>
                      )}
                    </ul>

                    {/* Previous submissions */}
                    {submissions && submissions.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-dark)', margin: '16px 0 8px' }}>
                          Previous Submissions ({submissions.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                          {submissions.slice(0, 5).map((sub, idx) => (
                            <div key={sub.id} style={{ padding: 8, borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 12 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontWeight: 500, color: 'var(--color-text-dark)' }}>Attempt #{submissions.length - idx}</span>
                                <span style={{ textTransform: 'capitalize' as const, color: 'var(--color-text-mid)' }}>{sub.status}</span>
                              </div>
                              {sub.grade && (
                                <p style={{ color: 'var(--color-text-mid)' }}>Score: {sub.grade.totalScore}/{sub.grade.maxScore}</p>
                              )}
                              {sub.submittedAt && (
                                <p style={{ color: 'var(--color-text-light)', marginTop: 2 }}>{new Date(sub.submittedAt).toLocaleString()}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submit button (gradient, matching codelab) */}
                    <button
                      onClick={() => setConfirmSubmitOpen(true)}
                      disabled={isSubmitting || isExecuting || isTestsRunning}
                      style={{
                        width: '100%', padding: 14, borderRadius: 6,
                        fontSize: 14, fontWeight: 700, border: 'none',
                        background: isDark ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #991b1b, #7f1d1d)',
                        color: '#fff', transition: 'all .2s', marginTop: 8,
                        textTransform: 'uppercase' as const, letterSpacing: '.5px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                      onMouseEnter={e => {
                        if (!isSubmitting) {
                          e.currentTarget.style.background = isDark ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #b91c1c, #991b1b)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = isDark ? '0 4px 16px rgba(220,38,38,.4)' : '0 4px 16px rgba(127,29,29,.35)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = isDark ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #991b1b, #7f1d1d)';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Assignment'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ═══ STATUS BAR (matching codelab) ═══ */}
        <div style={{
          height: 28, background: '#7f1d1d', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', fontSize: 11, fontWeight: 500, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: .9 }}>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: .9 }}>
              {editorFiles.length} file{editorFiles.length !== 1 ? 's' : ''} open
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {lastSaved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: .9 }}>
                ✓ Saved at {lastSaved}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* New File Dialog */}
      <Dialog open={newFileDialogOpen} onOpenChange={setNewFileDialogOpen}>
        <DialogContent style={{ maxWidth: '400px' }}>
          <DialogHeader>
            <DialogTitle>New File</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>
              File name:
            </label>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newFileName.trim()) {
                  addFile(newFileName.trim());
                  setNewFileName('');
                  setNewFileDialogOpen(false);
                }
              }}
              placeholder={`e.g. helper${LANGUAGE_EXTENSION_MAP[language] ?? '.txt'}`}
              className="mt-2 w-full px-3 py-2 text-sm rounded border font-mono"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-dark)' }}
              autoFocus
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setNewFileDialogOpen(false); setNewFileName(''); }}>Cancel</Button>
            <Button
              onClick={() => {
                if (newFileName.trim()) {
                  addFile(newFileName.trim());
                  setNewFileName('');
                  setNewFileDialogOpen(false);
                }
              }}
              className="text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <FilePlus className="w-4 h-4 mr-2" /> Create
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
