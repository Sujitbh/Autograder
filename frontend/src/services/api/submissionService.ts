/* ═══════════════════════════════════════════════════════════════════
   Submission Service — upload/fetch/grade submissions
   Backed by FastAPI routes under /submissions, /grading, /faculty
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type { Submission, SubmitCodeDto, GradeSubmissionDto } from '@/types';

interface BackendSubmission {
  id: number;
  assignment_id: number;
  student_id: number;
  status: 'pending' | 'grading' | 'graded' | 'error';
  score?: number | null;
  max_score?: number | null;
  feedback?: string | null;
  graded_at?: string | null;
  created_at?: string | null;
}

interface BackendUploadResponse {
  submission_id: number;
  assignment_id: number;
  student: string;
  files_saved: number;
  folder: string;
}

interface BackendGradingResults {
  submission_id: number;
  status: string;
  score?: number | null;
  max_score?: number | null;
  feedback?: string | null;
  graded_at?: string | null;
}

function mapSubmission(s: BackendSubmission): Submission {
  return {
    id: String(s.id),
    assignmentId: String(s.assignment_id),
    studentId: String(s.student_id),
    code: '',
    language: 'python',
    submittedAt: s.created_at ?? '',
    isLate: false,
    status: s.status === 'graded' ? 'graded' : 'pending',
    grade:
      s.score != null
        ? {
            id: `grade-${s.id}`,
            submissionId: String(s.id),
            rubricScores: [],
            totalScore: s.score,
            maxScore: s.max_score ?? 100,
            percentage:
              s.max_score && s.max_score > 0
                ? Number(((s.score / s.max_score) * 100).toFixed(2))
                : 0,
            letterGrade: '',
            feedback: s.feedback ?? '',
            gradedAt: s.graded_at ?? '',
            gradedBy: '',
          }
        : undefined,
  };
}

export const submissionService = {
  /** Legacy fallback: create submission row without files. */
  async submitCode(dto: SubmitCodeDto): Promise<Submission> {
    const payload = { assignment_id: Number(dto.assignmentId) };
    const { data } = await api.post<BackendSubmission>('/submissions/', payload);
    return mapSubmission(data);
  },

  /** Student file upload (multipart/form-data with field name `files`). */
  async uploadFiles(assignmentId: string, files: File[]): Promise<BackendUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const { data } = await api.post<BackendUploadResponse>(
      `/submissions/assignments/${assignmentId}/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  /** Get a specific submission. */
  async getSubmission(submissionId: string): Promise<Submission> {
    const { data } = await withRetry(() =>
      api.get<BackendSubmission>(`/submissions/${submissionId}`)
    );
    return mapSubmission(data);
  },

  /** Get files for a submission. */
  async getSubmissionFiles(submissionId: string): Promise<Array<{id: number; filename: string; file_size: number | null}>> {
    const { data } = await withRetry(() =>
      api.get<Array<{id: number; filename: string; file_size: number | null}>>(`/submissions/${submissionId}/files`)
    );
    return data;
  },

  /** Download a single file. */
  async downloadFile(fileId: number): Promise<Blob> {
    const { data } = await api.get(`/submissions/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return data;
  },

  /** List submissions for an assignment. */
  async getSubmissions(assignmentId: string): Promise<Submission[]> {
    const { data } = await withRetry(() =>
      api.get<BackendSubmission[]>(`/submissions/assignments/${assignmentId}`)
    );
    return data.map(mapSubmission);
  },

  /** Run grading for a submission. */
  async gradeSubmission(dto: GradeSubmissionDto): Promise<BackendGradingResults> {
    const { data } = await api.post<BackendGradingResults>(
      `/grading/submissions/${dto.submissionId}/grade`
    );
    return data;
  },

  /** Manual score entry/override by instructor/TA. */
  async overrideSubmissionScore(
    submissionId: string,
    payload: { score: number; max_score?: number; feedback?: string }
  ): Promise<BackendGradingResults> {
    const { data } = await api.patch<BackendGradingResults>(
      `/grading/submissions/${submissionId}/score`,
      payload
    );
    return data;
  },

  /** Fetch grading results/details for one submission. */
  async getSubmissionResults(submissionId: string): Promise<BackendGradingResults> {
    const { data } = await withRetry(() =>
      api.get<BackendGradingResults>(`/grading/submissions/${submissionId}/results`)
    );
    return data;
  },

  /** Instructor/TA ZIP download of all submissions for assignment. */
  async downloadAssignmentZip(assignmentId: string): Promise<Blob> {
    const { data } = await api.get(`/faculty/assignments/${assignmentId}/download-zip`, {
      responseType: 'blob',
    });
    return data;
  },

  /** Student history helper; backend already filters by auth user role. */
  async getStudentSubmissions(assignmentId: string, _studentId: string): Promise<Submission[]> {
    return this.getSubmissions(assignmentId);
  },

  /** Get all submissions in a course for TA/instructor grading view. */
  async getSubmissionsForGrading(courseId: number, assignmentId?: number): Promise<any[]> {
    const params = assignmentId ? { assignment_id: assignmentId } : {};
    const { data } = await withRetry(() =>
      api.get<any[]>(`/submissions/courses/${courseId}/for-grading`, { params })
    );
    return data;
  },
};
