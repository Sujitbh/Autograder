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
    description: string | null;
    enrollment_code: string | null;
    enrollment_code_active: boolean;
    is_active: boolean;
    created_at?: string | null;
    updated_at?: string | null;
}

interface BackendEnrollmentUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface CourseEnrollment {
    id: number;
    course_id: number;
    user_id: number;
    role: 'student' | 'ta' | 'instructor';
    created_at?: string | null;
    user?: BackendEnrollmentUser;
}

interface CreateEnrollmentPayload {
    user_id?: number;
    email?: string;
    role: 'student' | 'ta' | 'instructor';
}

/** Map a backend course to the frontend Course type */
function mapCourse(c: BackendCourse): Course {
    return {
        id: String(c.id),
        code: c.code ?? '',
        name: c.name,
        semester: 'Spring 2026',
        description: c.description ?? '',
        facultyId: '',
        enrollmentCode: c.enrollment_code ?? '',
        enrollmentCodeActive: c.enrollment_code_active,
        status: c.is_active ? 'active' : 'archived',
        studentCount: 0,
        assignmentCount: 0,
        pendingGrades: 0,
        createdAt: c.created_at ?? '',
        updatedAt: c.updated_at ?? '',
    };
}

export const courseService = {
    /** List all courses for the authenticated user. */
    async getCourses(): Promise<Course[]> {
        const { data } = await withRetry(() =>
            api.get<BackendCourse[]>('/courses/')
        );
        return data.map(mapCourse);
    },

    /** Get courses for current user filtered by enrollment role. */
    async getMyCoursesByRole(role?: 'student' | 'ta' | 'instructor'): Promise<Course[]> {
        const params = role ? { role } : {};
        const { data } = await withRetry(() =>
            api.get<BackendCourse[]>('/courses/me', { params })
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
            description: dto.description ?? '',
            enrollment_code_active: dto.enrollmentCodeActive ?? true,
        };
        const { data } = await api.post<BackendCourse>('/courses/', payload);
        return mapCourse(data);
    },

    /** Update an existing course. */
    async updateCourse(courseId: string, dto: UpdateCourseDto): Promise<Course> {
        const { data } = await api.put<BackendCourse>(
            `/courses/${courseId}`,
            dto
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

    /** Get students in a course for TA/instructor viewing. */
    async getStudentsForTA(courseId: string | number): Promise<Array<{ id: number; name: string; email: string }>> {
        const { data } = await withRetry(() =>
            api.get<Array<{ id: number; name: string; email: string }>>(`/courses/${courseId}/ta-students`)
        );
        return data;
    },
};
