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

/** Enriched submission record returned by GET /submissions/assignments/{id} */
export interface SubmissionRecord {
    id: number;
    assignment_id: number;
    student_id: number;
    student_name: string;
    student_email: string;
    status: 'pending' | 'grading' | 'graded' | 'error';
    score: number | null;
    max_score: number | null;
    feedback: string | null;
    graded_at: string | null;
    created_at: string | null;
    files: { id: number; filename: string; file_size: number | null }[];
}

export interface FileContent {
    id: number;
    filename: string;
    content: string;
    file_size: number | null;
}

export interface ManualScoreDto {
    score: number;
    max_score?: number;
    feedback?: string;
}

export const submissionService = {
    /** Upload files for an assignment (student). */
    async uploadFiles(assignmentId: string, files: File[]): Promise<{
        submission_id: number;
        files_saved: number;
    }> {
        const form = new FormData();
        files.forEach((f) => form.append('files', f));
        const { data } = await api.post(
            `/submissions/assignments/${assignmentId}/upload`,
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return data;
    },

    /** Submit code for grading (legacy). */
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
            api.get<Submission>(`/submissions/${submissionId}`)
        );
        return data;
    },

    /**
     * List all submissions for an assignment.
     * Faculty/admin: all submissions. Student: own only.
     * Returns enriched records with student name/email and files.
     */
    async getSubmissions(assignmentId: string): Promise<SubmissionRecord[]> {
        const { data } = await withRetry(() =>
            api.get<SubmissionRecord[]>(`/submissions/assignments/${assignmentId}`)
        );
        return data;
    },

    /** Get student's own submissions for an assignment. */
    async getMySubmissions(assignmentId: string): Promise<SubmissionRecord[]> {
        const { data } = await withRetry(() =>
            api.get<SubmissionRecord[]>(`/submissions/assignments/${assignmentId}`)
        );
        return data;
    },

    /** Read the text content of a submitted file (faculty/TA/admin only). */
    async getFileContent(fileId: number): Promise<FileContent> {
        const { data } = await api.get<FileContent>(`/submissions/files/${fileId}/content`);
        return data;
    },

    /**
     * Manually score a submission (instructor / TA / admin).
     */
    async manualScore(submissionId: number, dto: ManualScoreDto): Promise<void> {
        await api.post(`/grading/submissions/${submissionId}/manual-score`, dto);
    },

    /** Faculty: automated grade a submission. */
    async gradeSubmission(dto: GradeSubmissionDto): Promise<Submission> {
        const { data } = await api.post<ApiResponse<Submission>>(
            `/submissions/${dto.submissionId}/grade`,
            dto
        );
        return data.data;
    },

    /** Get grading results for a submission. */
    async getGradingResults(submissionId: number): Promise<{
        status: string;
        score: number | null;
        max_score: number | null;
        feedback: string | null;
        graded_at: string | null;
    }> {
        const { data } = await api.get(`/grading/submissions/${submissionId}/results`);
        return data;
    },
};
