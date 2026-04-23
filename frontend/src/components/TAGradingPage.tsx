'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/utils/ThemeContext';
import { codeRequiresStdin } from '@/utils/codeInputDetection';
import {
    buildResolvedWeightedCriteria,
    formatPointValue,
    toCriterionKey,
    toWeightPercent,
} from '@/lib/weightedRubricScoring';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import {
    useTASubmissionDetail,
    useTAGradeSubmission,
    useTACoursePermissions,
    useTACourseSubmissions,
    useTARunTests,
    useTAAutoGrade,
} from '@/hooks/queries/useTADashboard';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    Send,
    Loader2,
    ChevronDown,
    ChevronRight,
    AlertTriangle,
    User,
    Calendar,
    Hash,
    FileText,
    Play,
    Zap,
    Plus,
    Upload,
} from 'lucide-react';

interface TAGradingPageProps {
    courseId: string;
    submissionId: string;
}

interface EditorReviewFile {
    id: string;
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

type TARubricCriterionView = {
    id: number;
    name: string;
    description: string | null;
    weight: number | null;
    max_points: number | null;
    order?: number | null;
    section_name?: string;
    section_weight?: number | null;
};

type TARubricSectionView = {
    id: number | string;
    name: string;
    description: string | null;
    weight: number | null;
    criteria: TARubricCriterionView[];
};

type TASubmissionRubricItem = {
    id: number;
    name: string;
    description: string | null;
    weight: number | null;
    max_points: number | null;
    order: number | null;
    criteria?: Array<{
        id: number;
        name: string;
        description: string | null;
        weight: number | null;
        max_points: number | null;
        order?: number | null;
    }>;
};

function normalizeTARubricSections(rubrics: TASubmissionRubricItem[]): TARubricSectionView[] {
    if (rubrics.length === 0) return [];
    const hasSections = rubrics.some((rubric) => Array.isArray(rubric.criteria));

    if (hasSections) {
        return rubrics.map((section) => ({
            id: section.id,
            name: section.name,
            description: section.description,
            weight: section.weight,
            criteria: (section.criteria ?? []).map((criterion) => ({
                id: criterion.id,
                name: criterion.name,
                description: criterion.description,
                weight: criterion.weight,
                max_points: criterion.max_points,
                order: criterion.order ?? null,
            })),
        }));
    }

    return [
        {
            id: 'section-rubric',
            name: 'Rubric Criteria',
            description: null,
            weight: 100,
            criteria: rubrics.map((criterion) => ({
                id: criterion.id,
                name: criterion.name,
                description: criterion.description,
                weight: criterion.weight,
                max_points: criterion.max_points,
                order: criterion.order,
            })),
        },
    ];
}

export default function TAGradingPage({ courseId, submissionId }: Readonly<TAGradingPageProps>) {
    const router = useRouter();
    const { isDark } = useTheme();
    const courseIdNum = Number.parseInt(courseId);
    const submissionIdNum = Number.parseInt(submissionId);

    const { data: permissions } = useTACoursePermissions(courseIdNum);
    const { data: detail, isLoading, error } = useTASubmissionDetail(courseIdNum, submissionIdNum);
    const { data: assignmentSubmissionsData } = useTACourseSubmissions(
        courseIdNum,
        detail?.assignment?.id ? { assignment_id: detail.assignment.id, limit: 200 } : { limit: 200 }
    );
    const gradeMutation = useTAGradeSubmission(courseIdNum);
    const runTestsMutation = useTARunTests(courseIdNum);
    const autoGradeMutation = useTAAutoGrade(courseIdNum);

    // Code execution hook (for ad-hoc run)
    const { execute, compile, isRunning: isExecutingCode, result: execResult, error: execError, lastStdinInput } = useCodeExecution();

    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [editorFiles, setEditorFiles] = useState<EditorReviewFile[]>([]);
    const editorFilesRef = useRef<EditorReviewFile[]>([]);
    const [score, setScore] = useState<string>('');
    const [maxScore, setMaxScore] = useState<string>('');
    const [feedback, setFeedback] = useState('');
    const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());

    // UI Layout state
    const [showInfoPanel, setShowInfoPanel] = useState(true);
    const [infoPanelWidth, setInfoPanelWidth] = useState(360);
    const [outputOpen, setOutputOpen] = useState(false);
    const [outputPanelHeight, setOutputPanelHeight] = useState(280);
    const [infoTab, setInfoTab] = useState<'desc' | 'tests' | 'grading'>('grading');
    const [stdinValue, setStdinValue] = useState('');
    const [showInlineInput, setShowInlineInput] = useState(false);

    const [runTestsResult, setRunTestsResult] = useState<{
        total_testcases: number;
        passed_testcases: number;
        total_points: number;
        earned_points: number;
        score_percentage: number;
        results: Array<{
            id: number;
            testcase_id: number | null;
            testcase_name: string | null;
            is_public?: boolean | null;
            input_data?: string | null;
            expected_output?: string | null;
            passed: boolean;
            output: string | null;
            error_output: string | null;
            points_awarded: number | null;
            execution_time_ms: number | null;
        }>;
    } | null>(null);
    const [autoGradeResult, setAutoGradeResult] = useState<{
        score: number | null;
        max_score: number | null;
        feedback: string | null;
        percentage: number;
        message: string;
        rubric_results?: {
            evaluations?: Array<{
                rubric_id?: number;
                criterion_id?: number;
                earned_points?: number | null;
                max_points?: number;
                grade?: number;
                points_awarded?: number;
                feedback?: string;
            }>;
            earned_points?: number;
            total_points?: number;
            has_test_rubric?: boolean;
        } | null;
    } | null>(null);

    // Per-criterion grading state. Keys are criterion ids; values are strings
    // so the inputs remain controlled while the TA is typing (empty vs "0").
    const [criterionScores, setCriterionScores] = useState<Record<number, string>>({});
    // Tracks whether the TA has manually edited the Score / Max Points fields.
    // While false we keep those fields in sync with the per-criterion totals.
    const [scoreOverridden, setScoreOverridden] = useState(false);
    const [maxScoreOverridden, setMaxScoreOverridden] = useState(false);

