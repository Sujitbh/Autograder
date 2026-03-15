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
  display_max_score?: number | null;
  feedback?: string | null;
  graded_at?: string | null;
  created_at?: string | null;
  student?: { id: number; name: string; email?: string | null } | null;
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
  const resolvedMax = s.max_score ?? s.display_max_score ?? 100;
  return {
    id: String(s.id),
    assignmentId: String(s.assignment_id),
    studentId: String(s.student_id),
    studentName: s.student?.name,
    studentEmail: s.student?.email ?? undefined,
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
          maxScore: resolvedMax,
          percentage:
            resolvedMax > 0
              ? Number(((s.score / resolvedMax) * 100).toFixed(2))
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

    // Use fetch directly to avoid axios Content-Type header interference with FormData
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('autograde_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let response: Response;
    try {
      response = await fetch(
        `${api.defaults.baseURL}/submissions/assignments/${assignmentId}/upload`,
        {
          method: 'POST',
          headers,
          body: formData,
        }
      );
    } catch {
      throw new Error('Could not reach the server. Please check your connection and try again.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const detail = errData.detail;
      const message = typeof detail === 'string' ? detail : Array.isArray(detail) ? detail.map((d: any) => d.msg).join(', ') : `Upload failed (${response.status})`;
      throw new Error(message);
    }

    return response.json();
  },

  /** Get a specific submission. */
  async getSubmission(submissionId: string): Promise<Submission> {
    const { data } = await withRetry(() =>
      api.get<BackendSubmission>(`/submissions/${submissionId}`)
    );
    return mapSubmission(data);
  },
  /** Get full submission detail including file contents and test results. */
  async getSubmissionDetail(submissionId: string): Promise<{
    id: number;
    status: string;
    score: number | null;
    max_score: number | null;
    feedback: string | null;
    submitted_at: string | null;
    attempt_number: number;
    student: { id: number; name: string; email: string | null };
    assignment: { id: number; title: string; max_points: number | null; due_date: string | null; language: string };
    rubrics: Array<{ id: number; name: string; description: string | null; max_points: number; weight: number | null; order: number }>;
    files: Array<{ id: number; filename: string; content: string | null }>;
    results: Array<{
      testcase_id: number;
      test_name: string;
      passed: boolean;
      actual_output: string;
      expected_output: string;
      execution_time_ms: number;
      points: number;
      points_earned: number;
      error: string | null;
    }>;
    integrity?: {
      plagiarism: {
        checked_against: number;
        top_matches: Array<{
          submission_id: number;
          student_id: number;
          student_name: string;
          student_email: string | null;
          status: string;
          submitted_at: string | null;
          filename: string | null;
          similarity_percent: number;
          risk: 'low' | 'medium' | 'high';
        }>;
        note: string;
      };
      ai_detection: {
        score: number;
        band: 'low' | 'medium' | 'high';
        signals: string[];
        disclaimer: string;
      };
    } | null;
  }> {
    const { data } = await withRetry(() =>
      api.get(`/submissions/${submissionId}/detail`)
    );
    return data;
  },
  /** Get files for a submission. */
  async getSubmissionFiles(submissionId: string): Promise<Array<{ id: number; filename: string; file_size: number | null }>> {
    const { data } = await withRetry(() =>
      api.get<Array<{ id: number; filename: string; file_size: number | null }>>(`/submissions/${submissionId}/files`)
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

  /** Run ONLY test cases for a submission (no rubric). */
  async runTests(submissionId: string): Promise<any> {
    const { data } = await api.post(
      `/grading/submissions/${submissionId}/grade?run_tests=true&apply_rubric=false`
    );
    return data;
  },

  /** Auto-grade a submission (tests + rubric). */
  async autoGrade(submissionId: string): Promise<any> {
    const { data } = await api.post(
      `/grading/submissions/${submissionId}/grade?run_tests=true&apply_rubric=true`
    );
    return data;
  },

  /** Grade ALL pending submissions for an assignment. */
  async gradeAllSubmissions(assignmentId: string): Promise<any> {
    const { data } = await api.post(
      `/grading/assignments/${assignmentId}/grade-all`
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
};
