import api from './client';

// ── Types ──────────────────────────────────────────────────────────

export interface TAPermissions {
    can_grade: boolean;
    can_view_submissions: boolean;
    can_run_tests: boolean;
    can_view_plagiarism: boolean;
    can_manage_assignments: boolean;
    can_manage_testcases: boolean;
    can_view_private_tests: boolean;
    can_view_students: boolean;
    can_manage_groups: boolean;
    can_contact_students: boolean;
    can_access_reports: boolean;
    can_export_grades: boolean;
    can_view_rubrics: boolean;
    can_edit_rubrics: boolean;
}

export interface TACourse {
    id: number;
    name: string;
    code: string;
    description: string | null;
    is_active: boolean;
    instructor_name: string | null;
    student_count: number;
    assignment_count: number;
    pending_grading: number;
    enrollment_id: number;
    permissions: TAPermissions;
}

export interface TAOverview {
    assigned_courses: number;
    pending_grading: number;
    graded_this_week: number;
    total_students: number;
    courses: TACourse[];
}

export interface TAAssignment {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    max_submissions: number | null;
    allowed_languages: string | null;
    is_active: boolean;
    total_students: number;
    total_submissions: number;
    graded_count: number;
    pending_count: number;
    rubric_count: number;
    testcase_count: number;
    course_name: string | null;
    course_code: string | null;
    permissions: TAPermissions;
}

export interface TASubmission {
    id: number;
    student_id: number;
    student_name: string;
    student_email: string | null;
    assignment_id: number;
    assignment_title: string;
    status: string;
    score: number | null;
    max_score: number | null;
    feedback: string | null;
    tests_passed: number;
    tests_total: number;
    created_at: string | null;
}

export interface TASubmissionDetail {
    id: number;
    student: { id: number; name: string; email: string | null };
    assignment: {
        id: number;
        title: string;
        due_date: string | null;
        max_submissions: number | null;
        allowed_languages: string | null;
    };
    status: string;
    score: number | null;
    max_score: number | null;
    feedback: string | null;
    created_at: string | null;
    attempt_number: number;
    files: Array<{
        id: number;
        filename: string;
        content: string | null;
        file_size: number | null;
    }>;
    test_results: Array<{
        id: number;
        testcase_id: number | null;
        testcase_name: string | null;
        input_data: string | null;
        expected_output: string | null;
        passed: boolean;
        output: string | null;
        error_output: string | null;
        points_awarded: number | null;
        execution_time_ms: number | null;
    }>;
    rubrics: Array<{
        id: number;
        name: string;
        description: string | null;
        weight: number | null;
        max_points: number | null;
        order: number | null;
    }>;
    permissions: TAPermissions;
}

export interface TAStudent {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    submissions_count: number;
    total_assignments: number;
    average_grade: number | null;
}

export interface TAGradebookEntry {
    id: number;
    name: string;
    email: string;
    grades: Record<string, { score: number; max_score: number; submission_id: number } | null>;
    total_earned: number;
    total_possible: number;
}

export interface TAGradebook {
    course: { id: number; name: string; code: string } | null;
    assignments: Array<{ id: number; title: string; max_points: number; due_date: string | null }>;
    students: TAGradebookEntry[];
}

// ── Service ─────────────────────────────────────────────────────────

export const taDashboardService = {
    // Status check
    async getStatus(): Promise<{ is_ta: boolean; ta_course_count: number }> {
        const { data } = await api.get('/ta-dashboard/status');
        return data;
    },

    // Overview
    async getOverview(): Promise<TAOverview> {
        const { data } = await api.get('/ta-dashboard/overview');
        return data;
    },

    // Permissions
    async getPermissions(): Promise<Record<number, TAPermissions>> {
        const { data } = await api.get('/ta-dashboard/permissions');
        return data;
    },

    async getCoursePermissions(courseId: number): Promise<TAPermissions> {
        const { data } = await api.get(`/ta-dashboard/courses/${courseId}/permissions`);
        return data;
    },

    // Assignments
    async getCourseAssignments(courseId: number, params?: { search?: string; status?: string }): Promise<TAAssignment[]> {
        const { data } = await api.get(`/ta-dashboard/courses/${courseId}/assignments`, { params });
        return data;
    },

    // Submissions
    async getCourseSubmissions(
        courseId: number,
        params?: { assignment_id?: number; status?: string; search?: string; skip?: number; limit?: number }
    ): Promise<{ submissions: TASubmission[]; total: number }> {
        const { data } = await api.get(`/ta-dashboard/courses/${courseId}/submissions`, { params });
        return data;
    },

    // Single submission
    async getSubmissionDetail(courseId: number, submissionId: number): Promise<TASubmissionDetail> {
        const { data } = await api.get(`/ta-dashboard/courses/${courseId}/submissions/${submissionId}`);
        return data;
    },

    // Grade
    async gradeSubmission(
        courseId: number,
        submissionId: number,
        payload: { score?: number; max_score?: number; feedback?: string; is_draft?: boolean }
    ): Promise<{ id: number; status: string; score: number | null; message: string }> {
        const { data } = await api.post(`/ta-dashboard/courses/${courseId}/submissions/${submissionId}/grade`, payload);
        return data;
    },

    // Run tests against a submission
    async runTests(courseId: number, submissionId: number): Promise<{
        submission_id: number;
        total_testcases: number;
        passed_testcases: number;
        total_points: number;
        earned_points: number;
        score_percentage: number;
        results: Array<{
            id: number;
            testcase_id: number | null;
            testcase_name: string | null;
            is_public: boolean | null;
            input_data: string | null;
            expected_output: string | null;
            passed: boolean;
            output: string | null;
            error_output: string | null;
            points_awarded: number | null;
            execution_time_ms: number | null;
        }>;
    }> {
        const { data } = await api.post(`/ta-dashboard/courses/${courseId}/submissions/${submissionId}/run-tests`);
        return data;
    },

    // Auto-grade a submission (tests + rubric)
    async autoGrade(courseId: number, submissionId: number): Promise<{
        submission_id: number;
        status: string;
        score: number | null;
        max_score: number | null;
        feedback: string | null;
        percentage: number;
        message: string;
        stored_results: Array<{
            id: number;
            testcase_id: number | null;
            testcase_name: string | null;
            input_data: string | null;
            expected_output: string | null;
            passed: boolean;
            output: string | null;
            error_output: string | null;
            points_awarded: number | null;
            execution_time_ms: number | null;
        }>;
    }> {
        const { data } = await api.post(`/ta-dashboard/courses/${courseId}/submissions/${submissionId}/auto-grade`);
        return data;
    },

    // Get test cases for an assignment
    async getTestCases(courseId: number, assignmentId: number): Promise<Array<{
        id: number;
        name: string | null;
        input_data: string | null;
        expected_output: string | null;
        is_public: boolean;
        points: number;
        timeout_seconds: number | null;
    }>> {
        const { data } = await api.get(`/ta-dashboard/courses/${courseId}/assignments/${assignmentId}/testcases`);
        return data;
    },

    // Students
    async getCourseStudents(courseId: number, params?: { search?: string }): Promise<TAStudent[]> {
        const { data } = await api.get(`/ta-dashboard/courses/${courseId}/students`, { params });
        return data;
    },

    // Gradebook
    async getCourseGradebook(courseId: number): Promise<TAGradebook> {
        const { data } = await api.get(`/ta-dashboard/courses/${courseId}/gradebook`);
        return data;
    },
};
