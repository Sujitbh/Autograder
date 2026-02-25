/* ═══════════════════════════════════════════════════════════════════
   Course Service — CRUD operations for courses
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type {
    Course,
    CreateCourseDto,
    UpdateCourseDto,
    PaginatedResponse,
    Enrollment,
} from '@/types';

/** Shape returned by the FastAPI backend for a course */
interface BackendCourse {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
}

/** Shape returned by /courses/{id}/members */
export interface CourseMember {
    user_id: number;
    name: string;
    email: string;
    role: string;
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
        enrollmentCode: '',
        enrollmentCodeActive: true,
        status: 'active',
        studentCount: 0,
        assignmentCount: 0,
        pendingGrades: 0,
        createdAt: '',
        updatedAt: '',
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

    /** Get a single course by ID. */
    async getCourse(courseId: string): Promise<Course> {
        const { data } = await withRetry(() =>
            api.get<BackendCourse>(`/courses/${courseId}`)
        );
        return mapCourse(data);
    },

    /** Create a new course. */
    async createCourse(dto: CreateCourseDto): Promise<Course> {
        const { data } = await api.post<BackendCourse>('/courses/', {
            name: dto.name,
            code: dto.code,
            description: dto.description,
        });
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

    /** List members (students, TAs, instructors) enrolled in a course. */
    async getMembers(courseId: string): Promise<CourseMember[]> {
        const { data } = await api.get<CourseMember[]>(`/courses/${courseId}/members`);
        return data;
    },

    /**
     * Add a user to a course by email.
     * @param role - 'student' | 'ta' | 'instructor'
     */
    async addMember(courseId: string, email: string, role: 'student' | 'ta' | 'instructor'): Promise<void> {
        await api.post(`/courses/${courseId}/members`, { email, role });
    },

    /** Remove a user from a course. */
    async removeMember(courseId: string, userId: number): Promise<void> {
        await api.delete(`/courses/${courseId}/members/${userId}`);
    },

    /** Get enrolled students for a course (legacy — kept for compatibility). */
    async getEnrollments(
        courseId: string,
        page = 1,
        pageSize = 50
    ): Promise<PaginatedResponse<Enrollment>> {
        const { data } = await withRetry(() =>
            api.get<PaginatedResponse<Enrollment>>(
                `/courses/${courseId}/enrollments`,
                { params: { page, pageSize } }
            )
        );
        return data;
    },

    /** Enroll a student via enrollment code. */
    async enrollStudent(enrollmentCode: string): Promise<Enrollment> {
        const { data } = await api.post<Enrollment>(
            '/courses/enroll',
            { enrollmentCode }
        );
        return data;
    },
};
