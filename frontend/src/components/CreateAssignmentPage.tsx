'use client';

/* ═══════════════════════════════════════════════════════════════════
   CreateAssignmentPage — Page shell wrapping CreateAssignmentForm
   Uses the shared PageLayout + TopNav + Sidebar chrome.
   Persists created assignments to the backend API via React Query.
   ═══════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { PageLayout } from '@/components/PageLayout';
import { Sidebar } from '@/components/Sidebar';
import { CreateAssignmentForm, type AssignmentFormData } from '@/components/CreateAssignmentForm';
import { toast } from 'sonner';
import { useCreateAssignment } from '@/hooks/queries';
import type { CreateAssignmentDto } from '@/types';
import { criterionWeightForAssignmentApi } from '@/lib/rubricApiWeights';
import { courseService } from '@/services/api/courseService';
import { courseDefaultApiToFormPartial } from '@/lib/courseDefaultRubric';
import { Loader2 } from 'lucide-react';

function lookupCourseCode(id: string) {
    try {
        const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        const f = s.find((c: { id: string; code?: string }) => c.id === id);
        if (f?.code) return f.code;
    } catch { /* ignore */ }
    return id;
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
            points: t.points,
        })),
        privateTests: (data.privateTests ?? []).map(({ inputType: _it, ...t }) => ({
            name: t.name,
            input: t.input,
            expectedOutput: t.expectedOutput,
            isPublic: false,
            points: t.points,
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
    const { courseId } = useParams() as { courseId: string };
    const cid = courseId ?? '';
    const courseCode = lookupCourseCode(cid);
    const createMutation = useCreateAssignment();
    const [defaultRubricReady, setDefaultRubricReady] = useState(false);
    const [initialData, setInitialData] = useState<Partial<AssignmentFormData>>({});

    useEffect(() => {
        if (!cid) return;
        let cancelled = false;
        setDefaultRubricReady(false);
        courseService
            .getCourseDefaultRubric(cid)
            .then((d) => {
                if (!cancelled) setInitialData(courseDefaultApiToFormPartial(d));
            })
            .catch(() => {
                if (!cancelled) setInitialData({});
            })
            .finally(() => {
                if (!cancelled) setDefaultRubricReady(true);
            });
        return () => {
            cancelled = true;
        };
    }, [cid]);

    const handleSaveDraft = useCallback(
        (data: AssignmentFormData) => {
            const dto = { ...toDto(data, cid), status: 'draft' } as CreateAssignmentDto & { status: string };
            createMutation.mutate(dto, {
                onSuccess: () => {
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
        [cid, createMutation, router]
    );

    const handlePublish = useCallback(
        (data: AssignmentFormData) => {
            const dto = toDto(data, cid);
            createMutation.mutate(dto, {
                onSuccess: () => {
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
        [cid, router, createMutation]
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
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublish}
                        onCancel={handleCancel}
                    />
                </main>
            </div>
        </PageLayout>
    );
}
