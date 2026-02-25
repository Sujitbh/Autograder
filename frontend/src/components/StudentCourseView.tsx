'use client';

/* ═══════════════════════════════════════════════════════════════════
   StudentCourseView — Submit, Rubric, Grades, Tests tabs per assignment
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    ChevronLeft, Upload, FileText, CheckCircle, Clock,
    AlertTriangle, Loader2, X, BarChart3, ListChecks,
    Star, PlayCircle, CheckCircle2, XCircle, MinusCircle,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import SubmissionComponent from './SubmissionComponent';
import api from '@/services/api/client';
import { submissionService, type SubmissionRecord } from '@/services/api/submissionService';

// ── API helpers ──────────────────────────────────────────────────────

async function fetchAssignments(courseId: string) {
    const { data } = await api.get<any[]>('/assignments/', { params: { course_id: courseId } });
    return data;
}
async function fetchMySubmissions(assignmentId: string): Promise<SubmissionRecord[]> {
    return submissionService.getMySubmissions(assignmentId);
}
async function fetchRubrics(assignmentId: string) {
    const { data } = await api.get<any[]>('/rubrics/', { params: { assignment_id: assignmentId } });
    return data;
}
async function fetchTestCases(assignmentId: string) {
    const { data } = await api.get<any[]>('/testcases/', { params: { assignment_id: assignmentId } });
    return data.filter((tc: any) => tc.is_public);
}
async function fetchSubmissionResults(submissionId: number) {
    const { data } = await api.get<any[]>(`/submissions/${submissionId}/results`);
    return data;
}

// ── Status badge ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const cfg: Record<string, { bg: string; text: string; label: string }> = {
        pending: { bg: '#F5F5F5', text: '#595959', label: 'Pending' },
        grading: { bg: '#E8F0FF', text: '#1A4D7A', label: 'Grading…' },
        graded:  { bg: '#E8F5E8', text: '#2D6A2D', label: 'Graded' },
        error:   { bg: '#FFF0F0', text: '#8B0000', label: 'Error' },
    };
    const s = cfg[status] ?? cfg.pending;
    return (
        <span style={{
            display: 'inline-block', backgroundColor: s.bg, color: s.text,
            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const,
            padding: '3px 10px', borderRadius: '12px',
        }}>{s.label}</span>
    );
}

// ── Tab definitions ───────────────────────────────────────────────────

const TABS = [
    { id: 'submit', label: 'Submit',  Icon: Upload     },
    { id: 'grades', label: 'Grades',  Icon: Star       },
    { id: 'rubric', label: 'Rubric',  Icon: ListChecks },
    { id: 'tests',  label: 'Tests',   Icon: PlayCircle },
];

// ── Submit Tab ────────────────────────────────────────────────────────

function SubmitTab({ assignmentId, assignmentTitle, mySubmissions, loadingSubmissions, refetchSubmissions }: {
    assignmentId: number;
    assignmentTitle?: string;
    mySubmissions: SubmissionRecord[];
    loadingSubmissions: boolean;
    refetchSubmissions: () => void;
}) {
    // 'code' = paste code editor | 'file' = file upload
    const [submitMode, setSubmitMode] = useState<'code' | 'file'>('code');

    // File upload state
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(Array.from(e.target.files ?? []));
        setUploadError(null); setUploadSuccess(false);
    };
    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        setUploading(true); setUploadError(null); setUploadSuccess(false);
        try {
            await submissionService.uploadFiles(String(assignmentId), selectedFiles);
            setUploadSuccess(true); setSelectedFiles([]);
            if (fileRef.current) fileRef.current.value = '';
            refetchSubmissions();
        } catch (err: any) { setUploadError(err.message ?? 'Upload failed'); }
        finally { setUploading(false); }
    };

    return (
        <div className="space-y-4">
            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)', width: 'fit-content' }}>
                {(['code', 'file'] as const).map(mode => (
                    <button key={mode} onClick={() => setSubmitMode(mode)}
                        className="px-4 py-2 text-xs font-semibold transition-colors"
                        style={{
                            backgroundColor: submitMode === mode ? '#6B0000' : 'white',
                            color: submitMode === mode ? 'white' : 'var(--color-text-mid)',
                        }}>
                        {mode === 'code' ? '✏️  Paste Code' : '📁  Upload File'}
                    </button>
                ))}
            </div>

            {/* ── PASTE CODE mode ── */}
            {submitMode === 'code' && (
                <SubmissionComponent
                    assignmentId={assignmentId}
                    assignmentTitle={assignmentTitle}
                />
            )}

            {/* ── UPLOAD FILE mode ── */}
            {submitMode === 'file' && (
                <div className="space-y-4">
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', marginBottom: '8px', display: 'block' }}>
                            Upload Files (.py, .java, or any source file)
                        </label>
                        <div className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors"
                            style={{ borderColor: selectedFiles.length > 0 ? '#6B0000' : 'var(--color-border)', backgroundColor: selectedFiles.length > 0 ? '#FBF5F5' : '#F9FAFB' }}
                            onClick={() => fileRef.current?.click()}>
                            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#8A8A8A' }} />
                            <p style={{ fontSize: '14px', color: '#595959' }}>
                                {selectedFiles.length > 0 ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected` : 'Click or drag files here'}
                            </p>
                            <p style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '4px' }}>.py, .java, .zip or any source file</p>
                            <input ref={fileRef} type="file" multiple accept=".py,.java,.zip,.c,.cpp,.js,.ts,.txt" className="hidden" onChange={handleFileChange} />
                        </div>
                        {selectedFiles.length > 0 && (
                            <div className="mt-3 space-y-1">
                                {selectedFiles.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                                        <FileText className="w-4 h-4 flex-shrink-0" style={{ color: '#595959' }} />
                                        <span style={{ fontSize: '13px', color: '#2D2D2D', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                                        <button onClick={() => setSelectedFiles(p => p.filter((_, idx) => idx !== i))} className="hover:opacity-70">
                                            <X className="w-3.5 h-3.5" style={{ color: '#8A8A8A' }} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {uploadError && <p style={{ fontSize: '13px', color: '#B91C1C' }}>{uploadError}</p>}
                    {uploadSuccess && (
                        <div className="flex items-center gap-2" style={{ color: '#2D6A2D' }}>
                            <CheckCircle className="w-4 h-4" />
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>Submitted successfully!</span>
                        </div>
                    )}
                    <Button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} className="w-full text-white" style={{ backgroundColor: '#6B0000', height: '44px' }}>
                        {uploading
                            ? <><span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />Uploading…</>
                            : <><Upload className="w-4 h-4 mr-2" />Submit Assignment</>}
                    </Button>

                    {/* Submission history */}
                    {!loadingSubmissions && mySubmissions.length > 0 && (
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', marginBottom: '8px' }}>Submission History ({mySubmissions.length})</p>
                            <div className="space-y-2">
                                {[...mySubmissions].reverse().map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: '#F9FAFB', border: '1px solid var(--color-border)' }}>
                                        <div>
                                            <StatusBadge status={sub.status} />
                                            <p style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '4px' }}>
                                                {sub.created_at ? new Date(sub.created_at).toLocaleString() : ''}{' · '}{sub.files.length} file{sub.files.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        {sub.status === 'graded' && sub.score != null && (
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#2D6A2D' }}>
                                                {sub.score}{sub.max_score != null ? `/${sub.max_score}` : ''}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Grades Tab ────────────────────────────────────────────────────────

function GradesTab({ mySubmissions, loadingSubmissions }: { mySubmissions: SubmissionRecord[]; loadingSubmissions: boolean }) {
    if (loadingSubmissions) return (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-5 h-5 animate-spin" /><span>Loading grades…</span>
        </div>
    );
    if (mySubmissions.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--color-text-mid)' }}>
            <Star className="w-12 h-12 mb-3 opacity-20" />
            <p style={{ fontSize: '15px' }}>No submissions yet</p>
            <p style={{ fontSize: '13px', marginTop: '4px', opacity: 0.7 }}>Submit your code to see grades here</p>
        </div>
    );
    const graded = mySubmissions.filter(s => s.status === 'graded');
    return (
        <div className="space-y-4">
            {graded.length === 0 ? (
                <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: '#B45309' }} />
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#92400E' }}>Not yet graded</p>
                    <p style={{ fontSize: '13px', color: '#B45309', marginTop: '4px' }}>Your submission is awaiting grading</p>
                </div>
            ) : graded.map(sub => (
                <div key={sub.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                    <div className="px-5 py-4" style={{ backgroundColor: '#F0FDF4', borderBottom: '1px solid #B2D8B2' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#2D6A2D' }}>Score</p>
                                <p style={{ fontSize: '32px', fontWeight: 800, color: '#2D6A2D', lineHeight: '36px' }}>
                                    {sub.score ?? '—'}{sub.max_score != null && <span style={{ fontSize: '18px', fontWeight: 500 }}> / {sub.max_score}</span>}
                                </p>
                            </div>
                            {sub.score != null && sub.max_score != null && (
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #2D6A2D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#2D6A2D' }}>
                                    {Math.round((sub.score / sub.max_score) * 100)}%
                                </div>
                            )}
                        </div>
                    </div>
                    {sub.feedback && (
                        <div className="px-5 py-4">
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#595959', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Professor Feedback</p>
                            <p style={{ fontSize: '14px', color: '#2D2D2D', lineHeight: '20px' }}>{sub.feedback}</p>
                        </div>
                    )}
                    <div className="px-5 py-3" style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid var(--color-border)' }}>
                        <p style={{ fontSize: '12px', color: '#8A8A8A' }}>
                            Graded {sub.graded_at ? new Date(sub.graded_at).toLocaleString() : ''}{' · '}{sub.files.length} file{sub.files.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            ))}
            {mySubmissions.filter(s => s.status !== 'graded').map(sub => (
                <div key={sub.id} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: '#F9FAFB', border: '1px solid var(--color-border)' }}>
                    <div>
                        <StatusBadge status={sub.status} />
                        <p style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '4px' }}>{sub.created_at ? new Date(sub.created_at).toLocaleString() : ''}</p>
                    </div>
                    <p style={{ fontSize: '12px', color: '#8A8A8A' }}>Awaiting grade</p>
                </div>
            ))}
        </div>
    );
}

// ── Rubric Tab ────────────────────────────────────────────────────────

function RubricTab({ assignmentId }: { assignmentId: number }) {
    const { data: rubrics = [], isLoading, error } = useQuery({
        queryKey: ['rubrics', assignmentId],
        queryFn: () => fetchRubrics(String(assignmentId)),
        enabled: !!assignmentId,
    });
    if (isLoading) return (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-5 h-5 animate-spin" /><span>Loading rubric…</span>
        </div>
    );
    if (error) return (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: '#ef4444' }}>
            <AlertTriangle className="w-5 h-5" /><span>Failed to load rubric.</span>
        </div>
    );
    if (rubrics.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--color-text-mid)' }}>
            <ListChecks className="w-12 h-12 mb-3 opacity-20" />
            <p style={{ fontSize: '15px' }}>No rubric published yet</p>
            <p style={{ fontSize: '13px', marginTop: '4px', opacity: 0.7 }}>Check back after the professor adds grading criteria</p>
        </div>
    );
    const totalPoints = rubrics.reduce((s: number, r: any) => s + (r.max_points ?? 0), 0);
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)' }}>{rubrics.length} Criteria</p>
                <p style={{ fontSize: '13px', color: '#6B0000', fontWeight: 600 }}>Total: {totalPoints} pts</p>
            </div>
            {rubrics.map((r: any, i: number) => (
                <div key={r.id} className="rounded-xl p-4" style={{ border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#6B000015', color: '#6B0000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                            <div className="flex-1 min-w-0">
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>{r.name}</p>
                                {r.description && <p style={{ fontSize: '13px', color: '#595959', marginTop: '3px', lineHeight: '18px' }}>{r.description}</p>}
                                {r.weight != null && <p style={{ fontSize: '11px', color: '#8A8A8A', marginTop: '4px' }}>Weight: {r.weight}</p>}
                            </div>
                        </div>
                        {r.max_points != null && (
                            <div style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#6B000015', color: '#6B0000', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{r.max_points} pts</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Tests Tab ─────────────────────────────────────────────────────────

function TestsTab({ assignmentId, latestSubmissionId }: { assignmentId: number; latestSubmissionId?: number }) {
    const { data: testCases = [], isLoading: loadingTC, error: tcError } = useQuery({
        queryKey: ['testcases', assignmentId],
        queryFn: () => fetchTestCases(String(assignmentId)),
        enabled: !!assignmentId,
    });
    const { data: results = [], isLoading: loadingResults } = useQuery({
        queryKey: ['submission-results', latestSubmissionId],
        queryFn: () => fetchSubmissionResults(latestSubmissionId!),
        enabled: !!latestSubmissionId,
    });
    const resultMap = new Map<number, any>(results.map((r: any) => [r.testcase_id, r]));

    if (loadingTC) return (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-5 h-5 animate-spin" /><span>Loading test cases…</span>
        </div>
    );
    if (tcError) return (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: '#ef4444' }}>
            <AlertTriangle className="w-5 h-5" /><span>Failed to load test cases.</span>
        </div>
    );
    if (testCases.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--color-text-mid)' }}>
            <PlayCircle className="w-12 h-12 mb-3 opacity-20" />
            <p style={{ fontSize: '15px' }}>No public test cases</p>
            <p style={{ fontSize: '13px', marginTop: '4px', opacity: 0.7 }}>The professor hasn't published test cases yet</p>
        </div>
    );
    const hasResults = results.length > 0;
    const passed = testCases.filter((tc: any) => resultMap.get(tc.id)?.passed === true).length;
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)' }}>{testCases.length} Public Test Case{testCases.length !== 1 ? 's' : ''}</p>
                {hasResults && <p style={{ fontSize: '13px', fontWeight: 600, color: passed === testCases.length ? '#2D6A2D' : '#8B0000' }}>{passed}/{testCases.length} Passed</p>}
                {!hasResults && !loadingResults && <p style={{ fontSize: '12px', color: '#8A8A8A' }}>Submit code to see results</p>}
            </div>
            {hasResults && testCases.length > 0 && (
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#F5F5F5', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: `${(passed / testCases.length) * 100}%`, backgroundColor: passed === testCases.length ? '#2D6A2D' : '#6B0000', borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
            )}
            {testCases.map((tc: any, i: number) => {
                const result = resultMap.get(tc.id);
                const hasPassed = result?.passed === true;
                const hasFailed = result?.passed === false;
                return (
                    <div key={tc.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${hasPassed ? '#B2D8B2' : hasFailed ? '#FECACA' : 'var(--color-border)'}` }}>
                        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: hasPassed ? '#F0FDF4' : hasFailed ? '#FFF5F5' : '#F9FAFB' }}>
                            <div className="flex items-center gap-2">
                                {hasPassed && <CheckCircle2 className="w-4 h-4" style={{ color: '#2D6A2D' }} />}
                                {hasFailed && <XCircle className="w-4 h-4" style={{ color: '#8B0000' }} />}
                                {!result && <MinusCircle className="w-4 h-4" style={{ color: '#8A8A8A' }} />}
                                <span style={{ fontSize: '13px', fontWeight: 600, color: hasPassed ? '#2D6A2D' : hasFailed ? '#8B0000' : '#595959' }}>Test Case {i + 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {tc.points != null && <span style={{ fontSize: '12px', color: '#8A8A8A' }}>{tc.points} pts</span>}
                                {result?.points_awarded != null && <span style={{ fontSize: '12px', fontWeight: 700, color: hasPassed ? '#2D6A2D' : '#8B0000' }}>+{result.points_awarded}</span>}
                                {result?.execution_time_ms != null && <span style={{ fontSize: '11px', color: '#8A8A8A' }}>{result.execution_time_ms.toFixed(1)}ms</span>}
                            </div>
                        </div>
                        <div className="px-4 py-3 space-y-2" style={{ backgroundColor: '#fff' }}>
                            {tc.input_data && (
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Input</p>
                                    <pre style={{ fontSize: '12px', backgroundColor: '#F5F5F5', padding: '8px 10px', borderRadius: '6px', overflowX: 'auto', color: '#2D2D2D', margin: 0 }}>{tc.input_data}</pre>
                                </div>
                            )}
                            <div>
                                <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Expected Output</p>
                                <pre style={{ fontSize: '12px', backgroundColor: '#F5F5F5', padding: '8px 10px', borderRadius: '6px', overflowX: 'auto', color: '#2D2D2D', margin: 0 }}>{tc.expected_output}</pre>
                            </div>
                            {result?.output && (
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: hasPassed ? '#2D6A2D' : '#8B0000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Your Output</p>
                                    <pre style={{ fontSize: '12px', backgroundColor: hasPassed ? '#F0FDF4' : '#FFF5F5', padding: '8px 10px', borderRadius: '6px', overflowX: 'auto', color: '#2D2D2D', margin: 0 }}>{result.output}</pre>
                                </div>
                            )}
                            {result?.error_output && (
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#8B0000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Error</p>
                                    <pre style={{ fontSize: '12px', backgroundColor: '#FFF5F5', padding: '8px 10px', borderRadius: '6px', overflowX: 'auto', color: '#8B0000', margin: 0 }}>{result.error_output}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────

export default function StudentCourseView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { courseId } = useParams() as { courseId: string };

    const initialTab = searchParams.get('tab') ?? 'submit';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [activeAssignmentId, setActiveAssignmentId] = useState<number | null>(null);

    // Fetch assignments for this course
    const {
        data: assignments = [],
        isLoading: loadingAssignments,
        error: assignmentsError,
    } = useQuery({
        queryKey: ['assignments', courseId],
        queryFn: () => fetchAssignments(courseId),
        enabled: !!courseId,
    });

    // Auto-select first assignment
    useEffect(() => {
        if (assignments.length > 0 && activeAssignmentId === null) {
            setActiveAssignmentId(assignments[0].id);
        }
    }, [assignments, activeAssignmentId]);

    const activeAssignment = assignments.find((a: any) => a.id === activeAssignmentId);

    const {
        data: mySubmissions = [],
        isLoading: loadingSubmissions,
        refetch: refetchSubmissions,
    } = useQuery({
        queryKey: ['my-submissions', activeAssignmentId],
        queryFn: () => fetchMySubmissions(String(activeAssignmentId)),
        enabled: !!activeAssignmentId,
    });

    const latestSubmission: SubmissionRecord | undefined = mySubmissions[mySubmissions.length - 1];

    // ── Render ──────────────────────────────────────────────────────

    return (
        <PageLayout>
            <TopNav breadcrumbs={[
                { label: 'My Courses', href: '/student' },
                { label: `Course ${courseId}`, href: `/student/courses/${courseId}/assignments` },
                { label: 'Assignments' },
            ]} />

            <div className="flex h-[calc(100vh-64px)]">
                <main className="flex-1 overflow-auto p-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => router.push('/student')}
                            className="p-2 rounded-lg hover:bg-[var(--color-primary-bg)] transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                Course Assignments
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '2px' }}>
                                Select an assignment, then choose Submit, Grades, Rubric, or Tests
                            </p>
                        </div>
                    </div>

                    {loadingAssignments && (
                        <div className="flex items-center gap-3 py-20 justify-center" style={{ color: 'var(--color-text-mid)' }}>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading assignments…</span>
                        </div>
                    )}

                    {assignmentsError && !loadingAssignments && (
                        <div className="flex items-center gap-2 py-10 justify-center" style={{ color: '#ef4444' }}>
                            <AlertTriangle className="w-5 h-5" />
                            <span>Failed to load assignments.</span>
                        </div>
                    )}

                    {!loadingAssignments && !assignmentsError && (
                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
                            {/* Left: Assignment list */}
                            <div className="space-y-2">
                                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                    {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
                                </p>

                                {assignments.length === 0 && (
                                    <div className="text-center py-16" style={{ color: 'var(--color-text-mid)' }}>
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>No assignments yet.</p>
                                    </div>
                                )}

                                {assignments.map((a: any) => {
                                    const isActive = activeAssignmentId === a.id;
                                    const due = a.due_date ? new Date(a.due_date) : null;
                                    const isOverdue = due ? due < new Date() : false;
                                    return (
                                        <div
                                            key={a.id}
                                            onClick={() => setActiveAssignmentId(a.id)}
                                            className="p-4 rounded-xl cursor-pointer transition-all"
                                            style={{
                                                border: `2px solid ${isActive ? '#6B0000' : 'var(--color-border)'}`,
                                                backgroundColor: isActive ? '#FBF5F5' : '#fff',
                                                boxShadow: isActive ? '0 0 0 2px rgba(107,0,0,0.08)' : 'none',
                                            }}
                                        >
                                            <p style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#6B0000' : '#2D2D2D', marginBottom: '4px' }}>
                                                {a.title}
                                            </p>
                                            {due && (
                                                <div className="flex items-center gap-1">
                                                    {isOverdue
                                                        ? <AlertTriangle className="w-3 h-3" style={{ color: '#8B0000' }} />
                                                        : <Clock className="w-3 h-3" style={{ color: '#8A8A8A' }} />}
                                                    <span style={{ fontSize: '11px', color: isOverdue ? '#8B0000' : '#8A8A8A', fontWeight: isOverdue ? 600 : 400 }}>
                                                        Due {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        {isOverdue && ' · Overdue'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="mt-2">
                                                {a.is_active
                                                    ? <span style={{ display: 'inline-block', backgroundColor: '#E8F5E8', color: '#2D6A2D', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>Open</span>
                                                    : <span style={{ display: 'inline-block', backgroundColor: '#F5F5F5', color: '#595959', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>Closed</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right: Tabbed panel */}
                            {activeAssignment ? (
                                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                                    {/* Panel header */}
                                    <div className="px-6 py-4" style={{ backgroundColor: '#6B0000' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                                            {activeAssignment.title}
                                        </h3>
                                        {activeAssignment.description && (
                                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
                                                {activeAssignment.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tab bar */}
                                    <div className="flex border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: '#FAFAFA' }}>
                                        {TABS.map(({ id, label, Icon }) => (
                                            <button
                                                key={id}
                                                onClick={() => setActiveTab(id)}
                                                className="flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-colors"
                                                style={{
                                                    color: activeTab === id ? '#6B0000' : '#595959',
                                                    borderBottom: activeTab === id ? '2px solid #6B0000' : '2px solid transparent',
                                                    backgroundColor: 'transparent',
                                                    marginBottom: '-1px',
                                                }}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab content */}
                                    <div className="p-6">
                                        {activeTab === 'submit' && (
                                            <SubmitTab
                                                assignmentId={activeAssignment.id}
                                                assignmentTitle={activeAssignment.title}
                                                mySubmissions={mySubmissions}
                                                loadingSubmissions={loadingSubmissions}
                                                refetchSubmissions={refetchSubmissions}
                                            />
                                        )}
                                        {activeTab === 'grades' && (
                                            <GradesTab
                                                mySubmissions={mySubmissions}
                                                loadingSubmissions={loadingSubmissions}
                                            />
                                        )}
                                        {activeTab === 'rubric' && (
                                            <RubricTab assignmentId={activeAssignment.id} />
                                        )}
                                        {activeTab === 'tests' && (
                                            <TestsTab
                                                assignmentId={activeAssignment.id}
                                                latestSubmissionId={latestSubmission?.id}
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-xl py-20" style={{ border: '2px dashed var(--color-border)', backgroundColor: '#F9FAFB' }}>
                                    <FileText className="w-12 h-12 mb-3 opacity-20" />
                                    <p style={{ fontSize: '15px', color: 'var(--color-text-mid)' }}>
                                        Select an assignment
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </PageLayout>
    );
}
