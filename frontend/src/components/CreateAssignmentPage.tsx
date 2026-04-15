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
import {
    CreateAssignmentForm,
    type AssignmentFormData,
    type AssignmentSubmitOptions,
} from '@/components/CreateAssignmentForm';
import { toast } from 'sonner';
import { useCreateAssignment } from '@/hooks/queries';
import type { CreateAssignmentDto } from '@/types';
import { assignmentService } from '@/services/api';

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
        aiDetectionEnabled: data.aiDetectionEnabled ?? true,
        autoFlagEnabled: data.autoFlagEnabled ?? true,
        autoFlagThreshold: data.autoFlagThreshold ?? 70,
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
        rubric: (data.rubric ?? []).map((section) => ({
            name: section.name,
            description: section.description ?? '',
            weight: section.weight ?? 100,
            criteria: (section.criteria ?? []).map((criterion) => ({
                name: criterion.name,
                description: criterion.description ?? '',
                maxPoints: criterion.maxPoints,
                weight: (criterion.weight ?? 100) / 100,
                gradingMethod: criterion.gradingMethod,
            })),
        })),
    };
}

export function CreateAssignmentPage() {
    const router = useRouter();
    const { courseId } = useParams() as { courseId: string };
    const cid = courseId ?? '';
    const courseCode = lookupCourseCode(cid);
    const createMutation = useCreateAssignment();
    const uploadDescriptionPdfIfProvided = useCallback(
        async (assignmentId: string, options?: AssignmentSubmitOptions) => {
            const file = options?.descriptionPdfFile;
            if (!file) return;
            try {
                await assignmentService.uploadDescriptionPdf(assignmentId, file);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                toast.error(`Assignment saved, but PDF attachment failed: ${message}`);
            }
        },
        []
    );

    const handleSaveDraft = useCallback(
        async (data: AssignmentFormData, options?: AssignmentSubmitOptions) => {
            const dto = { ...toDto(data, cid), status: 'draft' } as CreateAssignmentDto & { status: string };
            try {
                const created = await createMutation.mutateAsync(dto);
                await uploadDescriptionPdfIfProvided(created.id, options);

                // Clear local draft
                try {
                    localStorage.removeItem(`autograde_assignment_draft_${cid}`);
                } catch { /* ignore */ }
                toast.success('Assignment saved as draft!');
                router.push(`/courses/${cid}`);
            } catch (err) {
                // Fallback: save to localStorage if backend fails
                try {
                    localStorage.setItem(
                        `autograde_assignment_draft_${cid}`,
                        JSON.stringify(data),
                    );
                } catch { /* ignore */ }
                const message = err instanceof Error ? err.message : 'Unknown error';
                const msg = `Failed to save draft to server: ${message}. Saved locally instead.`;
                toast.error(msg);
                if (typeof window !== 'undefined') {
                    window.alert(msg);
                }
            }
        },
        [cid, createMutation, router, uploadDescriptionPdfIfProvided]
    );

    const handlePublish = useCallback(
        async (data: AssignmentFormData, options?: AssignmentSubmitOptions) => {
            const dto = toDto(data, cid);
            try {
                const created = await createMutation.mutateAsync(dto);
                await uploadDescriptionPdfIfProvided(created.id, options);

                // Clear draft
                try {
                    localStorage.removeItem(`autograde_assignment_draft_${cid}`);
                } catch { /* ignore */ }
                toast.success('Assignment published!');
                router.push(`/courses/${cid}`);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                const msg = `Failed to create assignment: ${message}`;
                toast.error(msg);
                if (typeof window !== 'undefined') {
                    window.alert(msg);
                }
            }
        },
        [cid, router, createMutation, uploadDescriptionPdfIfProvided]
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
