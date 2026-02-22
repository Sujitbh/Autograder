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
        const { data } = await api.post<BackendCourse>('/courses/', dto);
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

    /** Get enrolled students for a course. */
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
