/* ═══════════════════════════════════════════════════════════════════
   Submission Service — Submit code, fetch submissions
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type {
    Submission,
    SubmitCodeDto,
    GradeSubmissionDto,
    ApiResponse,
    PaginatedResponse,
} from '@/types';

export const submissionService = {
    /** Submit code for grading. */
    async submitCode(dto: SubmitCodeDto): Promise<Submission> {
        const { data } = await api.post<ApiResponse<Submission>>(
            `/assignments/${dto.assignmentId}/submissions`,
            dto
        );
        return data.data;
    },

    /** Get a specific submission. */
    async getSubmission(submissionId: string): Promise<Submission> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<Submission>>(`/submissions/${submissionId}`)
        );
        return data.data;
    },

    /** List all submissions for an assignment (faculty view). */
    async getSubmissions(
        assignmentId: string,
        page = 1,
        pageSize = 50
    ): Promise<PaginatedResponse<Submission>> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<PaginatedResponse<Submission>>>(
                `/assignments/${assignmentId}/submissions`,
                { params: { page, pageSize } }
            )
        );
        return data.data;
    },

    /** Faculty: grade a submission. */
    async gradeSubmission(dto: GradeSubmissionDto): Promise<Submission> {
        const { data } = await api.post<ApiResponse<Submission>>(
            `/submissions/${dto.submissionId}/grade`,
            dto
        );
        return data.data;
    },

    /** Get submission history for a student on an assignment. */
    async getStudentSubmissions(
        assignmentId: string,
        studentId: string
    ): Promise<Submission[]> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<Submission[]>>(
                `/assignments/${assignmentId}/submissions`,
                { params: { studentId } }
            )
        );
        return data.data;
    },
};
