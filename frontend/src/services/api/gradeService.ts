/* ═══════════════════════════════════════════════════════════════════
   Grade Service — Fetch / export grades
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type { Grade, ApiResponse, CourseAnalytics, StudentReport } from '@/types';

export const gradeService = {
    /** Get all grades for a course (faculty view). */
    async getGrades(courseId: string): Promise<Grade[]> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<Grade[]>>(`/courses/${courseId}/grades`)
        );
        return data.data;
    },

    /** Update a single grade. */
    async updateGrade(gradeId: string, update: Partial<Grade>): Promise<Grade> {
        const { data } = await api.patch<ApiResponse<Grade>>(
            `/grades/${gradeId}`,
            update
        );
        return data.data;
    },

    /** Export grades as CSV / Excel / PDF. */
    async exportGrades(
        courseId: string,
        format: 'csv' | 'excel' | 'pdf' | 'canvas'
    ): Promise<Blob> {
        const { data } = await api.get(`/courses/${courseId}/grades/export`, {
            params: { format },
            responseType: 'blob',
        });
        return data;
    },
};

export const reportService = {
    /** Get an individual student report for a course. */
    async getStudentReport(
        courseId: string,
        studentId: string
    ): Promise<StudentReport> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<StudentReport>>(
                `/courses/${courseId}/reports/student/${studentId}`
            )
        );
        return data.data;
    },

    /** Get aggregate course analytics. */
    async getCourseAnalytics(courseId: string): Promise<CourseAnalytics> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<CourseAnalytics>>(
                `/courses/${courseId}/reports/analytics`
            )
        );
        return data.data;
    },
};
