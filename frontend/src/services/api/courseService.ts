/* ═══════════════════════════════════════════════════════════════════
   Course Service — CRUD operations for courses
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type {
    Course,
    CreateCourseDto,
    UpdateCourseDto,
} from '@/types';

/** Shape returned by the FastAPI backend for a course */
interface BackendCourse {
    id: number;
    name: string;
    code: string | null;
    section: string | null;
    description: string | null;
    enrollment_code: string | null;
    enrollment_code_active: boolean;
    enrollment_policy: 'open' | 'invite' | 'code';
    is_active: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    student_count?: number;
    assignment_count?: number;
    pending_grades?: number;
}

interface BackendEnrollmentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    sis_user_id: string | null;
}

export type EnrollmentRole = 'student' | 'ta' | 'instructor';

export interface CourseEnrollment {
    id: number;
    course_id: number;
    user_id: number;
    role: EnrollmentRole;
    created_at?: string | null;
    user?: BackendEnrollmentUser;
}

export interface EnrollmentImportRow {
    row_number: number;
    name: string | null;
    email: string | null;
    sis_login_id: string | null;
    sis_user_id: string | null;
    external_id: string | null;
    status: 'enrolled' | 'already_enrolled' | 'created_and_enrolled' | 'skipped' | 'error';
    message: string | null;
}

export interface EnrollmentImportResult {
    total_rows: number;
    enrolled_count: number;
    already_enrolled_count: number;
    created_users_count: number;
    skipped_count: number;
    rows: EnrollmentImportRow[];
}

interface CreateEnrollmentPayload {
    user_id?: number;
    email?: string;
    role: EnrollmentRole;
}

/** Map a backend course to the frontend Course type */
function mapCourse(c: BackendCourse): Course {
    return {
        id: String(c.id),
        code: c.code ?? '',
        name: c.name,
        semester: 'Spring 2026',
        section: c.section ?? undefined,
        description: c.description ?? '',
        facultyId: '',
        enrollmentCode: c.enrollment_code ?? '',
        enrollmentCodeActive: c.enrollment_code_active,
        enrollmentPolicy: c.enrollment_policy ?? 'invite',
        status: c.is_active ? 'active' : 'archived',
        studentCount: c.student_count ?? 0,
        assignmentCount: c.assignment_count ?? 0,
        pendingGrades: c.pending_grades ?? 0,
        createdAt: c.created_at ?? '',
        updatedAt: c.updated_at ?? '',
    };
}

export const courseService = {
    /** Return all semesters from the database. For faculty/admin use in course creation. */
    async getSemesters(): Promise<{ id: number; name: string; is_current: boolean }[]> {
        const { data } = await withRetry(() =>
            api.get<{ id: number; name: string; is_current: boolean }[]>('/courses/semesters')
        );
        return data;
    },

    /** Return distinct (code, name) pairs from all courses for autocomplete. */
    async getCatalog(): Promise<{ code: string; name: string }[]> {
        const { data } = await withRetry(() => api.get<{ code: string; name: string }[]>('/courses/catalog'));
        return data;
    },

    /** List all courses for the authenticated user. */
    async getCourses(): Promise<Course[]> {
        const { data } = await withRetry(() =>
            api.get<BackendCourse[]>('/courses/')
        );
        return data.map(mapCourse);
    },

    /** Get a single course by ID. */
    async getCourse(courseId: string): Promise<Course> {
        const { data } = await withRetry(() =>
            api.get<BackendCourse>(`/courses/${courseId}`)
        );
        return mapCourse(data);
    },

    /** Create a new course. */
    async createCourse(dto: CreateCourseDto): Promise<Course> {
        const payload = {
            name: dto.name,
            code: dto.code,
            section: dto.section,
            description: dto.description ?? '',
            enrollment_code_active: dto.enrollmentCodeActive ?? true,
        };
        const { data } = await api.post<BackendCourse>('/courses/', payload);
        return mapCourse(data);
    },

    /** Update an existing course. */
    async updateCourse(courseId: string, dto: UpdateCourseDto): Promise<Course> {
        const payload: Record<string, unknown> = {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.code !== undefined && { code: dto.code }),
            ...(dto.section !== undefined && { section: dto.section }),
            ...(dto.description !== undefined && { description: dto.description }),
            ...(dto.enrollmentCodeActive !== undefined && { enrollment_code_active: dto.enrollmentCodeActive }),
            ...(dto.enrollmentPolicy !== undefined && { enrollment_policy: dto.enrollmentPolicy }),
        };
        const { data } = await api.put<BackendCourse>(
            `/courses/${courseId}`,
            payload
        );
        return mapCourse(data);
    },

    /** Delete a course. */
    async deleteCourse(courseId: string): Promise<void> {
        await api.delete(`/courses/${courseId}`);
    },

    /** Get roster entries for a course. */
    async getEnrollments(courseId: string): Promise<CourseEnrollment[]> {
        const { data } = await withRetry(() =>
            api.get<CourseEnrollment[]>(`/courses/${courseId}/enrollments`)
        );
        return data;
    },

    /** Add one member to a course roster (student/ta/instructor). */
    async addEnrollment(courseId: string, payload: CreateEnrollmentPayload): Promise<CourseEnrollment> {
        const { data } = await api.post<CourseEnrollment>(
            `/courses/${courseId}/enrollments`,
            payload
        );
        return data;
    },

    /** Update roster role for an existing enrollment. */
    async updateEnrollmentRole(
        courseId: string,
        enrollmentId: number,
        role: 'student' | 'ta' | 'instructor'
    ): Promise<CourseEnrollment> {
        const { data } = await api.patch<CourseEnrollment>(
            `/courses/${courseId}/enrollments/${enrollmentId}`,
            { role }
        );
        return data;
    },

    /** Remove a member from the course roster. */
    async removeEnrollment(courseId: string, enrollmentId: number): Promise<void> {
        await api.delete(`/courses/${courseId}/enrollments/${enrollmentId}`);
    },

    /** Enroll a student via enrollment code. */
    async enrollStudent(enrollmentCode: string): Promise<CourseEnrollment> {
        const { data } = await api.post<CourseEnrollment>(
            '/courses/enroll',
            { enrollmentCode }
        );
        return data;
    },

    /** Import a roster file and bulk-enroll members. */
    async importEnrollmentsFromFile(
        courseId: string,
        payload: {
            file: File;
            role?: EnrollmentRole;
            createMissingUsers?: boolean;
            defaultDomain?: string;
        }
    ): Promise<EnrollmentImportResult> {
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('role', payload.role ?? 'student');
        formData.append('create_missing_users', String(payload.createMissingUsers ?? true));
        formData.append('default_domain', payload.defaultDomain ?? 'warhawks.ulm.edu');

        const { data } = await api.post<EnrollmentImportResult>(
            `/courses/${courseId}/enrollments/import`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data;
    },
};