    // Populate form when detail loads
    useEffect(() => {
        if (detail) {
            setScore(detail.score?.toString() || '');
            setMaxScore(detail.max_score?.toString() || '');
            setFeedback(detail.feedback || '');
            // Treat persisted score/max as manual overrides so our rubric
            // auto-compute doesn't clobber values the instructor already saved.
            setScoreOverridden(detail.score != null);
            setMaxScoreOverridden(detail.max_score != null);
            // Seed per-criterion scores from any previously saved draft so a TA
            // coming back to a partially-graded submission sees their work.
            const seeded: Record<number, string> = {};
            for (const rs of (detail.rubric_scores ?? [])) {
                if (rs?.rubric_id != null && rs.score_awarded != null) {
                    seeded[rs.rubric_id] = String(rs.score_awarded);
                }
            }
            setCriterionScores(seeded);
        }
    }, [detail]);

    useEffect(() => {
        if (!detail) return;
        const defaultLanguage = (
            detail.assignment.allowed_languages?.split(',')[0]
            || 'python'
        ).toLowerCase();
        const seededFiles = (detail.files ?? []).map((file: any, idx: number) => ({
            id: file?.id != null ? `submission-${file.id}` : `submission-${idx}`,
            name: file?.filename ?? `file-${idx + 1}${LANGUAGE_EXTENSION_MAP[defaultLanguage] ?? '.txt'}`,
            content: file?.content ?? '',
            savedContent: file?.content ?? '',
        }));
        if (seededFiles.length === 0) {
            seededFiles.push({
                id: 'submission-empty',
                name: `solution${LANGUAGE_EXTENSION_MAP[defaultLanguage] ?? '.txt'}`,
                content: '',
                savedContent: '',
            });
        }
        setEditorFiles(seededFiles);
        setActiveFileIndex(0);
    }, [detail?.id, detail?.assignment?.allowed_languages]);

    useEffect(() => {
        editorFilesRef.current = editorFiles;
    }, [editorFiles]);

    const toggleTest = (testId: number) => {
        setExpandedTests((prev) => {
            const next = new Set(prev);
            if (next.has(testId)) next.delete(testId);
            else next.add(testId);
            return next;
        });
    };

    const sortedSubmissionIds = (assignmentSubmissionsData?.submissions ?? [])
        .slice()
        .sort(
            (a, b) =>
                new Date(b.created_at ?? 0).getTime() -
                new Date(a.created_at ?? 0).getTime()
        );
    const currentSubmissionIndex = sortedSubmissionIds.findIndex((s) => s.id === submissionIdNum);
    const nextSubmissionId =
        currentSubmissionIndex >= 0 && currentSubmissionIndex < sortedSubmissionIds.length - 1
            ? sortedSubmissionIds[currentSubmissionIndex + 1].id
            : null;

    const handleSaveDraft = (moveToNext: boolean = false) => {
        const feedbackToSave = feedback.trim() || 'Reviewed by TA.';

        // Serialize per-criterion scores for the backend. We only send rows
        // that the TA actually touched so empty criteria don't reset to zero.
        const rubricBreakdown: Array<{ rubric_id: number; score_awarded: number }> = [];
        for (const section of rubricSections) {
            for (const criterion of (section.criteria || [])) {
                const cid = Number(criterion.id);
                if (!Number.isFinite(cid) || cid <= 0) continue;
                const raw = criterionScores[cid];
                if (raw === undefined || raw === '') continue;
                const parsed = Number(raw);
                if (!Number.isFinite(parsed)) continue;
                const critMax = isWeightedRubric ? 5 : (criterion.max_points || 0);
                const clamped = critMax > 0
                    ? Math.max(0, Math.min(parsed, critMax))
                    : Math.max(0, parsed);
                rubricBreakdown.push({ rubric_id: cid, score_awarded: clamped });
            }
        }

        gradeMutation.mutate(
            {
                submissionId: submissionIdNum,
                payload: {
                    score: score ? Number.parseFloat(score) : undefined,
                    max_score: maxScore ? Number.parseFloat(maxScore) : undefined,
                    feedback: feedbackToSave,
                    is_draft: true,
                    rubric_breakdown: rubricBreakdown.length > 0 ? rubricBreakdown : undefined,
                },
            },
            {
                onSuccess: () => {
                    if (moveToNext && nextSubmissionId) {
                        router.push(`/ta/courses/${courseId}/submissions/${nextSubmissionId}/grade`);
                    }
                },
            }
        );
    };

    const handleAutoGrade = useCallback((silent: boolean = false) => {
        if (!silent) {
            setAutoGradeResult(null);
            setInfoTab('grading');
        }
        autoGradeMutation.mutate(submissionIdNum, {
            onSuccess: (data) => {
                setAutoGradeResult(data);
                // Populate the grading form with auto-grade results
                if (data.score != null) setScore(data.score.toString());
                if (data.max_score != null) setMaxScore(data.max_score.toString());
                if (data.feedback) setFeedback(data.feedback);
                // Seed per-criterion inputs from the auto-graded evaluations
                // so the TA can tweak individual rows instead of retyping them.
                const evals = data.rubric_results?.evaluations ?? [];
                if (evals.length > 0) {
                    setCriterionScores((prev) => {
                        const next = { ...prev };
                        for (const ev of evals) {
                            const cid = (ev as any).criterion_id ?? (ev as any).rubric_id;
                            if (cid != null && ev.earned_points != null) {
                                next[cid] = String(ev.earned_points);
                            }
                        }
                        return next;
                    });
                }
                // Also update test results display
                if (data.stored_results) {
                    setRunTestsResult({
                        total_testcases: data.stored_results.length,
                        passed_testcases: data.stored_results.filter((r: { passed: boolean }) => r.passed).length,
                        total_points: 0,
                        earned_points: 0,
                        score_percentage: data.percentage,
                        results: data.stored_results,
                    });
                }
            },
        });
    }, [submissionIdNum, autoGradeMutation]);

    const handleRunTests = () => {
        setRunTestsResult(null);
        setInfoTab('tests');
        runTestsMutation.mutate(submissionIdNum, {
            onSuccess: (data) => {
                setRunTestsResult(data);
            },
        });
    };

    const breadcrumbs = [
        { label: 'Submissions', href: `/ta/courses/${courseId}/submissions` },
        { label: `Grading #${submissionId}` },
    ];

