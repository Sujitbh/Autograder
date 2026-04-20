'use client';

/* ═══════════════════════════════════════════════════════════════════
   CreateAssignmentPage — Page shell wrapping CreateAssignmentForm
   Uses the shared PageLayout + TopNav + Sidebar chrome.
   Persists created assignments to the backend API via React Query.
   ═══════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { PageLayout } from '@/components/PageLayout';
import { Sidebar } from '@/components/Sidebar';
import { CreateAssignmentForm, type AssignmentFormData, type AssignmentSubmissionMeta } from '@/components/CreateAssignmentForm';
import { toast } from 'sonner';
import { useCreateAssignment, useUpdateAssignment } from '@/hooks/queries';
import type { CreateAssignmentDto } from '@/types';
import { criterionWeightForAssignmentApi } from '@/lib/rubricApiWeights';
import { courseService } from '@/services/api/courseService';
import { assignmentService } from '@/services/api/assignmentService';
import { testcaseService } from '@/services/api/testcaseService';
import { courseDefaultApiToFormPartial, formRubricToCoursePutApi } from '@/lib/courseDefaultRubric';
import { Loader2 } from 'lucide-react';
import type { Assignment } from '@/types';

function lookupCourseCode(id: string) {
    try {
        const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        const f = s.find((c: { id: string; code?: string }) => c.id === id);
        if (f?.code) return f.code;
    } catch { /* ignore */ }
    return id;
}

