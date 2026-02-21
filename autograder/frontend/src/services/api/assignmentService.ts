/* ═══════════════════════════════════════════════════════════════════
   Assignment Service — CRUD + test-case management
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type {
    Assignment,
    CreateAssignmentDto,
    UpdateAssignmentDto,
    ApiResponse,
} from '@/types';

export const assignmentService = {
    /** List all assignments for a course. */
    async getAssignments(courseId: string): Promise<Assignment[]> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<Assignment[]>>(`/courses/${courseId}/assignments`)
        );
        return data.data;
    },

    /** Get a single assignment by ID. */
    async getAssignment(courseId: string, assignmentId: string): Promise<Assignment> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<Assignment>>(
                `/courses/${courseId}/assignments/${assignmentId}`
            )
        );
        return data.data;
    },

    /** Create a new assignment. */
    async createAssignment(dto: CreateAssignmentDto): Promise<Assignment> {
        const { data } = await api.post<ApiResponse<Assignment>>(
            `/courses/${dto.courseId}/assignments`,
            dto
        );
        return data.data;
    },

    /** Update an existing assignment. */
    async updateAssignment(
        courseId: string,
        assignmentId: string,
        dto: UpdateAssignmentDto
    ): Promise<Assignment> {
        const { data } = await api.patch<ApiResponse<Assignment>>(
            `/courses/${courseId}/assignments/${assignmentId}`,
            dto
        );
        return data.data;
    },

    /** Delete an assignment. */
    async deleteAssignment(courseId: string, assignmentId: string): Promise<void> {
        await api.delete(`/courses/${courseId}/assignments/${assignmentId}`);
    },

    /** Publish a draft assignment. */
    async publishAssignment(
        courseId: string,
        assignmentId: string
    ): Promise<Assignment> {
        const { data } = await api.post<ApiResponse<Assignment>>(
            `/courses/${courseId}/assignments/${assignmentId}/publish`
        );
        return data.data;
    },
};
