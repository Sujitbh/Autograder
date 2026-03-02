/* ═══════════════════════════════════════════════════════════════════
   TA Service — Manage Grading Assistant invitations
   ═══════════════════════════════════════════════════════════════════ */

import api from './client';
import type { ApiResponse } from '@/types';

interface TAInvitation {
    id: number;
    course_id: number;
    student_id: number;
    faculty_id: number;
    status: 'pending' | 'accepted' | 'declined';
    created_at: string;
    responded_at?: string;
}

interface TAInvitationWithDetails extends TAInvitation {
    course_name: string;
    course_code: string;
    instructor_name: string;
    student_name: string;
}

export const taService = {
    /** Faculty: Invite a student to become a TA. */
    async inviteTA(courseId: number, studentId: number): Promise<TAInvitation> {
        const { data } = await api.post<TAInvitation>(
            `/ta/courses/${courseId}/invite`,
            { student_id: studentId }
        );
        return data;
    },

    /** Faculty: Get all TA invitations for a course. */
    async getCourseInvitations(courseId: number): Promise<TAInvitation[]> {
        const { data } = await api.get<TAInvitation[]>(
            `/ta/courses/${courseId}/invitations`
        );
        return data;
    },

    /** Student: Get all pending TA invitations. */
    async getMyInvitations(): Promise<TAInvitationWithDetails[]> {
        const { data } = await api.get<TAInvitationWithDetails[]>(
            `/ta/me/invitations`
        );
        return data;
    },

    /** Student: Accept a TA invitation. */
    async acceptInvitation(invitationId: number): Promise<TAInvitation> {
        const { data } = await api.post<TAInvitation>(
            `/ta/invitations/${invitationId}/respond`,
            { action: 'accept' }
        );
        return data;
    },

    /** Student: Decline a TA invitation. */
    async declineInvitation(invitationId: number): Promise<TAInvitation> {
        const { data } = await api.post<TAInvitation>(
            `/ta/invitations/${invitationId}/respond`,
            { action: 'decline' }
        );
        return data;
    },
};
