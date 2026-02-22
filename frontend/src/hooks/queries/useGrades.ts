/* ═══════════════════════════════════════════════════════════════════
   React Query Hooks — Grades & Reports
   ═══════════════════════════════════════════════════════════════════ */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService, reportService } from '@/services/api';
import type { Grade } from '@/types';

// ── Queries ─────────────────────────────────────────────────────────

export function useGrades(courseId: string | undefined) {
    return useQuery({
        queryKey: ['grades', courseId],
        queryFn: () => gradeService.getGrades(courseId!),
        enabled: !!courseId,
    });
}

export function useStudentReport(
    courseId: string | undefined,
    studentId: string | undefined
) {
    return useQuery({
        queryKey: ['report', courseId, studentId],
        queryFn: () => reportService.getStudentReport(courseId!, studentId!),
        enabled: !!courseId && !!studentId,
    });
}

export function useCourseAnalytics(courseId: string | undefined) {
    return useQuery({
        queryKey: ['analytics', courseId],
        queryFn: () => reportService.getCourseAnalytics(courseId!),
        enabled: !!courseId,
    });
}

// ── Mutations ───────────────────────────────────────────────────────

export function useUpdateGrade() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            gradeId,
            update,
        }: {
            gradeId: string;
            update: Partial<Grade>;
        }) => gradeService.updateGrade(gradeId, update),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['grades'] });
        },
    });
}

export function useExportGrades() {
    return useMutation({
        mutationFn: ({
            courseId,
            format,
        }: {
            courseId: string;
            format: 'csv' | 'excel' | 'pdf' | 'canvas';
        }) => gradeService.exportGrades(courseId, format),
        onSuccess: (blob, { format }) => {
            // Trigger browser download
            const ext = format === 'excel' ? 'xlsx' : format;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `grades.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
        },
    });
}
