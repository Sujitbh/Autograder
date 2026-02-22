/* ═══════════════════════════════════════════════════════════════════
   React Query Hooks — Assignments
   ═══════════════════════════════════════════════════════════════════ */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '@/services/api';
import type { CreateAssignmentDto, UpdateAssignmentDto } from '@/types';

// ── Queries ─────────────────────────────────────────────────────────

export function useAssignments(courseId: string | undefined) {
    return useQuery({
        queryKey: ['assignments', courseId],
        queryFn: () => assignmentService.getAssignments(courseId!),
        enabled: !!courseId,
    });
}

export function useAssignment(
    courseId: string | undefined,
    assignmentId: string | undefined
) {
    return useQuery({
        queryKey: ['assignments', courseId, assignmentId],
        queryFn: () => assignmentService.getAssignment(courseId!, assignmentId!),
        enabled: !!courseId && !!assignmentId,
    });
}

// ── Mutations ───────────────────────────────────────────────────────

export function useCreateAssignment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateAssignmentDto) =>
            assignmentService.createAssignment(dto),
        onSuccess: (newAssignment) => {
            qc.invalidateQueries({
                queryKey: ['assignments', newAssignment.courseId],
            });
        },
    });
}

export function useUpdateAssignment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            courseId,
            assignmentId,
            dto,
        }: {
            courseId: string;
            assignmentId: string;
            dto: UpdateAssignmentDto;
        }) => assignmentService.updateAssignment(courseId, assignmentId, dto),
        onSuccess: (_data, { courseId }) => {
            qc.invalidateQueries({ queryKey: ['assignments', courseId] });
        },
    });
}

export function useDeleteAssignment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            courseId,
            assignmentId,
        }: {
            courseId: string;
            assignmentId: string;
        }) => assignmentService.deleteAssignment(courseId, assignmentId),
        onSuccess: (_data, { courseId }) => {
            qc.invalidateQueries({ queryKey: ['assignments', courseId] });
        },
    });
}
