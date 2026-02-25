/* ═══════════════════════════════════════════════════════════════════
   React Query Hooks — Submissions
   ═══════════════════════════════════════════════════════════════════ */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@/services/api';
import type { SubmitCodeDto, GradeSubmissionDto } from '@/types';
import type { SubmissionRecord, ManualScoreDto } from '@/services/api/submissionService';

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

export function useUploadFiles() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ assignmentId, files }: { assignmentId: string; files: File[] }) =>
            submissionService.uploadFiles(assignmentId, files),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: ['submissions', variables.assignmentId] });
        },
    });
}

export function useManualScore() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ submissionId, dto }: { submissionId: number; dto: ManualScoreDto }) =>
            submissionService.manualScore(submissionId, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['submissions'] });
        },
    });
}

export function useGradeSubmission() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (dto: GradeSubmissionDto) =>
            submissionService.gradeSubmission(dto),
        onSuccess: (updated) => {
            qc.setQueryData(['submission', updated.id], updated);
            qc.invalidateQueries({
                queryKey: ['submissions', updated.assignmentId],
            });
            qc.invalidateQueries({ queryKey: ['grades'] });
        },
    });
}