    // NOTE: Rubric-derived values and their memoized lookups must live above the
    // isLoading / error early-returns below. Otherwise the useMemo hooks below
    // would be skipped on the first (loading) render and appear on the next
    // render, which violates the Rules of Hooks and triggers a console error.
    const sectionWeightPercent = (weight?: number | null) => toWeightPercent(weight, 100);
    const criterionWeightPercent = (weight?: number | null) => toWeightPercent(weight, 0);

    const rubricSections = normalizeTARubricSections(detail?.rubrics ?? []);
    const rubrics = rubricSections.flatMap((section) =>
        section.criteria.map((criterion) => ({
            ...criterion,
            section_name: section.name,
            section_weight: section.weight,
        }))
    );
    const inferredWeightedRubric = rubricSections.some(
        (section) =>
            Math.abs(sectionWeightPercent(section.weight) - 100) > 0.0001 ||
            section.criteria.some((criterion) => Math.abs((criterionWeightPercent(criterion.weight) || 0) - 100) > 0.0001)
    );
    const isWeightedRubric = detail?.assignment?.rubric_mode === 'weighted' || inferredWeightedRubric;
    const resolvedWeightedCriteria = useMemo(() => {
        if (!isWeightedRubric) return [];
        return buildResolvedWeightedCriteria(rubricSections as any[]);
    }, [isWeightedRubric, rubricSections]);
    const weightedByKey = useMemo(
        () => new Map(resolvedWeightedCriteria.map((row) => [row.key, row.effectiveWeightPercent])),
        [resolvedWeightedCriteria],
    );

    // Running totals from the per-criterion inputs. For weighted rubrics each
    // criterion maxes out at 5 (the shared tier scale) and the weighted total
    // gets scaled back up to assignment.max_points, matching the backend.
    const rubricTotals = useMemo(() => {
        let earned = 0;
        let max = 0;
        for (const section of rubricSections) {
            for (const criterion of (section.criteria || [])) {
                const critMax = isWeightedRubric ? 5 : (criterion.max_points || 0);
                max += critMax;
                const raw = criterionScores[Number(criterion.id)];
                const parsed = raw === undefined || raw === '' ? NaN : Number(raw);
                if (Number.isFinite(parsed)) {
                    earned += Math.max(0, Math.min(parsed, critMax));
                }
            }
        }
        const hasAnyInput = Object.values(criterionScores).some((v) => v !== '' && v !== undefined);
        return { earned, max, hasAnyInput };
    }, [rubricSections, isWeightedRubric, criterionScores]);

    // Assignment-level earned / max derived from the rubric totals. For weighted
    // rubrics we scale by assignment.max_points so the student-facing grade
    // reflects the weighted composition, not raw tier points.
    const derivedAssignmentGrade = useMemo(() => {
        const assignmentMax = Number(detail?.assignment?.max_points ?? 0);
        if (!rubricTotals.hasAnyInput) return null;
        if (rubricTotals.max <= 0) return null;
        if (isWeightedRubric && assignmentMax > 0) {
            const pct = rubricTotals.earned / rubricTotals.max;
            return { earned: Number((pct * assignmentMax).toFixed(2)), max: assignmentMax };
        }
        return { earned: rubricTotals.earned, max: rubricTotals.max };
    }, [rubricTotals, isWeightedRubric, detail?.assignment?.max_points]);

    // Keep Score / Max Points in sync with the rubric total unless the TA has
    // explicitly overridden them. Placed after derivedAssignmentGrade is
    // defined so the effect's dep array doesn't hit a TDZ during render.
    useEffect(() => {
        if (!derivedAssignmentGrade) return;
        if (!scoreOverridden) {
            const next = String(derivedAssignmentGrade.earned);
            setScore((prev) => (prev === next ? prev : next));
        }
        if (!maxScoreOverridden) {
            const next = String(derivedAssignmentGrade.max);
            setMaxScore((prev) => (prev === next ? prev : next));
        }
    }, [derivedAssignmentGrade, scoreOverridden, maxScoreOverridden]);

    // Derived values needed by the useCallback hooks below. Kept above the
    // early-returns so the hook order stays stable across renders.
    const language = (
        detail?.assignment?.allowed_languages?.split(',')[0]
        || 'python'
    ).toLowerCase();
    const supportsCompileCheck = language === 'python' || language === 'java';
    const compileButtonLabel = language === 'java' ? 'Compile' : 'Check Syntax';

    const saveEditorFilesNow = useCallback((): EditorReviewFile[] => {
        const currentFiles = editorFilesRef.current;
        if (currentFiles.length === 0) return [];

        const savedSnapshot = currentFiles.map((file) => ({ ...file, savedContent: file.content }));
        editorFilesRef.current = savedSnapshot;
        setEditorFiles(savedSnapshot);
        return savedSnapshot;
    }, []);

    const buildExecutionScope = useCallback((filesSnapshot?: EditorReviewFile[]) => {
        const scopedFiles = filesSnapshot ?? editorFilesRef.current;
        const defaultFileName = `solution${LANGUAGE_EXTENSION_MAP[language] ?? '.txt'}`;
        const entryFile = scopedFiles[activeFileIndex]?.name ?? defaultFileName;
        return {
            assignmentId: detail?.assignment?.id,
            entryFilename: entryFile,
            files: scopedFiles.map((file) => ({ name: file.name, content: file.content })),
        };
    }, [activeFileIndex, detail?.assignment?.id, language]);

    const resolveExecutionCode = useCallback((filesSnapshot: EditorReviewFile[], entryFilename?: string) => {
        if (filesSnapshot.length === 0) {
            return editorFilesRef.current[activeFileIndex]?.content ?? '';
        }
        const entryFile = entryFilename
            ? filesSnapshot.find((file) => file.name === entryFilename)
            : undefined;
        return entryFile?.content ?? filesSnapshot[activeFileIndex]?.content ?? '';
    }, [activeFileIndex]);

