/* ═══════════════════════════════════════════════════════════════════
   Course Service — CRUD operations for courses
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type {
    Course,
    CreateCourseDto,
    UpdateCourseDto,
    ApiResponse,
    PaginatedResponse,
    Enrollment,
} from '@/types';

export const courseService = {
    /** List all courses for the authenticated user. */
    async getCourses(): Promise<Course[]> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<Course[]>>('/courses')
        );
        return data.data;
    },

    /** Get a single course by ID. */
    async getCourse(courseId: string): Promise<Course> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<Course>>(`/courses/${courseId}`)
        );
        return data.data;
    },

    /** Create a new course. */
    async createCourse(dto: CreateCourseDto): Promise<Course> {
        const { data } = await api.post<ApiResponse<Course>>('/courses', dto);
        return data.data;
    },

    /** Update an existing course. */
    async updateCourse(courseId: string, dto: UpdateCourseDto): Promise<Course> {
        const { data } = await api.patch<ApiResponse<Course>>(
            `/courses/${courseId}`,
            dto
        );
        return data.data;
    },

    /** Delete a course (soft-delete / archive). */
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
            api.get<ApiResponse<PaginatedResponse<Enrollment>>>(
                `/courses/${courseId}/enrollments`,
                { params: { page, pageSize } }
            )
        );
        return data.data;
    },

    /** Enroll a student via enrollment code. */
    async enrollStudent(enrollmentCode: string): Promise<Enrollment> {
        const { data } = await api.post<ApiResponse<Enrollment>>(
            '/courses/enroll',
            { enrollmentCode }
        );
        return data.data;
    },
};
