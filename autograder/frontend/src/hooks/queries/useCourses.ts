/* ═══════════════════════════════════════════════════════════════════
   React Query Hooks — Courses
   ═══════════════════════════════════════════════════════════════════ */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/api';
import type { Course, CreateCourseDto, UpdateCourseDto } from '@/types';

// ── Queries ─────────────────────────────────────────────────────────

export function useCourses() {
    return useQuery({
        queryKey: ['courses'],
        queryFn: () => courseService.getCourses(),
        staleTime: 5 * 60 * 1000,
    });
}

export function useCourse(courseId: string | undefined) {
    return useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => courseService.getCourse(courseId!),
        enabled: !!courseId,
    });
}

// ── Mutations ───────────────────────────────────────────────────────

export function useCreateCourse() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateCourseDto) => courseService.createCourse(dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
        },
    });
}

export function useUpdateCourse() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, dto }: { courseId: string; dto: UpdateCourseDto }) =>
            courseService.updateCourse(courseId, dto),
        onSuccess: (_data, { courseId }) => {
            qc.invalidateQueries({ queryKey: ['courses'] });
            qc.invalidateQueries({ queryKey: ['courses', courseId] });
        },
    });
}

export function useDeleteCourse() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => courseService.deleteCourse(courseId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
        },
    });
}