    const handleUploadSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const content = (ev.target?.result as string) ?? '';
                setEditorFiles((prev) => {
                    const existing = prev.findIndex((entry) => entry.name === file.name);
                    if (existing >= 0) {
                        const next = [...prev];
                        next[existing] = {
                            ...next[existing],
                            content,
                            savedContent: content,
                        };
                        setActiveFileIndex(existing);
                        return next;
                    }
                    const next = [
                        ...prev,
                        {
                            id: `upload-${Date.now()}-${prev.length}`,
                            name: file.name,
                            content,
                            savedContent: content,
                        },
                    ];
                    setActiveFileIndex(next.length - 1);
                    return next;
                });
            };
            reader.readAsText(file);
        });
        e.target.value = '';
    }, []);

    if (isLoading) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={[{ label: 'TA Dashboard', href: '/ta' }, ...breadcrumbs]} />
                <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            </PageLayout>
        );
    }

    if (error || !detail) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={[{ label: 'TA Dashboard', href: '/ta' }, ...breadcrumbs]} />
                <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-error)' }} />
                        <p style={{ fontSize: '16px', color: 'var(--color-text-dark)' }}>Could not load submission</p>
                        <button
                            onClick={() => router.back()}
                            className="mt-4 px-4 py-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '14px' }}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const getCriterionEffectiveWeight = (section: any, criterion: any, sectionIdx: number, critIdx: number) => {
        const key = toCriterionKey(section, criterion, sectionIdx, critIdx);
        return weightedByKey.get(key) ?? 0;
    };

    const getSectionFallbackPoints = (section: any) => {
        const assignmentMaxPoints = detail.assignment?.max_points ?? 0;
        if (assignmentMaxPoints <= 0) return null;
        if (rubricSections.length === 1) return assignmentMaxPoints;
        if (isWeightedRubric) return Math.round((assignmentMaxPoints * sectionWeightPercent(section.weight)) / 100);
        return null;
    };
    const activeFile = editorFiles[activeFileIndex];
    const code = activeFile?.content || '';

    const handleRunCode = async () => {
        setOutputOpen(true);
        const savedSnapshot = saveEditorFilesNow();
        const executionScope = buildExecutionScope(savedSnapshot);
        const executionCode = resolveExecutionCode(savedSnapshot, executionScope.entryFilename);
        if (codeRequiresStdin(executionCode, language)) {
            if (!showInlineInput) {
                setShowInlineInput(true);
                return;
            }
            await execute(executionCode, language, stdinValue, executionScope);
            return;
        }
        setShowInlineInput(false);
        await execute(executionCode, language, '', executionScope);
    };

    const handleCompileCode = async () => {
        if (!supportsCompileCheck) return;
        setOutputOpen(true);
        setShowInlineInput(false);
        const savedSnapshot = saveEditorFilesNow();
        const executionScope = buildExecutionScope(savedSnapshot);
        const executionCode = resolveExecutionCode(savedSnapshot, executionScope.entryFilename);
        await compile(executionCode, language, executionScope);
    };

    const handleOpenInlineInput = () => {
        setOutputOpen(true);
        setShowInlineInput(true);
    };

    const handleRunWithStdin = async () => {
        setOutputOpen(true);
        setShowInlineInput(true);
        const savedSnapshot = saveEditorFilesNow();
        const executionScope = buildExecutionScope(savedSnapshot);
        const executionCode = resolveExecutionCode(savedSnapshot, executionScope.entryFilename);
        await execute(executionCode, language, stdinValue, executionScope);
    };

    const setCode = (value: string) => {
        setEditorFiles((prev) => {
            const next = prev.map((file, idx) => (idx === activeFileIndex ? { ...file, content: value } : file));
            editorFilesRef.current = next;
            return next;
        });
    };

    const handleAddFile = () => {
        const extension = LANGUAGE_EXTENSION_MAP[language] ?? '.txt';
        const suggestedName = `scratch-${editorFiles.length + 1}${extension}`;
        const inputName = window.prompt('Enter new file name', suggestedName);
        if (!inputName) return;
        const nextName = inputName.trim();
        if (!nextName) return;
        const existing = editorFiles.findIndex((file) => file.name === nextName);
        if (existing >= 0) {
            setActiveFileIndex(existing);
            return;
        }
        setEditorFiles((prev) => [
            ...prev,
            {
                id: `local-${Date.now()}-${prev.length}`,
                name: nextName,
                content: '',
                savedContent: '',
            },
        ]);
        setActiveFileIndex(editorFiles.length);
    };

    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'TA Dashboard', href: '/ta' }, ...breadcrumbs]} />

            <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
                <div className="flex flex-1 overflow-hidden relative">

                    {/* ── CENTER: Editor ── */}
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                        {/* Editor Topbar */}
                        <div style={{
                            minHeight: 44, background: 'var(--color-surface)',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex', alignItems: 'center', padding: '6px 16px 0', gap: 10, rowGap: 6, flexShrink: 0, flexWrap: 'wrap',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 100%', minWidth: 0, width: '100%', order: 2, borderTop: '1px solid var(--color-border)', paddingTop: 6, paddingBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0, overflowX: 'auto', padding: '6px 0' }}>
                                    {editorFiles.map((file, idx) => {
                                        const isActive = idx === activeFileIndex;
                                        const isModified = file.content !== file.savedContent;
                                        return (
                                            <button
                                                key={file.id}
                                                type="button"
                                                onClick={() => setActiveFileIndex(idx)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    padding: '5px 10px',
                                                    borderRadius: 8,
                                                    border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                    background: isActive ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                                                    color: isActive ? '#fff' : 'var(--color-text-mid)',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                    cursor: isActive ? 'default' : 'pointer',
                                                    transition: 'all .15s',
                                                    maxWidth: 260,
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isActive) {
                                                        e.currentTarget.style.background = 'var(--color-primary-bg)';
                                                        e.currentTarget.style.color = 'var(--color-text-dark)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isActive) {
                                                        e.currentTarget.style.background = 'var(--color-surface-elevated)';
                                                        e.currentTarget.style.color = 'var(--color-text-mid)';
                                                    }
                                                }}
                                            >
                                                <span style={{ fontSize: 13, flexShrink: 0, display: 'inline-flex', alignItems: 'center', width: 14, height: 14 }}>
                                                    {getFileIcon(file.name)}
                                                </span>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                                                {isModified && (
                                                    <span style={{ color: isActive ? '#fff' : 'var(--color-primary)', fontSize: 12, lineHeight: 1, flexShrink: 0 }}>
                                                        •
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddFile}
                                    title="Add new file"
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 6,
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-surface-elevated)',
                                        color: 'var(--color-text-mid)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--color-primary-bg)';
                                        e.currentTarget.style.color = 'var(--color-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--color-surface-elevated)';
                                        e.currentTarget.style.color = 'var(--color-text-mid)';
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('ta-upload-input-topbar')?.click()}
                                    title="Upload files"
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 6,
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-surface-elevated)',
                                        color: 'var(--color-text-mid)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--color-primary-bg)';
                                        e.currentTarget.style.color = 'var(--color-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--color-surface-elevated)';
                                        e.currentTarget.style.color = 'var(--color-text-mid)';
                                    }}
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                                <input
                                    id="ta-upload-input-topbar"
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleUploadSelect}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => router.push(`/ta/courses/${courseId}/submissions`)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '5px 10px',
                                    borderRadius: 8,
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-surface-elevated)',
                                    color: 'var(--color-text-mid)',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-primary-bg)';
                                    e.currentTarget.style.color = 'var(--color-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-surface-elevated)';
                                    e.currentTarget.style.color = 'var(--color-text-mid)';
                                }}
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Back
                            </button>
                            <span style={{
                                fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const,
                                letterSpacing: '.6px', padding: '2px 8px', borderRadius: 10,
                                background: isDark ? '#3b1a1a' : 'var(--color-warning-bg)',
                                color: isDark ? '#fca5a5' : 'var(--color-warning)',
                                display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
                            }}>
                                {language.charAt(0).toUpperCase() + language.slice(1)}
                            </span>

                            {/* Ad-hoc Run button (similar to student) */}
                            <button
                                onClick={handleRunCode}
                                disabled={isExecutingCode || runTestsMutation.isPending || autoGradeMutation.isPending}
                                style={{
                                    padding: '5px 16px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                                    background: 'var(--color-success)', color: '#fff', letterSpacing: '.3px',
                                    transition: 'background .15s, box-shadow .2s',
                                    opacity: isExecutingCode ? 0.7 : 1,
                                    cursor: isExecutingCode ? 'not-allowed' : 'pointer',
                                    border: 'none',
                                }}
                                onMouseEnter={e => { if (!isExecutingCode) { e.currentTarget.style.background = 'var(--color-success)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(22,163,74,.5)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-success)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                {isExecutingCode ? '⏳ Running...' : '▶ Run Code'}
                            </button>
                            {supportsCompileCheck && (
                                <button
                                    onClick={handleCompileCode}
                                    disabled={isExecutingCode || runTestsMutation.isPending || autoGradeMutation.isPending}
                                    style={{
                                        padding: '5px 12px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                                        background: 'var(--color-primary)', color: '#fff', letterSpacing: '.3px',
                                        transition: 'background .15s, box-shadow .2s',
                                        opacity: isExecutingCode ? 0.7 : 1,
                                        cursor: isExecutingCode ? 'not-allowed' : 'pointer',
                                        border: 'none',
                                    }}
                                    onMouseEnter={e => { if (!isExecutingCode) { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(123,13,13,.45)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {compileButtonLabel}
                                </button>
                            )}

                            <button
                                onClick={handleOpenInlineInput}
                                disabled={isExecutingCode || runTestsMutation.isPending || autoGradeMutation.isPending}
                                style={{
                                    padding: '5px 12px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                                    background: 'var(--color-surface-elevated)', color: 'var(--color-text-dark)', letterSpacing: '.3px',
                                    transition: 'background .15s',
                                    opacity: isExecutingCode ? 0.7 : 1,
                                    cursor: isExecutingCode ? 'not-allowed' : 'pointer',
                                    border: '1px solid var(--color-border)',
                                }}
                                onMouseEnter={e => { if (!isExecutingCode) { e.currentTarget.style.background = 'var(--color-border)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                            >
                                ⌨ Input
                            </button>

                            <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 6px' }} />

                            {/* Auto Grade button also in top bar for convenience */}
                            {permissions?.can_grade !== false && (
                                <button
                                    onClick={() => handleAutoGrade(false)}
                                    disabled={autoGradeMutation.isPending || runTestsMutation.isPending}
                                    style={{
                                        padding: '5px 16px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                                        background: isDark ? 'var(--color-primary)' : 'var(--color-error)', color: '#fff', letterSpacing: '.3px',
                                        transition: 'background .15s, box-shadow .2s',
                                        opacity: autoGradeMutation.isPending ? 0.7 : 1,
                                        cursor: autoGradeMutation.isPending ? 'not-allowed' : 'pointer',
                                        border: 'none', display: 'flex', alignItems: 'center', gap: 6,
                                    }}
                                    onMouseEnter={e => { if (!autoGradeMutation.isPending) { e.currentTarget.style.background = 'var(--color-error)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(153,27,27,.5)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'var(--color-primary)' : 'var(--color-error)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {autoGradeMutation.isPending ? '⏳ Grading...' : <><Zap style={{ width: 14, height: 14 }} /> Auto Grade</>}
                                </button>
                            )}

                            <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 6px' }} />

                            {/* Layout toggles */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <div className="flex-1 overflow-hidden relative" style={{ background: 'var(--color-surface)' }}>
                            {activeFile ? (
                                <CodeEditor
                                    language={language}
                                    value={code}
                                    onChange={setCode}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p style={{ color: 'var(--color-text-mid)', fontSize: '14px' }}>No file content available</p>
                                </div>
                            )}
                        </div>

                        {/* Output Panel (collapsible, matching student) */}
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
                                <span>⬤ TERMINAL OUTPUT</span>
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
                                    isRunning={isExecutingCode}
                                    error={execError}
                                    stdinInput={lastStdinInput}
                                    showInputEditor={showInlineInput}
                                    inputDraft={stdinValue}
                                    onInputDraftChange={setStdinValue}
                                    onRunWithInput={handleRunWithStdin}
                                    isRunWithInputDisabled={isExecutingCode || runTestsMutation.isPending || autoGradeMutation.isPending}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Info Panel (tabbed) ── */}
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
                                {(['desc', 'tests', 'grading'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setInfoTab(tab)}
                                        style={{
                                            padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 600,
                                            whiteSpace: 'nowrap' as const, transition: 'all .2s',
                                            background: infoTab === tab ? 'var(--color-primary)' : 'transparent',
                                            color: infoTab === tab ? '#fff' : 'var(--color-text-light)',
                                            border: 'none', cursor: 'pointer',
                                        }}
                                        onMouseEnter={e => { if (infoTab !== tab) { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-mid)'; } }}
                                        onMouseLeave={e => { if (infoTab !== tab) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-light)'; } }}
                                    >
                                        {tab === 'desc' ? '📋 Info' : tab === 'tests' ? '🧪 Tests' : tab === 'grading' ? '📊 Grading' : 'Submit'}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto" style={{ padding: 16 }}>

                                {/* ── Desc Tab ── */}
                                {infoTab === 'desc' && (
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: 'var(--color-primary-light)' }}
                                            >
                                                <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                                    {detail.student.name}
                                                </p>
                                                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    {detail.student.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 mb-6">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    {detail.assignment.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    Attempt #{detail.attempt_number}
                                                </span>
                                            </div>
                                            {detail.created_at && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                        Submitted: {new Date(detail.created_at).toLocaleString('en-US', {
                                                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            {detail.assignment.due_date && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                        Due: {new Date(detail.assignment.due_date).toLocaleDateString('en-US', {
                                                            month: 'short', day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ── Tests Tab ── */}
                                {infoTab === 'tests' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                                🧪 Test Results
                                            </h2>
                                            {permissions?.can_run_tests !== false && (
                                                <button
                                                    onClick={handleRunTests}
                                                    disabled={runTestsMutation.isPending || autoGradeMutation.isPending}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                                                    style={{
                                                        backgroundColor: 'var(--color-primary-light)',
                                                        color: 'var(--color-primary)',
                                                        border: '1px solid var(--color-primary)',
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                    }}
                                                >
                                                    {runTestsMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                                    Run All Tests
                                                </button>
                                            )}
                                        </div>

                                        {(() => {
                                            const displayTests = runTestsResult?.results ?? (detail.test_results.length > 0 ? detail.test_results : null);
                                            if (!displayTests || displayTests.length === 0) {
                                                if (runTestsMutation.isPending) {
                                                    return <div className="flex flex-col items-center justify-center p-8 gap-3">
                                                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
                                                        <p style={{ fontSize: 12, color: 'var(--color-text-mid)' }}>Running tests...</p>
                                                    </div>;
                                                }
                                                return <p style={{ fontSize: 13, color: 'var(--color-text-mid)' }}>No test results yet. Run tests to see output.</p>;
                                            }
                                            const passed = displayTests.filter((t: any) => t.passed).length;
                                            return (
                                                <div>
                                                    <span
                                                        className="px-2.5 py-1 rounded-full mb-4 inline-block"
                                                        style={{
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: passed === displayTests.length ? 'var(--color-success)' : 'var(--color-warning)',
                                                            backgroundColor: passed === displayTests.length ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                                                        }}
                                                    >
                                                        {passed}/{displayTests.length} passed
                                                    </span>

                                                    <div className="space-y-2">
                                                        {displayTests.map((test: any) => (
                                                            <div
                                                                key={test.id}
                                                                className="rounded-lg overflow-hidden"
                                                                style={{ border: '1px solid var(--color-border)' }}
                                                            >
                                                                <button
                                                                    onClick={() => toggleTest(test.id)}
                                                                    className="w-full flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-[var(--color-primary-bg)]"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        {test.passed ? (
                                                                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                                                                        ) : (
                                                                            <XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-error)' }} />
                                                                        )}
                                                                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                                            {test.testcase_name || `Test #${test.testcase_id}`}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {test.points_awarded != null && (
                                                                            <span style={{ fontSize: '11px', color: 'var(--color-text-mid)' }}>
                                                                                {test.points_awarded} pts
                                                                            </span>
                                                                        )}
                                                                        {expandedTests.has(test.id) ? (
                                                                            <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                                        ) : (
                                                                            <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                                        )}
                                                                    </div>
                                                                </button>
                                                                {expandedTests.has(test.id) && (
                                                                    <div
                                                                        className="px-3 py-2 border-t"
                                                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}
                                                                    >
                                                                        {test.input_data && (
                                                                            <div className="mb-2">
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '4px' }}>
                                                                                    Input:
                                                                                </p>
                                                                                <pre
                                                                                    className="p-2 rounded text-xs overflow-x-auto"
                                                                                    style={{
                                                                                        backgroundColor: '#111827',
                                                                                        color: '#E5E7EB',
                                                                                        fontFamily: 'monospace',
                                                                                        maxHeight: '120px',
                                                                                    }}
                                                                                >
                                                                                    {test.input_data}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                        {test.expected_output && (
                                                                            <div className="mb-2">
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '4px' }}>
                                                                                    Expected Output:
                                                                                </p>
                                                                                <pre
                                                                                    className="p-2 rounded text-xs overflow-x-auto"
                                                                                    style={{
                                                                                        backgroundColor: '#111827',
                                                                                        color: '#E5E7EB',
                                                                                        fontFamily: 'monospace',
                                                                                        maxHeight: '120px',
                                                                                    }}
                                                                                >
                                                                                    {test.expected_output}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                        {test.output && (
                                                                            <div className="mb-2">
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '4px' }}>
                                                                                    Output:
                                                                                </p>
                                                                                <pre
                                                                                    className="p-2 rounded text-xs overflow-x-auto"
                                                                                    style={{
                                                                                        backgroundColor: '#1e1e1e',
                                                                                        color: '#d4d4d4',
                                                                                        fontFamily: 'monospace',
                                                                                        maxHeight: '120px',
                                                                                    }}
                                                                                >
                                                                                    {test.output}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                        {test.error_output && (
                                                                            <div>
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-error)', marginBottom: '4px' }}>
                                                                                    Error:
                                                                                </p>
                                                                                <pre
                                                                                    className="p-2 rounded text-xs overflow-x-auto"
                                                                                    style={{
                                                                                        backgroundColor: 'var(--color-error-bg)',
                                                                                        color: 'var(--color-error)',
                                                                                        fontFamily: 'monospace',
                                                                                        maxHeight: '120px',
                                                                                    }}
                                                                                >
                                                                                    {test.error_output}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                        {!test.output && !test.error_output && (
                                                                            <p style={{ fontSize: '11px', color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                                                                                No output recorded
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* ── Grading Tab ── */}
                                {infoTab === 'grading' && (
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 12 }}>
                                            📊 Assess &amp; Grade
                                        </h2>

                                        {/* Auto-Grade Result Banner */}
                                        {autoGradeResult && (
                                            <div
                                                className="mb-6 px-4 py-3 rounded-lg"
                                                style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid #6EE7B7' }}
                                            >
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-success)', marginBottom: '4px' }}>
                                                    {autoGradeResult.message}
                                                </p>
                                                <p style={{ fontSize: '12px', color: 'var(--color-success)' }}>
                                                    Auto-score: {autoGradeResult.score ?? '—'} / {autoGradeResult.max_score ?? '—'} ({autoGradeResult.percentage.toFixed(1)}%)
                                                </p>
                                            </div>
                                        )}

                                        {/* Rubric Section */}
                                        {rubrics.length > 0 && (
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)' }}>
                                                        Rubric
                                                    </h3>
                                                    <span
                                                        style={{
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            letterSpacing: '.35px',
                                                            textTransform: 'uppercase' as const,
                                                            color: isWeightedRubric ? 'var(--color-primary)' : 'var(--color-success)',
                                                            backgroundColor: isWeightedRubric ? 'rgba(107,0,0,.10)' : 'rgba(45,106,45,.12)',
                                                            border: `1px solid ${isWeightedRubric ? 'rgba(107,0,0,.24)' : 'rgba(45,106,45,.24)'}`,
                                                            borderRadius: 999,
                                                            padding: '3px 9px',
                                                        }}
                                                    >
                                                        {isWeightedRubric ? 'Weighted' : 'Unweighted'}
                                                    </span>
                                                </div>

                                                {/* Running total strip */}
                                                <div
                                                    className="mb-3 flex items-center justify-between rounded-md px-3 py-2"
                                                    style={{
                                                        backgroundColor: 'var(--color-surface)',
                                                        border: '1px solid var(--color-border)',
                                                    }}
                                                >
                                                    <div style={{ fontSize: 11, color: 'var(--color-text-mid)' }}>
                                                        Rubric total
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                                            {rubricTotals.hasAnyInput ? rubricTotals.earned : '—'}
                                                            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-mid)' }}>
                                                                {' '} / {rubricTotals.max} pts
                                                            </span>
                                                        </span>
                                                        {isWeightedRubric && derivedAssignmentGrade && (
                                                            <span
                                                                style={{
                                                                    fontSize: 11,
                                                                    fontWeight: 600,
                                                                    color: 'var(--color-primary)',
                                                                    backgroundColor: 'rgba(107,0,0,.08)',
                                                                    border: '1px solid rgba(107,0,0,.20)',
                                                                    borderRadius: 999,
                                                                    padding: '2px 8px',
                                                                }}
                                                                title="Weighted score scaled to the assignment's total points"
                                                            >
                                                                → {derivedAssignmentGrade.earned} / {derivedAssignmentGrade.max}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    {rubricSections.map((section, sectionIdx) => (
                                                        <div key={section.id} className="border-l-2 border-blue-500 pl-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                                                    {section.name}
                                                                </p>
                                                                {Math.abs(sectionWeightPercent(section.weight) - 100) > 0.0001 && (
                                                                    <span style={{ fontSize: '10px', color: 'var(--color-primary)', backgroundColor: 'rgba(107,0,0,.10)', padding: '2px 6px', borderRadius: '3px' }}>
                                                                        {sectionWeightPercent(section.weight).toFixed(1)}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {(section.criteria || []).length > 0 ? (
                                                                    (section.criteria || []).map((criterion, critIdx) => {
                                                                        const autoEval = autoGradeResult?.rubric_results?.evaluations?.find(
                                                                            (e) => (e.criterion_id ?? e.rubric_id) === criterion.id
                                                                        );
                                                                        const max = autoEval?.max_points ?? (isWeightedRubric ? 5 : (criterion.max_points || 0));
                                                                        const effectiveWeight = getCriterionEffectiveWeight(section, criterion, sectionIdx, critIdx);
                                                                        const criterionIdNum = Number(criterion.id);
                                                                        const rawScore = criterionScores[criterionIdNum] ?? '';
                                                                        const earnedNum = rawScore === '' ? null : Number(rawScore);
                                                                        const hasScore = earnedNum !== null && Number.isFinite(earnedNum);
                                                                        const isFull = hasScore && max > 0 && earnedNum === max;

                                                                        return (
                                                                            <div
                                                                                key={criterion.id}
                                                                                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
                                                                                style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}
                                                                            >
                                                                                <div className="flex-1 pr-2 min-w-0">
                                                                                    <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                                                        {criterion.name}
                                                                                    </p>
                                                                                    <p style={{ fontSize: '10px', color: 'var(--color-text-light)', marginTop: '2px' }}>
                                                                                        Weight: {formatPointValue(effectiveWeight)}%
                                                                                    </p>
                                                                                    {criterion.description && (
                                                                                        <p style={{ fontSize: '10px', color: 'var(--color-text-mid)', marginTop: '2px' }}>
                                                                                            {criterion.description}
                                                                                        </p>
                                                                                    )}
                                                                                    {autoEval?.feedback && (
                                                                                        <p style={{ fontSize: '10px', color: 'var(--color-text-mid)', marginTop: '2px' }}>
                                                                                            {autoEval.feedback}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                                <div
                                                                                    className="flex items-center gap-1 shrink-0 rounded-md px-2 py-1"
                                                                                    style={{
                                                                                        backgroundColor: 'var(--color-surface)',
                                                                                        border: `1px solid ${hasScore ? (isFull ? 'rgba(45,106,45,.35)' : 'rgba(107,0,0,.35)') : 'var(--color-border)'}`,
                                                                                    }}
                                                                                >
                                                                                    <input
                                                                                        type="number"
                                                                                        min={0}
                                                                                        max={max || undefined}
                                                                                        step={isWeightedRubric ? 1 : 0.5}
                                                                                        value={rawScore}
                                                                                        onChange={(e) => {
                                                                                            const v = e.target.value;
                                                                                            setCriterionScores((prev) => ({
                                                                                                ...prev,
                                                                                                [criterionIdNum]: v,
                                                                                            }));
                                                                                        }}
                                                                                        aria-label={`Score for ${criterion.name}`}
                                                                                        className="w-12 text-right bg-transparent focus:outline-none"
                                                                                        style={{
                                                                                            fontSize: '12px',
                                                                                            fontWeight: 600,
                                                                                            color: hasScore ? (isFull ? 'var(--color-success)' : 'var(--color-primary)') : 'var(--color-text-dark)',
                                                                                            // Hide native spinner for a cleaner look
                                                                                            MozAppearance: 'textfield',
                                                                                        }}
                                                                                        placeholder="—"
                                                                                    />
                                                                                    <span style={{ fontSize: '11px', color: 'var(--color-text-mid)' }}>
                                                                                        / {max} pts
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <div
                                                                        className="px-3 py-2 rounded-lg"
                                                                        style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}
                                                                    >
                                                                        <p style={{ fontSize: '12px', color: 'var(--color-text-mid)', lineHeight: 1.6 }}>
                                                                            {section.description || 'No criteria were defined for this section.'}
                                                                        </p>
                                                                        {getSectionFallbackPoints(section) !== null && (
                                                                            <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700, marginTop: 8 }}>
                                                                                Points: {getSectionFallbackPoints(section)}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Grading Form */}
                                        {permissions?.can_grade !== false && (
                                            <div>
                                                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '12px' }}>
                                                    Grading Form
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label
                                                            htmlFor="grade-score"
                                                            style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}
                                                        >
                                                            Score Earned
                                                        </label>
                                                        <input
                                                            id="grade-score"
                                                            type="number"
                                                            value={score}
                                                            onChange={(e) => {
                                                                setScore(e.target.value);
                                                                setScoreOverridden(true);
                                                            }}
                                                            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                            style={{
                                                                backgroundColor: 'var(--color-surface)',
                                                                border: '1px solid var(--color-border)',
                                                                fontSize: '14px',
                                                                color: 'var(--color-text-dark)',
                                                            }}
                                                        />
                                                        {rubricTotals.hasAnyInput && (
                                                            <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                                                                <span style={{ fontSize: 10, color: 'var(--color-text-light)' }}>
                                                                    {scoreOverridden ? 'Manually overridden' : 'Auto-synced from rubric'}
                                                                </span>
                                                                {scoreOverridden && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setScoreOverridden(false);
                                                                            if (derivedAssignmentGrade) setScore(String(derivedAssignmentGrade.earned));
                                                                        }}
                                                                        style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-primary)' }}
                                                                        className="hover:underline"
                                                                    >
                                                                        Sync to rubric
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="grade-max-score"
                                                            style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}
                                                        >
                                                            Max Points
                                                        </label>
                                                        <input
                                                            id="grade-max-score"
                                                            type="number"
                                                            value={maxScore}
                                                            onChange={(e) => {
                                                                setMaxScore(e.target.value);
                                                                setMaxScoreOverridden(true);
                                                            }}
                                                            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                            style={{
                                                                backgroundColor: 'var(--color-surface)',
                                                                border: '1px solid var(--color-border)',
                                                                fontSize: '14px',
                                                                color: 'var(--color-text-dark)',
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="grade-feedback"
                                                        style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}
                                                    >
                                                        Feedback for Student
                                                    </label>
                                                    <textarea
                                                        id="grade-feedback"
                                                        value={feedback}
                                                        onChange={(e) => setFeedback(e.target.value)}
                                                        rows={5}
                                                        placeholder="Add comments on their submission..."
                                                        className="w-full px-3 py-2 rounded-lg resize-none"
                                                        style={{
                                                            backgroundColor: 'var(--color-primary-bg)',
                                                            border: '1px solid var(--color-border)',
                                                            fontSize: '13px',
                                                            color: 'var(--color-text-dark)',
                                                            lineHeight: 1.5,
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <button
                                                        onClick={() => handleSaveDraft(false)}
                                                        disabled={gradeMutation.isPending || !score}
                                                        style={{
                                                            width: '100%', padding: '12px', borderRadius: 6,
                                                            fontSize: 13, fontWeight: 700, border: 'none',
                                                            background: isDark ? 'linear-gradient(135deg, var(--color-success), var(--color-success))' : 'linear-gradient(135deg, var(--color-success), var(--color-success))',
                                                            color: '#fff', transition: 'all .2s',
                                                            textTransform: 'uppercase' as const, letterSpacing: '.5px',
                                                            cursor: (gradeMutation.isPending || !score) ? 'not-allowed' : 'pointer',
                                                            opacity: (gradeMutation.isPending || !score) ? 0.7 : 1,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                        }}
                                                        onMouseEnter={e => {
                                                            if (!gradeMutation.isPending && score) {
                                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                                                e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(22,163,74,.4)' : '0 4px 12px rgba(21,128,61,.35)';
                                                            }
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.transform = 'none';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        {gradeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                        Save Draft for Instructor
                                                    </button>

                                                    {nextSubmissionId && (
                                                        <button
                                                            onClick={() => handleSaveDraft(true)}
                                                            disabled={gradeMutation.isPending || !score}
                                                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                                                            style={{
                                                                backgroundColor: 'var(--color-surface-elevated)',
                                                                border: '1px solid var(--color-border)',
                                                                color: 'var(--color-text-dark)',
                                                                fontSize: '13px',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            <Send className="w-4 h-4" /> Save Draft &amp; Next
                                                        </button>
                                                    )}
                                                </div>

                                                {gradeMutation.isSuccess && (
                                                    <div
                                                        className="mt-4 px-4 py-2 rounded-lg"
                                                        style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid #6EE7B7' }}
                                                    >
                                                        <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-success)' }}>
                                                            Draft saved successfully
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ═══ STATUS BAR ═══ */}
                <div style={{
                    height: 28, background: '#1e4a7a', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 12px', fontSize: 11, fontWeight: 500, flexShrink: 0,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '.4px' }}>
                            <span style={{ opacity: .7 }}>ROLE:</span> TA/FACULTY
                        </span>
                        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '.4px' }}>
                            <span style={{ opacity: .7 }}>LANG:</span> {language.toUpperCase()}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: .9 }}>
                            {detail.status === 'graded' ? '✓ SUBMISSION GRADED' : '● NEEDS GRADING'}
                        </span>
                    </div>
                </div>

            </div>

        </PageLayout>
    );
}
