import { useState, useMemo, useEffect } from 'react';
import {
    ChevronLeft, Calendar, Code, Users, Download, CheckCircle2, Search,
    Inbox, BarChart3, AlertTriangle, ChevronUp, ChevronDown,
    Edit, Trash2, FileText, ClipboardList, Clock, Star, BookOpen, Settings2,
    UserCheck, Loader2, Zap,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useRouter, useParams } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from './ui/dialog';

import { useAssignment } from '@/hooks/queries';
import { useSubmissions } from '@/hooks/queries/useSubmissions';
import { submissionService } from '@/services/api';

/* ─── Rubric criterion ─── */
interface RubricCriterion {
    name: string;
    description: string;
    maxPoints: number;
}

/* ─── Full assignment metadata ─── */
interface AssignmentMeta {
    name: string;
    language: string;
    dueDate: string;
    createdDate: string;
    totalStudents: number;
    totalPoints: number;
    description: string;
    instructions: string;
    allowedAttempts: number;
    latePolicy: string;
    aiDetection: boolean;
    rubric: RubricCriterion[];
    isGroupAssignment?: boolean;
}

function lookupCourseCode(id: string) {
    try { const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]'); const f = s.find((c: any) => c.id === id); if (f) return f.code; } catch { } return id;
}

interface StudentSubmission {
    id: string;
    studentName: string;
    studentId: string;
    avatarInitials: string;
    submittedAt: string | null;   // null = not submitted
    autoScore: number | null;
    finalGrade: number | null;
    maxPoints: number;
    status: 'not-submitted' | 'submitted' | 'graded' | 'needs-review';
    late: boolean;
    flagged: boolean;
}

type SortField = 'studentName' | 'submittedAt' | 'autoScore' | 'finalGrade';
type SortOrder = 'asc' | 'desc';

function scoreColor(score: number, max: number): string {
    const pct = (score / max) * 100;
    if (pct >= 90) return '#2D6A2D';
    if (pct >= 70) return '#6B0000';
    return '#8B0000';
}