function toDateTimeLocal(iso: string | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function assignmentToFormPartial(a: Assignment): Partial<AssignmentFormData> {
    const criterionWeightToForm = (raw: number | undefined, sectionWeight: number): number => {
        if (raw == null) return 0;
        // Backend stores criterion weight as fraction-of-section for many assignment payloads.
        // Convert back to the form's displayed absolute percentage scale.
        if (raw >= 0 && raw <= 1.5) return Math.round((raw * sectionWeight) * 1000) / 1000;
        return raw;
    };

    const rubricSections = Array.isArray(a.rubric)
        ? (a.rubric as unknown as Array<Record<string, unknown>>)
            .filter((section) => Array.isArray((section as { criteria?: unknown[] }).criteria))
            .map((section) => {
                const s = section as {
                    name?: string;
                    description?: string;
                    weight?: number;
                    criteria?: Array<{
                        name?: string;
                        description?: string;
                        maxPoints?: number;
                        weight?: number;
                        gradingMethod?: 'auto' | 'manual' | 'hybrid';
                        defaultComments?: Record<string, string> | null;
                    }>;
                };
                const sectionWeight = s.weight ?? 100;
                return {
                    name: s.name ?? '',
                    description: s.description ?? '',
                    weight: sectionWeight,
                    criteria: (s.criteria ?? []).map((c) => ({
                        name: c.name ?? '',
                        description: c.description ?? '',
                        maxPoints: c.maxPoints ?? 5,
                        weight: criterionWeightToForm(c.weight, sectionWeight),
                        gradingMethod: c.gradingMethod ?? 'manual',
                        defaultComments: c.defaultComments ?? undefined,
                    })),
                };
            })
        : [];

    return {
        name: a.name ?? '',
        shortName: a.shortName ?? (a.name ?? '').slice(0, 10),
        language: a.language ?? 'python',
        category: a.category ?? 'Homework',
        dueDate: toDateTimeLocal(a.dueDate || ''),
        maxPoints: a.maxPoints ?? 100,
        isGroup: a.isGroup ?? false,
        description: a.description ?? '',
        starterCode: a.starterCode ?? '',
        publicTests: [],
        privateTests: [],
        rubricMode: a.rubricMode ?? 'unweighted',
        gradingStrategy: a.gradingStrategy ?? 'latest',
        rubric: rubricSections,
        maxAttempts: a.maxSubmissions ?? 5,
        allowedFileTypes: a.language === 'java' ? '.java' : '.py',
        maxFileSizeMB: 5,
        allowResubmission: true,
        showResultsToStudents: true,
        enableGitSubmission: false,
        autoFlagEnabled: true,
        autoFlagThreshold: 70,
        crossSectionComparison: false,
    };
}

function rubricToCourseDefaultPayload(data: AssignmentFormData) {
    return formRubricToCoursePutApi({
        rubric: (data.rubric ?? []).map((section) => ({
            name: section.name,
            description: section.description ?? '',
            weight: section.weight ?? 0,
            criteria: (section.criteria ?? []).map((criterion) => ({
                name: criterion.name,
                description: criterion.description ?? '',
                maxPoints: Math.max(0, Math.round(criterion.maxPoints ?? 0)),
                weight: criterion.weight ?? 0,
                gradingMethod: criterion.gradingMethod,
                defaultComments: criterion.defaultComments ?? undefined,
            })),
        })),
        rubricMode: data.rubricMode,
        rubricWeightKind: data.rubricMode === 'weighted' ? 'percent' : 'points',
        maxPoints: data.maxPoints ?? 100,
    });
}

/** Convert form data → API DTO */
function toDto(data: AssignmentFormData, courseId: string): CreateAssignmentDto {
    // dueDate from datetime-local is like "2026-03-15T23:59" — convert to ISO
    // If empty (draft with no date yet), leave it as empty string so the backend stores null
    let isoDate = '';
    if (data.dueDate) {
        const parsed = new Date(data.dueDate);
        if (!Number.isNaN(parsed.getTime())) {
            isoDate = parsed.toISOString();
        }
    }

    return {
        courseId,
        name: data.name.trim() || 'Untitled Assignment',
        shortName: (data.name.trim() || 'Untitled').substring(0, 20),
        description: data.description || '',
        language: (data.language as 'python' | 'java') ?? 'python',
        category: 'Homework',
        dueDate: isoDate,
        maxPoints: data.maxPoints ?? 100,
        maxSubmissions: data.maxAttempts ?? 5,
        gradingStrategy: data.gradingStrategy ?? 'latest',
        rubricMode: data.rubricMode,
        isGroup: data.isGroup ?? false,
        starterCode: data.starterCode || undefined,
        allowLateSubmissions: false,
        latePenalty: undefined,
        publicTests: (data.publicTests ?? []).map(({ inputType: _it, ...t }) => ({
            name: t.name,
            input: t.input,
            expectedOutput: t.expectedOutput,
            isPublic: true,
            points: 1,
        })),
        privateTests: (data.privateTests ?? []).map(({ inputType: _it, ...t }) => ({
            name: t.name,
            input: t.input,
            expectedOutput: t.expectedOutput,
            isPublic: false,
            points: 1,
        })),
        rubric: (data.rubric ?? []).map((section) => {
            const secW = section.weight ?? 100;
            return {
                name: section.name,
                description: section.description ?? '',
                weight: secW,
                criteria: (section.criteria ?? []).map((criterion) => ({
                    name: criterion.name,
                    description: criterion.description ?? '',
                    maxPoints: criterion.maxPoints ?? 5,
                    weight: criterionWeightForAssignmentApi(data.rubricMode, criterion.weight, secW),
                    gradingMethod: criterion.gradingMethod,
                    defaultComments: (criterion as Record<string, unknown>).defaultComments as Record<string, string> | undefined ?? undefined,
                })),
            };
        }),
    };
}

export function CreateAssignmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { courseId } = useParams() as { courseId: string };
    const cid = courseId ?? '';
    const draftId = searchParams.get('draftId');
    const courseCode = lookupCourseCode(cid);
    const createMutation = useCreateAssignment();
    const updateMutation = useUpdateAssignment();
    const [defaultRubricReady, setDefaultRubricReady] = useState(false);
    const [initialData, setInitialData] = useState<Partial<AssignmentFormData>>({});
    const [initialStep, setInitialStep] = useState(0);

    const uploadDescriptionPdfIfPresent = useCallback(
        async (assignmentId: string, submitMeta?: AssignmentSubmissionMeta) => {
            const pdfFile = submitMeta?.descriptionPdfFile;
            if (!pdfFile) return;
            await assignmentService.uploadDescriptionPdf(assignmentId, pdfFile);
        },
        []
    );

    useEffect(() => {
        if (!cid) return;
        let cancelled = false;
        const load = async () => {
            setDefaultRubricReady(false);
            if (draftId) {
                try {
                    const localKey = `autograde_assignment_draft_edit_${draftId}`;
                    const raw = localStorage.getItem(localKey);
                    if (raw) {
                        const parsed = JSON.parse(raw) as Partial<AssignmentFormData>;
                        if (!cancelled) {
                            setInitialData(parsed);
                            setInitialStep(8);
                            setDefaultRubricReady(true);
                        }
                        return;
                    }
                    const assignment = await assignmentService.getAssignment(cid, draftId);
                    const testcases = await testcaseService.getAssignmentTestCases(draftId);
                    const mappedPublicTests = testcases
                        .filter((tc) => tc.is_public)
                        .map((tc, idx) => ({
                            name: tc.name || `Public Test ${idx + 1}`,
                            inputType: 'text' as const,
                            input: tc.input_data ?? '',
                            expectedOutput: tc.expected_output ?? '',
                            points: tc.points ?? 1,
                        }));
                    const mappedPrivateTests = testcases
                        .filter((tc) => !tc.is_public)
                        .map((tc, idx) => ({
                            name: tc.name || `Private Test ${idx + 1}`,
                            inputType: 'text' as const,
                            input: tc.input_data ?? '',
                            expectedOutput: tc.expected_output ?? '',
                            points: tc.points ?? 1,
                        }));
                    if (!cancelled) {
                        setInitialData({
                            ...assignmentToFormPartial(assignment),
                            publicTests: mappedPublicTests,
                            privateTests: mappedPrivateTests,
                        });
                        setInitialStep(8);
                    }
                } catch {
                    if (!cancelled) {
                        setInitialData({});
                        setInitialStep(0);
                    }
                } finally {
                    if (!cancelled) setDefaultRubricReady(true);
                }
                return;
            }

            courseService
                .getCourseDefaultRubric(cid)
                .then((d) => {
                    if (!cancelled) {
                        setInitialData(courseDefaultApiToFormPartial(d));
                        setInitialStep(0);
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        setInitialData({});
                        setInitialStep(0);
                    }
                })
                .finally(() => {
                    if (!cancelled) setDefaultRubricReady(true);
                });
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, [cid, draftId]);

    const handleSaveDraft = useCallback(
        (data: AssignmentFormData, submitMeta?: AssignmentSubmissionMeta) => {
            const dto = { ...toDto(data, cid), status: 'draft' } as CreateAssignmentDto & { status: string };
            if (draftId) {
                void (async () => {
                    try {
                        await updateMutation.mutateAsync({
                            courseId: cid,
                            assignmentId: draftId,
                            dto: {
                                ...dto,
                                status: 'draft',
                            },
                        });
                        await testcaseService.replaceAssignmentTestCases(
                            draftId,
                            [
                                ...(data.publicTests ?? []).map((t) => ({
                                    name: t.name,
                                    input: t.input,
                                    expectedOutput: t.expectedOutput,
                                    isPublic: true,
                                    points: 1,
                                })),
                                ...(data.privateTests ?? []).map((t) => ({
                                    name: t.name,
                                    input: t.input,
                                    expectedOutput: t.expectedOutput,
                                    isPublic: false,
                                    points: 1,
                                })),
                            ]
                        );
                        await uploadDescriptionPdfIfPresent(draftId, submitMeta);
                        try {
                            localStorage.setItem(`autograde_assignment_draft_edit_${draftId}`, JSON.stringify(data));
                        } catch { /* ignore */ }
                        try {
                            localStorage.removeItem(`autograde_assignment_draft_${cid}`);
                        } catch { /* ignore */ }
                        toast.success('Draft updated.');
                        router.push(`/courses/${cid}`);
                    } catch (err: any) {
                        try {
                            localStorage.setItem(
                                `autograde_assignment_draft_edit_${draftId}`,
                                JSON.stringify(data),
                            );
                        } catch { /* ignore */ }
                        const msg = `Failed to update draft on server: ${err.message}. Saved locally instead.`;
                        toast.error(msg);
                        if (typeof window !== 'undefined') {
                            window.alert(msg);
                        }
                    }
                })();
                return;
            }

            createMutation.mutate(dto, {
                onSuccess: async (created) => {
                    try {
                        await uploadDescriptionPdfIfPresent(created.id, submitMeta);
                    } catch (pdfErr: any) {
                        toast.error(`Draft saved, but failed to upload description PDF: ${pdfErr?.message ?? 'Unknown error'}`);
                    }
                    // Persist the latest editable draft snapshot by assignment id.
                    try {
                        localStorage.setItem(`autograde_assignment_draft_edit_${created.id}`, JSON.stringify(data));
                    } catch { /* ignore */ }
                    // Clear local draft
                    try {
                        localStorage.removeItem(`autograde_assignment_draft_${cid}`);
                    } catch { /* ignore */ }
                    toast.success('Assignment saved as draft!');
                    router.push(`/courses/${cid}`);
                },
                onError: (err) => {
                    // Fallback: save to localStorage if backend fails
                    try {
                        localStorage.setItem(
                            `autograde_assignment_draft_${cid}`,
                            JSON.stringify(data),
                        );
                    } catch { /* ignore */ }
                    const msg = `Failed to save draft to server: ${err.message}. Saved locally instead.`;
                    toast.error(msg);
                    if (typeof window !== 'undefined') {
                        window.alert(msg);
                    }
                },
            });
        },
        [cid, createMutation, updateMutation, draftId, router, uploadDescriptionPdfIfPresent]
    );

    const handlePublish = useCallback(
        (data: AssignmentFormData, submitMeta?: AssignmentSubmissionMeta) => {
            const dto = toDto(data, cid);
            const defaultRubricPayload = rubricToCourseDefaultPayload(data);
            if (draftId) {
                void (async () => {
                    try {
                        await assignmentService.replaceAssignmentRubric(draftId, {
                            rubricMode: data.rubricMode,
                            rubric: (data.rubric ?? []).map((section) => {
                                const secW = section.weight ?? 100;
                                return {
                                    name: section.name,
                                    description: section.description ?? '',
                                    weight: secW,
                                    criteria: (section.criteria ?? []).map((criterion) => ({
                                        name: criterion.name,
                                        description: criterion.description ?? '',
                                        maxPoints: criterion.maxPoints ?? 5,
                                        weight: criterionWeightForAssignmentApi(data.rubricMode, criterion.weight, secW),
                                        gradingMethod: criterion.gradingMethod,
                                        defaultComments: (criterion as Record<string, unknown>).defaultComments as Record<string, string> | undefined ?? null,
                                    })),
                                };
                            }),
                        });

                        await testcaseService.replaceAssignmentTestCases(
                            draftId,
                            [
                                ...(data.publicTests ?? []).map((t) => ({
                                    name: t.name,
                                    input: t.input,
                                    expectedOutput: t.expectedOutput,
                                    isPublic: true,
                                    points: 1,
                                })),
                                ...(data.privateTests ?? []).map((t) => ({
                                    name: t.name,
                                    input: t.input,
                                    expectedOutput: t.expectedOutput,
                                    isPublic: false,
                                    points: 1,
                                })),
                            ]
                        );

                        await uploadDescriptionPdfIfPresent(draftId, submitMeta);

                        await updateMutation.mutateAsync({
                            courseId: cid,
                            assignmentId: draftId,
                            dto: {
                                ...dto,
                                status: 'published',
                                isActive: true,
                            },
                        });

                        try {
                            await courseService.putCourseDefaultRubric(cid, defaultRubricPayload);
                        } catch { /* ignore default rubric sync failures */ }

                        try {
                            localStorage.removeItem(`autograde_assignment_draft_${cid}`);
                            localStorage.removeItem(`autograde_assignment_draft_edit_${draftId}`);
                        } catch { /* ignore */ }

                        toast.success('Draft published!');
                        router.push(`/courses/${cid}`);
                    } catch (err: any) {
                        const msg = `Failed to publish draft: ${err.message}`;
                        toast.error(msg);
                        if (typeof window !== 'undefined') {
                            window.alert(msg);
                        }
                    }
                })();
                return;
            }

            createMutation.mutate(dto, {
                onSuccess: async (created) => {
                    try {
                        await uploadDescriptionPdfIfPresent(created.id, submitMeta);
                    } catch (pdfErr: any) {
                        toast.error(`Assignment published, but failed to upload description PDF: ${pdfErr?.message ?? 'Unknown error'}`);
                    }
                    try {
                        await courseService.putCourseDefaultRubric(cid, defaultRubricPayload);
                    } catch { /* ignore default rubric sync failures */ }
                    // Clear draft
                    try {
                        localStorage.removeItem(`autograde_assignment_draft_${cid}`);
                    } catch { /* ignore */ }
                    toast.success('Assignment published!');
                    router.push(`/courses/${cid}`);
                },
                onError: (err) => {
                    const msg = `Failed to create assignment: ${err.message}`;
                    toast.error(msg);
                    if (typeof window !== 'undefined') {
                        window.alert(msg);
                    }
                },
            });
        },
        [cid, router, createMutation, draftId, updateMutation, uploadDescriptionPdfIfPresent]
    );

    const handleCancel = useCallback(() => {
        router.push(`/courses/${cid}`);
    }, [cid, router]);

    if (!defaultRubricReady) {
        return (
            <PageLayout>
                <TopNav
                    breadcrumbs={[
                        { label: 'Courses', href: '/courses' },
                        { label: courseCode, href: `/courses/${cid}` },
                        { label: 'Create Assignment' },
                    ]}
                />
                <div className="flex h-[calc(100vh-64px)] items-center justify-center gap-2 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    <span>Loading course rubric…</span>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <TopNav
                breadcrumbs={[
                    { label: 'Courses', href: '/courses' },
                    { label: courseCode, href: `/courses/${cid}` },
                    { label: 'Create Assignment' },
                ]}
            />

            <div className="flex h-[calc(100vh-64px)]">
                <Sidebar activeItem="assignments" />

                <main className="flex-1 overflow-auto p-8">
                    <CreateAssignmentForm
                        courseId={cid}
                        initialData={initialData}
                        initialStep={initialStep}
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublish}
                        onCancel={handleCancel}
                    />
                </main>
            </div>
        </PageLayout>
    );
}
