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
        onSuccess: (updated) => {
            // Optimistically update the individual submission cache
            qc.setQueryData(['submission', updated.id], updated);
            qc.invalidateQueries({
                queryKey: ['submissions', updated.assignmentId],
            });
            // Also refresh grades
            qc.invalidateQueries({ queryKey: ['grades'] });
        },
    });
}
