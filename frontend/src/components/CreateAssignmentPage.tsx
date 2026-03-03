'use client';

/* ═══════════════════════════════════════════════════════════════════
   CreateAssignmentPage — Page shell wrapping CreateAssignmentForm
   Uses the shared PageLayout + TopNav + Sidebar chrome.
   Persists created assignments to the backend API via React Query.
   ═══════════════════════════════════════════════════════════════════ */

import { useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { PageLayout } from '@/components/PageLayout';
import { Sidebar } from '@/components/Sidebar';
import { CreateAssignmentForm, type AssignmentFormData } from '@/components/CreateAssignmentForm';
import { toast } from 'sonner';
import { useCreateAssignment } from '@/hooks/queries';
import type { CreateAssignmentDto } from '@/types';

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
        isGroup: data.isGroup ?? false,
        allowLateSubmissions: data.allowLateSubmissions ?? false,
        latePenalty: data.allowLateSubmissions
            ? { type: 'percentage', amount: data.latePenaltyAmount ?? 10, maxDaysLate: 7 }
            : undefined,
        publicTests: (data.publicTests ?? []).map((t) => ({
            name: t.name,
            input: t.input,
            expectedOutput: t.expectedOutput,
            isPublic: true,
            points: t.points,
        })),
        privateTests: (data.privateTests ?? []).map((t) => ({
            name: t.name,
            input: t.input,
            expectedOutput: t.expectedOutput,
            isPublic: false,
            points: t.points,
        })),
        rubric: (data.rubric ?? []).map((c) => ({
            name: c.name,
            description: c.description,
            maxPoints: c.maxPoints,
            gradingMethod: c.gradingMethod,
        })),
    };
}

export function CreateAssignmentPage() {
    const router = useRouter();
    const { courseId } = useParams() as { courseId: string };
    const cid = courseId ?? '';
    const courseCode = lookupCourseCode(cid);
    const createMutation = useCreateAssignment();

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
                    toast.error(`Failed to save draft to server: ${err.message}. Saved locally instead.`);
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
                    toast.error(`Failed to create assignment: ${err.message}`);
                },
            });
        },
        [cid, router, createMutation]
    );

    const handleCancel = useCallback(() => {
        router.push(`/courses/${cid}`);
    }, [cid, router]);

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
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublish}
                        onCancel={handleCancel}
                    />
                </main>
            </div>
        </PageLayout>
    );
}
