/* ═══════════════════════════════════════════════════════════════════
   React Query Hooks — Submissions
   ═══════════════════════════════════════════════════════════════════ */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@/services/api';
import type { SubmitCodeDto, GradeSubmissionDto } from '@/types';

// ── Queries ─────────────────────────────────────────────────────────

export function useSubmissions(assignmentId: string | undefined) {
    return useQuery({
        queryKey: ['submissions', assignmentId],
        queryFn: () => submissionService.getSubmissions(assignmentId!),
        enabled: !!assignmentId,
    });
}

export function useSubmission(submissionId: string | undefined) {
    return useQuery({
        queryKey: ['submission', submissionId],
        queryFn: () => submissionService.getSubmission(submissionId!),
        enabled: !!submissionId,
    });
}

export function useSubmissionsForGrading(courseId: number | undefined, assignmentId?: number) {
    return useQuery({
        queryKey: ['submissions-for-grading', courseId, assignmentId],
        queryFn: () => submissionService.getSubmissionsForGrading(courseId!, assignmentId),
        enabled: !!courseId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

// ── Mutations ───────────────────────────────────────────────────────

export function useSubmitCode() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (dto: SubmitCodeDto) => submissionService.submitCode(dto),
        onSuccess: (submission) => {
            qc.invalidateQueries({
                queryKey: ['submissions', submission.assignmentId],
            });
        },
    });
}

export function useGradeSubmission() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (dto: GradeSubmissionDto) =>
            submissionService.gradeSubmission(dto),
        onSuccess: (_updated, dto) => {
            // Optimistically update the individual submission cache
            qc.invalidateQueries({ queryKey: ['submission', dto.submissionId] });
            qc.invalidateQueries({ queryKey: ['submissions'] });
            // Also refresh grades
            qc.invalidateQueries({ queryKey: ['grades'] });
        },
    });
}

export function useOverrideSubmissionScore() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            submissionId,
            score,
            maxScore,
            feedback,
        }: {
            submissionId: string;
            score: number;
            maxScore: number;
            feedback?: string;
        }) =>
            submissionService.overrideSubmissionScore(submissionId, {
                score,
                max_score: maxScore,
                feedback,
            }),
        onSuccess: () => {
            // Invalidate all relevant queries to refresh data
            qc.invalidateQueries({ queryKey: ['submissions'] });
            qc.invalidateQueries({ queryKey: ['submission'] });
            qc.invalidateQueries({ queryKey: ['assignments'] });
            qc.invalidateQueries({ queryKey: ['submissions-for-grading'] });
            qc.invalidateQueries({ queryKey: ['grades'] });
        },
    });
}
