import api from './client';

// ── Shared types ──────────────────────────────────────────────────────

export interface DashboardCourseRef {
    id: number;
    name: string;
    code: string;
}

export interface DashboardActivityItem {
    kind:
        | 'grade'
        | 'assignment'
        | 'announcement'
        | 'graded'
        | 'submission';
    title: string;
    subtitle?: string | null;
    course?: DashboardCourseRef | null;
    at: string | null;
    link: string;
}

// ── Student ───────────────────────────────────────────────────────────

export interface StudentDashboardStats {
    due_this_week: number;
    missing: number;
    graded_recently: number;
    average_grade: number | null;
}

export type StudentTodoItem =
    | {
          kind: 'upcoming';
          assignment_id: number;
          title: string;
          course: DashboardCourseRef | null;
          due_date: string | null;
      }
    | {
          kind: 'missing';
          assignment_id: number;
          title: string;
          course: DashboardCourseRef | null;
          due_date: string | null;
      }
    | {
          kind: 'graded';
          assignment_id: number;
          title: string;
          course: DashboardCourseRef | null;
          submission_id: number;
          score: number | null;
          max_score: number | null;
          graded_at: string | null;
      };

export interface StudentDashboardCourseCard {
    id: number;
    name: string;
    code: string;
    assignments_count: number;
    completed_count: number;
    average_score: number | null;
}

export interface StudentDashboardFeed {
    greeting: { name: string; role: string };
    stats: StudentDashboardStats;
    todos: StudentTodoItem[];
    activity: DashboardActivityItem[];
    courses: StudentDashboardCourseCard[];
    generated_at: string | null;
}

// ── Faculty ───────────────────────────────────────────────────────────

export interface FacultyDashboardStats {
    to_grade: number;
    drafts: number;
    closing_soon: number;
    total_students: number;
}

export type FacultyTodoItem =
    | {
          kind: 'to_grade';
          assignment_id: number;
          title: string;
          course: DashboardCourseRef | null;
          count: number;
          due_date: string | null;
      }
    | {
          kind: 'draft';
          assignment_id: number;
          title: string;
          course: DashboardCourseRef | null;
          due_date: string | null;
      }
    | {
          kind: 'closing';
          assignment_id: number;
          title: string;
          course: DashboardCourseRef | null;
          due_date: string | null;
      };

export interface FacultyDashboardCourseCard {
    id: number;
    name: string;
    code: string;
    student_count: number;
    published_count: number;
    draft_count: number;
}

export interface FacultyDashboardFeed {
    greeting: { name: string; role: string };
    stats: FacultyDashboardStats;
    todos: FacultyTodoItem[];
    activity: DashboardActivityItem[];
    courses: FacultyDashboardCourseCard[];
    generated_at: string | null;
}

// ── Service ───────────────────────────────────────────────────────────

export const dashboardService = {
    async getStudentFeed(): Promise<StudentDashboardFeed> {
        const { data } = await api.get<StudentDashboardFeed>('/student-dashboard/feed');
        return data;
    },
    async getFacultyFeed(): Promise<FacultyDashboardFeed> {
        const { data } = await api.get<FacultyDashboardFeed>('/faculty-dashboard/feed');
        return data;
    },
};
