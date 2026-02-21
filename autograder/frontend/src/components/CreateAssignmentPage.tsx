'use client';

/* ═══════════════════════════════════════════════════════════════════
   CreateAssignmentPage — Page shell wrapping CreateAssignmentForm
   Uses the shared PageLayout + TopNav + Sidebar chrome.
   Persists created assignments to localStorage so they appear in
   CourseInterior, CalendarPage, and AssignmentGrading.
   ═══════════════════════════════════════════════════════════════════ */

import { useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { PageLayout } from '@/components/PageLayout';
import { Sidebar } from '@/components/Sidebar';
import { CreateAssignmentForm, type AssignmentFormData } from '@/components/CreateAssignmentForm';
import { toast } from 'sonner';
import { COURSE_STUDENT_COUNTS } from '@/utils/studentData';

function lookupCourseCode(id: string) {
    try {
        const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        const f = s.find((c: { id: string; code?: string }) => c.id === id);
        if (f?.code) return f.code;
    } catch { /* ignore */ }
    return id;
}

/** Build a payload compatible with CourseInterior / AssignmentGrading */
function buildPayload(data: AssignmentFormData, courseId: string, published: boolean) {
    const langLabel = data.language === 'python' ? 'Python' : 'Java';
    return {
        id: `a-${Date.now()}`,
        name: data.name.trim() || 'Untitled Assignment',
        language: langLabel,
        dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        submissions: 0,
        totalStudents: COURSE_STUDENT_COUNTS[courseId] ?? 42,
        gradedCount: 0,
        published,
        courseId,
        // Extended metadata (used by grading page & reports)
        createdDate: new Date().toISOString().slice(0, 10),
        totalPoints: data.maxPoints,
        description: data.description || '',
        instructions: '',
        allowedAttempts: data.maxAttempts,
        latePolicy: data.allowLateSubmissions
            ? `${data.latePenaltyAmount ?? 10}% deduction per day`
            : 'No late submissions',
        aiDetection: data.aiDetectionEnabled,
        plagiarismDetection: data.plagiarismEnabled,
        rubric: data.rubric.map((c) => ({
            name: c.name,
            description: c.description,
            maxPoints: c.maxPoints,
            gradingMethod: c.gradingMethod,
        })),
        isGroupAssignment: data.isGroup,
    };
}

/** Persist to the `createdAssignments` localStorage array. */
function saveToStorage(data: AssignmentFormData, courseId: string, published: boolean) {
    const payload = buildPayload(data, courseId, published);
    try {
        const existing = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
        existing.push(payload);
        localStorage.setItem('createdAssignments', JSON.stringify(existing));
    } catch { /* ignore */ }

    // Clear the auto-save draft
    try {
        localStorage.removeItem(`autograde_assignment_draft_${courseId}`);
    } catch { /* ignore */ }
}

export function CreateAssignmentPage() {
    const router = useRouter();
    const { courseId } = useParams() as { courseId: string };
    const cid = courseId ?? '';
    const courseCode = lookupCourseCode(cid);

    const handleSaveDraft = useCallback(
        (data: AssignmentFormData) => {
            saveToStorage(data, cid, false);
            toast.success('Draft saved successfully');
        },
        [cid]
    );

    const handlePublish = useCallback(
        (data: AssignmentFormData) => {
            saveToStorage(data, cid, true);
            toast.success('Assignment published!');
            router.push(`/courses/${cid}`);
        },
        [cid, router]
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
