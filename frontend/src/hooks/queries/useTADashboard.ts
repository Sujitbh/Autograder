import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taDashboardService } from '@/services/api/taDashboardService';

// ── Status ──────────────────────────────────────────────────────────

export function useTAStatus() {
    return useQuery({
        queryKey: ['ta-status'],
        queryFn: () => taDashboardService.getStatus(),
        staleTime: 5 * 60 * 1000,
    });
}

// ── Overview ────────────────────────────────────────────────────────

export function useTAOverview() {
    return useQuery({
        queryKey: ['ta-overview'],
        queryFn: () => taDashboardService.getOverview(),
        staleTime: 60 * 1000,
    });
}

// ── Permissions ─────────────────────────────────────────────────────

export function useTAPermissions() {
    return useQuery({
        queryKey: ['ta-permissions'],
        queryFn: () => taDashboardService.getPermissions(),
        staleTime: 5 * 60 * 1000,
    });
}

export function useTACoursePermissions(courseId: number) {
    return useQuery({
        queryKey: ['ta-permissions', courseId],
        queryFn: () => taDashboardService.getCoursePermissions(courseId),
        enabled: !!courseId,
        staleTime: 5 * 60 * 1000,
    });
}

// ── Assignments ─────────────────────────────────────────────────────

export function useTACourseAssignments(courseId: number, params?: { search?: string; status?: string }) {
    return useQuery({
        queryKey: ['ta-assignments', courseId, params],
        queryFn: () => taDashboardService.getCourseAssignments(courseId, params),
        enabled: !!courseId,
        staleTime: 60 * 1000,
    });
}

// ── Submissions ─────────────────────────────────────────────────────

export function useTACourseSubmissions(
    courseId: number,
    params?: { assignment_id?: number; status?: string; search?: string; skip?: number; limit?: number }
) {
    return useQuery({
        queryKey: ['ta-submissions', courseId, params],
        queryFn: () => taDashboardService.getCourseSubmissions(courseId, params),
        enabled: !!courseId,
        staleTime: 30 * 1000,
    });
}

export function useTASubmissionDetail(courseId: number, submissionId: number) {
    return useQuery({
        queryKey: ['ta-submission-detail', courseId, submissionId],
        queryFn: () => taDashboardService.getSubmissionDetail(courseId, submissionId),
        enabled: !!courseId && !!submissionId,
    });
}

// ── Grading ─────────────────────────────────────────────────────────

export function useTAGradeSubmission(courseId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ submissionId, payload }: {
            submissionId: number;
            payload: { score?: number; max_score?: number; feedback?: string; is_draft?: boolean };
        }) => taDashboardService.gradeSubmission(courseId, submissionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ta-submissions', courseId] });
            queryClient.invalidateQueries({ queryKey: ['ta-submission-detail', courseId] });
            queryClient.invalidateQueries({ queryKey: ['ta-overview'] });
            queryClient.invalidateQueries({ queryKey: ['ta-gradebook', courseId] });
        },
    });
}

// ── Students ────────────────────────────────────────────────────────

export function useTACourseStudents(courseId: number, params?: { search?: string }) {
    return useQuery({
        queryKey: ['ta-students', courseId, params],
        queryFn: () => taDashboardService.getCourseStudents(courseId, params),
        enabled: !!courseId,
        staleTime: 60 * 1000,
    });
}

// ── Gradebook ───────────────────────────────────────────────────────

export function useTAGradebook(courseId: number) {
    return useQuery({
        queryKey: ['ta-gradebook', courseId],
        queryFn: () => taDashboardService.getCourseGradebook(courseId),
        enabled: !!courseId,
        staleTime: 60 * 1000,
    });
}