export function AssignmentGrading() {
    const router = useRouter();
    const { courseId, assignmentId } = useParams() as { courseId: string; assignmentId: string };
    const [isDownloadingZip, setIsDownloadingZip] = useState(false);

    // Fetch from API
    const { data: apiAssignment, isLoading: isLoadingAssignment } = useAssignment(courseId, assignmentId);
    const { data: apiSubmissions, isLoading: isLoadingSubmissions, refetch: refetchSubmissions } = useSubmissions(assignmentId);

    // Derive assignment metadata from API data or localStorage fallback
    const meta: AssignmentMeta | undefined = useMemo(() => {
        // 1. API data (for real assignments from the database)
        if (apiAssignment) {
            return {
                name: apiAssignment.name ?? 'Untitled',
                language: apiAssignment.language ?? 'Python',
                dueDate: apiAssignment.dueDate ?? '',
                createdDate: apiAssignment.createdAt ?? new Date().toISOString().slice(0, 10),
                totalStudents: 0,
                totalPoints: apiAssignment.maxPoints ?? 100,
                description: apiAssignment.description ?? '',
                instructions: '',
                allowedAttempts: 3,
                latePolicy: apiAssignment.allowLateSubmissions
                    ? '10% deduction per day, max 3 days late'
                    : 'No late submissions',
                aiDetection: true,
                rubric: (apiAssignment.rubric ?? []).map((r: any) => ({
                    name: r.name ?? 'Criterion',
                    description: r.description ?? '',
                    maxPoints: r.maxPoints ?? 0,
                })),
                isGroupAssignment: apiAssignment.isGroup ?? false,
            } as AssignmentMeta;
        }

        // 2. localStorage fallback (for recently created assignments not yet refetched)
        try {
            const stored: any[] = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
            const found = stored.find((a: any) => a.id === assignmentId);
            if (found) {
                return {
                    name: found.name ?? 'Untitled',
                    language: found.language ?? 'Python',
                    dueDate: found.dueDate ?? '',
                    createdDate: found.createdDate ?? new Date().toISOString().slice(0, 10),
                    totalStudents: found.totalStudents ?? 42,
                    totalPoints: found.totalPoints ?? 100,
                    description: found.description ?? '',
                    instructions: found.instructions ?? '',
                    allowedAttempts: found.allowedAttempts ?? 3,
                    latePolicy: found.latePolicy ?? '10% deduction per day, max 3 days late',
                    aiDetection: found.aiDetection ?? true,
                    rubric: (found.rubric ?? [
                        { name: 'Code Correctness', description: 'Produces correct output', maxPoints: 50 },
                        { name: 'Code Style', description: 'Follows style guidelines', maxPoints: 20 },
                        { name: 'Documentation', description: 'Includes comments', maxPoints: 30 },
                    ]) as RubricCriterion[],
                    isGroupAssignment: found.isGroupAssignment ?? false,
                } as AssignmentMeta;
            }
        } catch { /* ignore */ }
        return undefined;
    }, [assignmentId, apiAssignment]);

    // Map API submissions to StudentSubmission format
    const submissions = useMemo(() => {
        if (!apiSubmissions || isLoadingSubmissions) {
            return [];
        }

        const getInitials = (name: string) =>
            name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

        // Keep only the latest submission per student
        const latestByStudent = new Map<string, any>();
        for (const sub of apiSubmissions as any[]) {
            const uid = String(sub.student?.id ?? sub.studentId ?? sub.student_id ?? '');
            const existing = latestByStudent.get(uid);
            if (!existing) {
                latestByStudent.set(uid, sub);
            } else {
                const existingTime = new Date(existing.created_at ?? existing.submittedAt ?? 0).getTime();
                const newTime = new Date(sub.created_at ?? sub.submittedAt ?? 0).getTime();
                if (newTime > existingTime) latestByStudent.set(uid, sub);
            }
        }

        return Array.from(latestByStudent.values()).map((sub: any) => {
            const studentName = sub.student?.name ?? 'Student';
            const studentIdentifier = sub.student?.student_id ?? String(sub.studentId ?? sub.student_id ?? sub.student?.id ?? '');
            const submittedAt = sub.created_at ?? sub.submittedAt ?? null;
            const score = sub.score ?? sub.grade?.totalScore ?? null;
            const maxScore = sub.max_score ?? sub.grade?.maxScore ?? meta?.totalPoints ?? 100;
            const status = sub.status === 'graded' || score != null ? 'graded' : 'submitted';

            return {
                id: String(sub.id),
                studentName,
                studentId: studentIdentifier,
                avatarInitials: getInitials(studentName),
                submittedAt,
                autoScore: score,
                finalGrade: score,
                maxPoints: maxScore,
                status,
                late: false,
                flagged: false,
            } as StudentSubmission;
        });
    }, [apiSubmissions, isLoadingSubmissions, meta]);

    const [submissionsState, setSubmissionsState] = useState<StudentSubmission[]>(submissions);
    // Update local state when API data changes
    useEffect(() => { setSubmissionsState(submissions); }, [submissions]);
    /* ─── Grade submission handler ─── */
    const handleSubmitGrade = (studentId: string, grade: number, _feedback: string) => {
        setSubmissionsState(prev => prev.map(s =>
            s.id === studentId
                ? { ...s, finalGrade: grade, status: 'graded' as const }
                : s
        ));
    };

    /* ─── Apply grade to all group members (placeholder until group API is available) ─── */
    const handleApplyGroupGrade = (_sourceStudentId: string, _grade: number) => {
        // No-op: group membership is not yet available from the API
    };

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('studentName');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [showBulkGradeDialog, setShowBulkGradeDialog] = useState(false);
    const [pageSection, setPageSection] = useState<'overview' | 'rubric' | 'submissions'>('overview');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editName, setEditName] = useState(meta?.name ?? '');
    const [editDescription, setEditDescription] = useState(meta?.description ?? '');
    const [editDueDate, setEditDueDate] = useState(meta?.dueDate ?? '');
    const [editInstructions, setEditInstructions] = useState(meta?.instructions ?? '');

    /* ── Apply-to-Group dialog state ── */
    const [showApplyGroupDialog, setShowApplyGroupDialog] = useState(false);
    const [applyGroupStudent, setApplyGroupStudent] = useState<StudentSubmission | null>(null);
    const [applyGroupGrade, setApplyGroupGrade] = useState<number | null>(null);
    const [groupGradeApplied, setGroupGradeApplied] = useState(false);

    const handleDownloadZip = async () => {
        if (!assignmentId) return;
        setIsDownloadingZip(true);
        try {
            const blob = await submissionService.downloadAssignmentZip(assignmentId);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `assignment_${assignmentId}_submissions.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to download submissions ZIP';
            window.alert(message);
        } finally {
            setIsDownloadingZip(false);
        }
    };

    /* ─── Grade All Pending handler ─── */
    const [isGradingAll, setIsGradingAll] = useState(false);
    const handleGradeAll = async () => {
        if (!assignmentId) return;
        setIsGradingAll(true);
        try {
            const result = await submissionService.gradeAllSubmissions(assignmentId);
            window.alert(`Graded ${result.total_graded} submission(s). Errors: ${result.total_errors}.`);
            refetchSubmissions();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to grade submissions';
            window.alert(message);
        } finally {
            setIsGradingAll(false);
        }
    };

    /* ─── Tab counts ─── */
    const counts = useMemo(() => {
        const all = submissionsState.length;
        const notSubmitted = submissionsState.filter(s => s.status === 'not-submitted').length;
        const submitted = submissionsState.filter(s => s.status === 'submitted').length;
        const graded = submissionsState.filter(s => s.status === 'graded').length;
        const needsReview = submissionsState.filter(s => s.status === 'needs-review').length;
        return { all, notSubmitted, submitted, graded, needsReview };
    }, [submissionsState]);

    const tabs = [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'not-submitted', label: 'Not Submitted', count: counts.notSubmitted },
        { id: 'submitted', label: 'Submitted', count: counts.submitted },
        { id: 'graded', label: 'Graded', count: counts.graded },
        { id: 'needs-review', label: 'Needs Review', count: counts.needsReview },
    ];

    /* ─── Filter ─── */
    const filtered = useMemo(() => {
        return submissionsState.filter(s => {
            if (activeTab !== 'all' && s.status !== activeTab) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return s.studentName.toLowerCase().includes(q) || s.studentId.includes(q);
            }
            return true;
        });
    }, [submissionsState, activeTab, searchQuery]);

    /* ─── Sort ─── */
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case 'studentName': cmp = a.studentName.localeCompare(b.studentName); break;
                case 'submittedAt':
                    cmp = (a.submittedAt ? new Date(a.submittedAt).getTime() : Infinity) - (b.submittedAt ? new Date(b.submittedAt).getTime() : Infinity);
                    break;
                case 'autoScore': cmp = (a.autoScore ?? -1) - (b.autoScore ?? -1); break;
                case 'finalGrade': cmp = (a.finalGrade ?? -1) - (b.finalGrade ?? -1); break;
            }
            return sortOrder === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortField, sortOrder]);

    const handleSort = (field: SortField) => {
        if (sortField === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortOrder('asc'); }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 opacity-30" />;
        return sortOrder === 'asc'
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />;
    };

    /* ─── Grading modal student list (for prev/next navigation) ─── */
    const gradableStudents = sorted.filter(s => s.status !== 'not-submitted');

    if (!courseId || !assignmentId || (!meta && !isLoadingAssignment)) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={[{ label: 'Courses', href: '/courses' }]} />
                <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
                    <div className="text-center">
                        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '16px' }}>Assignment Not Found</h2>
                        <Button onClick={() => router.back()} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>Go Back</Button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (isLoadingAssignment && !meta) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={[{ label: 'Courses', href: '/courses' }]} />
                <div className="flex items-center justify-center gap-3" style={{ minHeight: 'calc(100vh - 64px)', color: 'var(--color-text-mid)' }}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading assignment…</span>
                </div>
            </PageLayout>
        );
    }

    if (!meta) return null;

    return (
        <PageLayout>
            <TopNav breadcrumbs={[
                { label: 'Courses', href: '/courses' },
                { label: lookupCourseCode(courseId!), href: `/courses/${courseId}` },
                { label: 'Grading' },
                { label: meta.name },
            ]} />

            <div className="flex h-[calc(100vh-64px)]">
                <Sidebar activeItem="assignments" />

                <main className="flex-1 overflow-auto p-8">
                    {/* Back link */}
                    <button
                        onClick={() => router.push(`/courses/${courseId}`)}
                        className="flex items-center gap-1 mb-5 hover:underline transition-colors"
                        style={{ fontSize: '13px', color: 'var(--color-primary)' }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Assignments
                    </button>

                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#6B0000', lineHeight: '32px' }}>
                                {meta.name}
                            </h1>
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#595959', backgroundColor: '#F5F5F5', padding: '6px 12px', borderRadius: '8px' }}>
                                    <Calendar className="w-4 h-4" />
                                    Due: {new Date(meta.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#595959', backgroundColor: '#F5F5F5', padding: '6px 12px', borderRadius: '8px' }}>
                                    <Code className="w-4 h-4" />
                                    {meta.language}
                                </span>
                                <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#595959', backgroundColor: '#F5F5F5', padding: '6px 12px', borderRadius: '8px' }}>
                                    <Users className="w-4 h-4" />
                                    {submissionsState.length} Students
                                </span>
                                <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#595959', backgroundColor: '#F5F5F5', padding: '6px 12px', borderRadius: '8px' }}>
                                    <Star className="w-4 h-4" />
                                    {meta.totalPoints} Points
                                </span>
                                {meta.isGroupAssignment && (
                                    <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 600, color: '#fff', backgroundColor: '#6B0000', padding: '6px 12px', borderRadius: '8px' }}>
                                        <UserCheck className="w-4 h-4" />
                                        Group Assignment
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="border-[var(--color-border)] h-9"
                                onClick={() => {
                                    setEditName(meta.name);
                                    setEditDescription(meta.description);
                                    setEditDueDate(meta.dueDate);
                                    setEditInstructions(meta.instructions);
                                    setShowEditDialog(true);
                                }}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                className="border-red-200 text-red-700 hover:bg-red-50 h-9"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                            <Button
                                variant="outline"
                                className="border-[var(--color-border)] h-9"
                                onClick={handleDownloadZip}
                                disabled={isDownloadingZip}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isDownloadingZip ? 'Downloading...' : 'Download submissions (ZIP)'}
                            </Button>
                        </div>
                    </div>

                    {/* ── Section Tabs ── */}
                    <div className="flex items-center gap-1 mb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        {([
                            { id: 'overview' as const, label: 'Overview', icon: FileText },
                            { id: 'rubric' as const, label: 'Rubric', icon: ClipboardList },
                            { id: 'submissions' as const, label: 'Submissions', icon: Users },
                        ]).map(sec => {
                            const active = pageSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => setPageSection(sec.id)}
                                    className="flex items-center gap-2 px-5 py-3 transition-colors relative"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: active ? 600 : 400,
                                        color: active ? '#6B0000' : '#595959',
                                        borderBottom: active ? '2px solid #6B0000' : '2px solid transparent',
                                        marginBottom: '-1px',
                                    }}
                                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#6B0000'; }}
                                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#595959'; }}
                                >
                                    <sec.icon className="w-4 h-4" />
                                    {sec.label}
                                    {sec.id === 'submissions' && (
                                        <span style={{ fontSize: '11px', fontWeight: 600, backgroundColor: active ? '#6B0000' : '#E0E0E0', color: active ? '#fff' : '#595959', padding: '1px 7px', borderRadius: '10px' }}>
                                            {counts.all}
                                        </span>
                                    )}
                                    {sec.id === 'rubric' && (
                                        <span style={{ fontSize: '11px', fontWeight: 600, backgroundColor: active ? '#6B0000' : '#E0E0E0', color: active ? '#fff' : '#595959', padding: '1px 7px', borderRadius: '10px' }}>
                                            {meta.rubric.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ══════════════════ OVERVIEW SECTION ══════════════════ */}
                    {pageSection === 'overview' && (
                        <div className="space-y-6">
                            {/* Description Card */}
                            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                    <BookOpen className="w-5 h-5" style={{ color: '#6B0000' }} />
                                    Description
                                </h2>
                                <p style={{ fontSize: '14px', color: '#595959', lineHeight: '1.7' }}>{meta.description}</p>
                            </div>

                            {/* Instructions Card */}
                            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                    <FileText className="w-5 h-5" style={{ color: '#6B0000' }} />
                                    Instructions
                                </h2>
                                <div style={{ fontSize: '14px', color: '#595959', lineHeight: '1.8' }}>
                                    {meta.instructions.split('\n').map((line, i) => (
                                        <p key={i} className="mb-1">{line}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Settings + Points Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Points Breakdown */}
                                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                    <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                        <Star className="w-5 h-5" style={{ color: '#C9A84C' }} />
                                        Points Breakdown
                                    </h2>
                                    <div className="space-y-3">
                                        {meta.rubric.map((c, i) => (
                                            <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < meta.rubric.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                                <span style={{ fontSize: '14px', color: '#2D2D2D' }}>{c.name}</span>
                                                <span className="flex items-center gap-1" style={{ fontSize: '14px', fontWeight: 700, color: '#6B0000' }}>
                                                    {c.maxPoints} pts
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between pt-3" style={{ borderTop: '2px solid var(--color-border)' }}>
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#2D2D2D' }}>Total</span>
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#6B0000' }}>{meta.totalPoints} pts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Assignment Settings */}
                                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                    <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                        <Settings2 className="w-5 h-5" style={{ color: '#6B0000' }} />
                                        Settings
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Language', value: meta.language, icon: Code },
                                            { label: 'Due Date', value: new Date(meta.dueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), icon: Calendar },
                                            { label: 'Created', value: new Date(meta.createdDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: Clock },
                                            { label: 'Allowed Attempts', value: `${meta.allowedAttempts}`, icon: FileText },
                                            { label: 'Late Policy', value: meta.latePolicy, icon: AlertTriangle },
                                            { label: 'AI Detection', value: meta.aiDetection ? 'Enabled' : 'Disabled', icon: BarChart3 },
                                            { label: 'Group Assignment', value: meta.isGroupAssignment ? 'Yes — grades can be applied to group' : 'No', icon: Users },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#8A8A8A' }} />
                                                <div>
                                                    <p style={{ fontSize: '12px', fontWeight: 500, color: '#8A8A8A', marginBottom: '2px' }}>{item.label}</p>
                                                    <p style={{ fontSize: '14px', color: '#2D2D2D' }}>{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════ RUBRIC SECTION ══════════════════ */}
                    {pageSection === 'rubric' && (
                        <div className="space-y-6">
                            {/* Rubric Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>Grading Rubric</h2>
                                    <p style={{ fontSize: '13px', color: '#595959', marginTop: '4px' }}>
                                        {meta.rubric.length} criteria • {meta.totalPoints} total points
                                    </p>
                                </div>
                            </div>

                            {/* Rubric Criteria Cards */}
                            <div className="space-y-4">
                                {meta.rubric.map((criterion, i) => {
                                    const pct = Math.round((criterion.maxPoints / meta.totalPoints) * 100);
                                    return (
                                        <div key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: 'var(--color-primary-bg)', color: '#6B0000', fontSize: '13px', fontWeight: 700 }}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2D2D2D' }}>{criterion.name}</h3>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span style={{ fontSize: '12px', color: '#8A8A8A' }}>{pct}% weight</span>
                                                    <span className="flex items-center justify-center px-3 py-1 rounded-full" style={{ backgroundColor: '#F5EDED', color: '#6B0000', fontSize: '14px', fontWeight: 700, minWidth: '60px', textAlign: 'center' }}>
                                                        {criterion.maxPoints} pts
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="px-6 py-4">
                                                <p style={{ fontSize: '14px', color: '#595959', lineHeight: '1.6' }}>{criterion.description}</p>
                                                {/* Progress indicator for weight */}
                                                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F0F0F0' }}>
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${pct}%`, backgroundColor: '#6B0000', transition: 'width 0.3s ease' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total Points Summary */}
                            <div className="rounded-lg p-6" style={{ backgroundColor: '#F5EDED', border: '2px solid #6B0000' }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-6 h-6" style={{ color: '#C9A84C' }} />
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#2D2D2D' }}>Total Points</span>
                                    </div>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#6B0000' }}>{meta.totalPoints}</span>
                                </div>
                                <div className="mt-3 flex items-center gap-4 flex-wrap">
                                    {meta.rubric.map((c, i) => (
                                        <span key={i} style={{ fontSize: '12px', color: '#595959' }}>
                                            {c.name}: <strong style={{ color: '#6B0000' }}>{c.maxPoints}</strong>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════ SUBMISSIONS SECTION ══════════════════ */}
                    {pageSection === 'submissions' && (
                        <>
                            {/* Top bar: Grade All + filter tabs */}
                            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {tabs.map(tab => {
                                        const active = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className="transition-colors"
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    fontSize: '13px',
                                                    fontWeight: active ? 600 : 400,
                                                    backgroundColor: active ? '#6B0000' : 'transparent',
                                                    color: active ? '#fff' : '#595959',
                                                }}
                                                onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = '#F5EDED'; }}
                                                onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                {tab.label}
                                                {tab.count > 0 && (
                                                    <span
                                                        style={{
                                                            marginLeft: '6px',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            backgroundColor: active ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
                                                            color: active ? '#fff' : '#595959',
                                                            padding: '1px 7px',
                                                            borderRadius: '10px',
                                                        }}
                                                    >
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <Button
                                    className="text-white h-9"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                    onClick={() => setShowBulkGradeDialog(true)}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Grade All
                                </Button>
                            </div>

                            {/* Search */}
                            <div className="mb-5">
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                                    <Input
                                        placeholder="Search students by name or ID..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-10 border-[var(--color-border)]"
                                    />
                                </div>
                            </div>

                            {/* Submissions Table or Empty States */}
                            {sorted.length === 0 && counts.all === 0 ? (
                                <div className="text-center py-20">
                                    <Inbox className="w-16 h-16 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
                                    <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>No Submissions Yet</p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                                        Students haven't submitted their work yet. Check back after the due date or send a reminder.
                                    </p>
                                </div>
                            ) : counts.graded === counts.all && activeTab === 'graded' ? (
                                <div className="text-center py-20">
                                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#2D6A2D' }} />
                                    <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>All Submissions Graded!</p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '24px' }}>
                                        Great work! All submissions for this assignment have been graded.
                                    </p>
                                    <Button variant="outline" className="border-[var(--color-border)]" onClick={() => router.push(`/courses/${courseId}/reports`)}>
                                        <BarChart3 className="w-4 h-4 mr-2" /> View Reports
                                    </Button>
                                </div>
                            ) : sorted.length === 0 ? (
                                <div className="text-center py-16">
                                    <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-mid)', marginBottom: '8px' }}>No students match this filter.</p>
                                    <button onClick={() => { setActiveTab('all'); setSearchQuery(''); }} className="hover:underline" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>Clear filters</button>
                                </div>
                            ) : (
                                <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                    <table className="w-full">
                                        <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
                                            <tr>
                                                <th className="text-left px-6 py-4">
                                                    <button onClick={() => handleSort('studentName')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Student Name <SortIcon field="studentName" />
                                                    </button>
                                                </th>
                                                <th className="text-left px-5 py-4 hidden md:table-cell" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Student ID</th>
                                                <th className="text-left px-5 py-4">
                                                    <button onClick={() => handleSort('submittedAt')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Submitted <SortIcon field="submittedAt" />
                                                    </button>
                                                </th>
                                                <th className="text-left px-5 py-4">
                                                    <button onClick={() => handleSort('autoScore')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Auto Score <SortIcon field="autoScore" />
                                                    </button>
                                                </th>
                                                <th className="text-left px-5 py-4">
                                                    <button onClick={() => handleSort('finalGrade')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Grade <SortIcon field="finalGrade" />
                                                    </button>
                                                </th>
                                                <th className="text-left px-5 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sorted.map((sub) => {
                                                const rowFlagged = sub.flagged;
                                                return (
                                                    <tr
                                                        key={sub.id}
                                                        className="border-b transition-colors"
                                                        style={{
                                                            borderColor: 'var(--color-border)',
                                                            borderLeft: rowFlagged ? '4px solid #FF6B00' : '4px solid transparent',
                                                            backgroundColor: rowFlagged ? '#FFF9F5' : undefined,
                                                            cursor: sub.status !== 'not-submitted' ? 'pointer' : 'default',
                                                            opacity: sub.status === 'graded' ? 0.85 : 1,
                                                        }}
                                                        onMouseEnter={(e) => { if (sub.status !== 'not-submitted') e.currentTarget.style.backgroundColor = rowFlagged ? '#FFF0E6' : '#F5EDED'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = rowFlagged ? '#FFF9F5' : ''; }}
                                                        onClick={() => {
                                                            if (sub.status === 'not-submitted') return;
                                                            router.push(`/courses/${courseId}/submissions/${sub.id}/grade`);
                                                        }}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                                                                    {sub.avatarInitials}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        {rowFlagged && <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF6B00' }} />}
                                                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>{sub.studentName}</span>
                                                                    </div>
                                                                    {meta.isGroupAssignment && (
                                                                        <span style={{ fontSize: '11px', color: '#6B0000', fontWeight: 500 }}>
                                                                            Group Assignment
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 hidden md:table-cell" style={{ fontSize: '13px', color: '#595959' }}>{sub.studentId}</td>
                                                        <td className="px-5 py-4">
                                                            {sub.submittedAt ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span style={{ fontSize: '13px', color: sub.late ? '#8B0000' : '#595959' }}>
                                                                        {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                                                                        {new Date(sub.submittedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                                    </span>
                                                                    {sub.late && (
                                                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', backgroundColor: '#8B0000', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Late</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span style={{ fontSize: '13px', color: '#8A8A8A' }}>Not Yet</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {sub.autoScore !== null ? (
                                                                <span style={{ fontSize: '14px', fontWeight: 600, color: scoreColor(sub.autoScore, sub.maxPoints) }}>{sub.autoScore} / {sub.maxPoints}</span>
                                                            ) : (
                                                                <span style={{ fontSize: '14px', color: '#8A8A8A' }}>—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {sub.finalGrade !== null ? (
                                                                <div className="flex items-center gap-1.5">
                                                                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#2D6A2D' }} />
                                                                    <span style={{ fontSize: '14px', fontWeight: 700, color: scoreColor(sub.finalGrade, sub.maxPoints) }}>{sub.finalGrade} / {sub.maxPoints}</span>
                                                                </div>
                                                            ) : (
                                                                <span style={{ fontSize: '14px', color: '#8A8A8A' }}>—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4" onClick={e => e.stopPropagation()} style={{ cursor: 'default' }}>
                                                            {sub.status === 'not-submitted' ? (
                                                                <button disabled style={{ fontSize: '13px', color: '#8A8A8A', padding: '6px 16px', height: '32px' }}>—</button>
                                                            ) : sub.status === 'graded' ? (
                                                                <Button variant="outline" className="border-[var(--color-border)] h-8 px-4 text-xs" onClick={() => router.push(`/courses/${courseId}/submissions/${sub.id}/grade`)}>View</Button>
                                                            ) : (
                                                                <Button className="text-white h-8 px-4 text-xs" style={{ backgroundColor: '#6B0000' }} onClick={() => router.push(`/courses/${courseId}/submissions/${sub.id}/grade`)}>Grade</Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Bulk Grade All Dialog */}
            <Dialog open={showBulkGradeDialog} onOpenChange={setShowBulkGradeDialog}>
                <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            Apply Auto-Scores as Final Grades
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                            This will use automated test scores as final grades for all ungraded submissions. Manual review is recommended for accuracy.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#FFF8E1' }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#8A5700' }} />
                        <p style={{ fontSize: '12px', color: '#8A5700' }}>
                            {counts.submitted + counts.needsReview} ungraded submission(s) will receive their auto-score as the final grade.
                        </p>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowBulkGradeDialog(false)} className="border-[var(--color-border)]">Cancel</Button>
                        <Button onClick={() => setShowBulkGradeDialog(false)} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Apply Grades
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#B91C1C' }}>
                            Delete Assignment
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                            Are you sure you want to delete <strong style={{ color: '#2D2D2D' }}>{meta.name}</strong>? This will permanently remove the assignment and all {counts.all} student submissions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#FEF2F2' }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B91C1C' }} />
                        <p style={{ fontSize: '12px', color: '#B91C1C' }}>
                            This action cannot be undone. All grades, submissions, and feedback will be lost.
                        </p>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="border-[var(--color-border)]">Cancel</Button>
                        <Button
                            onClick={() => { setShowDeleteDialog(false); router.push(`/courses/${courseId}`); }}
                            className="text-white"
                            style={{ backgroundColor: '#B91C1C' }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Assignment Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            Edit Assignment
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
                            Update the assignment details below. Changes will be reflected for all students.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 mt-4">
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Assignment Name</label>
                            <Input value={editName} onChange={e => setEditName(e.target.value)} className="border-[var(--color-border)]" />
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Description</label>
                            <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="border-[var(--color-border)] min-h-[100px]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Due Date</label>
                                <Input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} className="border-[var(--color-border)]" />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Total Points</label>
                                <Input type="number" value={meta.totalPoints} readOnly className="border-[var(--color-border)] bg-gray-50" />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Instructions</label>
                            <Textarea value={editInstructions} onChange={e => setEditInstructions(e.target.value)} className="border-[var(--color-border)] min-h-[120px]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Allowed Attempts</label>
                                <Input type="number" value={meta.allowedAttempts} readOnly className="border-[var(--color-border)] bg-gray-50" />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Language</label>
                                <Input value={meta.language} readOnly className="border-[var(--color-border)] bg-gray-50" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-[var(--color-border)]">Cancel</Button>
                        <Button onClick={() => setShowEditDialog(false)} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Apply Grade to Group Dialog */}
            <Dialog open={showApplyGroupDialog} onOpenChange={setShowApplyGroupDialog}>
                <DialogContent className="max-w-lg" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            <UserCheck className="w-5 h-5" style={{ color: '#2D6A2D' }} />
                            Apply Grade to Group Members
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                            Apply the same grade from <strong style={{ color: '#2D2D2D' }}>{applyGroupStudent?.studentName}</strong> to all other members of the group.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Grade to apply */}
                    <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: '#F5EDED' }}>
                        <div className="flex items-center justify-between">
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#2D2D2D' }}>Grade to Apply</span>
                            <span style={{ fontSize: '22px', fontWeight: 700, color: '#6B0000' }}>
                                {applyGroupGrade ?? '—'} / {meta.totalPoints}
                            </span>
                        </div>
                    </div>

                    {/* Members who will receive the grade */}
                    <div className="mt-3">
                        <p style={{ fontSize: '13px', fontWeight: 500, color: '#8A8A8A' }}>
                            Group membership data is not yet available from the API.
                        </p>
                    </div>

                    {groupGradeApplied && (
                        <div className="mt-3 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#F0FDF4' }}>
                            <CheckCircle2 className="w-4 h-4" style={{ color: '#2D6A2D' }} />
                            <p style={{ fontSize: '13px', color: '#2D6A2D', fontWeight: 500 }}>Grade applied to all group members!</p>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => { setShowApplyGroupDialog(false); setGroupGradeApplied(false); }} className="border-[var(--color-border)]">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (applyGroupStudent && applyGroupGrade !== null) {
                                    handleApplyGroupGrade(applyGroupStudent.id, applyGroupGrade);
                                }
                                setGroupGradeApplied(true);
                                setTimeout(() => {
                                    setShowApplyGroupDialog(false);
                                    setGroupGradeApplied(false);
                                }, 1500);
                            }}
                            className="text-white"
                            style={{ backgroundColor: '#2D6A2D' }}
                            disabled={groupGradeApplied}
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            {groupGradeApplied ? 'Applied!' : 'Apply to All Members'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}
