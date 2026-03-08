/* ═══════════════════════════════════════════════════════════════════
   Admin Service — Admin-only API operations
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';

// ── Types ──────────────────────────────────────────────────────────

export interface AdminStats {
  total_users: number;
  total_courses: number;
  total_assignments: number;
  total_submissions: number;
  active_users: number;
  users_by_role: { student: number; faculty: number; admin: number };
}

export interface ActivityItem {
  id: string;
  type: 'registration' | 'submission' | 'course_created' | 'enrollment';
  description: string;
  timestamp: string | null;
  user_id?: number;
  user_name?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string | null;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}

export interface AdminCourse {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  enrollment_code: string | null;
  is_active: boolean;
  student_count: number;
  assignment_count: number;
  faculty_name: string | null;
  created_at: string | null;
}

export interface AdminSemester {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at?: string | null;
}

export interface AdminLanguage {
  id: number;
  name: string;
  file_extension: string | null;
  docker_image: string | null;
  created_at?: string | null;
}

export interface TAAssignment {
  enrollment_id: number;
  user_id: number;
  user_name: string | null;
  user_email: string | null;
  course_id: number;
  course_name: string | null;
  course_code: string | null;
  permissions: TAPermissions;
}

export interface TAPermissions {
  can_grade: boolean;
  can_view_submissions: boolean;
  can_manage_testcases: boolean;
  can_view_students: boolean;
  can_manage_assignments: boolean;
}

export interface TAInvitationAdmin {
  id: number;
  student_name: string | null;
  student_email: string | null;
  faculty_name: string | null;
  course_name: string | null;
  course_code: string | null;
  status: string;
  created_at: string | null;
  responded_at: string | null;
}

export interface AuditLogEntry {
  id: number;
  user_id: number | null;
  user_name: string;
  action: string;
  resource_type: string | null;
  resource_id: number | null;
  details: string | null;
  ip_address: string | null;
  created_at: string | null;
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
}

// ── Service ────────────────────────────────────────────────────────

export const adminService = {
  // Dashboard
  async getStats(): Promise<AdminStats> {
    const { data } = await withRetry(() => api.get<AdminStats>('/admin/stats'));
    return data;
  },

  async getActivity(limit = 20): Promise<ActivityItem[]> {
    const { data } = await withRetry(() => api.get<ActivityItem[]>('/admin/activity', { params: { limit } }));
    return data;
  },

  // Users
  async getUsers(params?: { skip?: number; limit?: number; role?: string; search?: string; is_active?: boolean }): Promise<AdminUsersResponse> {
    const { data } = await withRetry(() => api.get<AdminUsersResponse>('/admin/users', { params }));
    return data;
  },

  async updateUserRole(userId: number, role: string) {
    const { data } = await api.put(`/auth/users/${userId}/role`, { role });
    return data;
  },

  async deactivateUser(userId: number) {
    const { data } = await api.post(`/auth/users/${userId}/deactivate`);
    return data;
  },

  async activateUser(userId: number) {
    const { data } = await api.post(`/auth/users/${userId}/activate`);
    return data;
  },

  async resetUserPassword(userId: number, newPassword?: string) {
    const { data } = await api.post(`/admin/users/${userId}/reset-password`, { new_password: newPassword });
    return data;
  },

  // Courses
  async getCourses(params?: { search?: string; is_active?: boolean }): Promise<AdminCourse[]> {
    const { data } = await withRetry(() => api.get<AdminCourse[]>('/admin/courses', { params }));
    return data;
  },

  async deleteCourse(id: number): Promise<void> {
    await api.delete(`/admin/courses/${id}`);
  },

  // Semesters
  async getSemesters(): Promise<AdminSemester[]> {
    const { data } = await withRetry(() => api.get<AdminSemester[]>('/admin/semesters'));
    return data;
  },

  async createSemester(payload: { name: string; start_date: string; end_date: string; is_current?: boolean }): Promise<AdminSemester> {
    const { data } = await api.post<AdminSemester>('/admin/semesters', payload);
    return data;
  },

  async updateSemester(id: number, payload: Partial<{ name: string; start_date: string; end_date: string; is_current: boolean }>): Promise<AdminSemester> {
    const { data } = await api.put<AdminSemester>(`/admin/semesters/${id}`, payload);
    return data;
  },

  async deleteSemester(id: number): Promise<void> {
    await api.delete(`/admin/semesters/${id}`);
  },

  // Languages
  async getLanguages(): Promise<AdminLanguage[]> {
    const { data } = await withRetry(() => api.get<AdminLanguage[]>('/admin/languages'));
    return data;
  },

  async createLanguage(payload: { name: string; file_extension?: string; docker_image?: string }): Promise<AdminLanguage> {
    const { data } = await api.post<AdminLanguage>('/admin/languages', payload);
    return data;
  },

  async updateLanguage(id: number, payload: Partial<{ name: string; file_extension: string; docker_image: string }>): Promise<AdminLanguage> {
    const { data } = await api.put<AdminLanguage>(`/admin/languages/${id}`, payload);
    return data;
  },

  async deleteLanguage(id: number): Promise<void> {
    await api.delete(`/admin/languages/${id}`);
  },

  // TA Management
  async getTAAssignments(): Promise<TAAssignment[]> {
    const { data } = await withRetry(() => api.get<TAAssignment[]>('/admin/ta/assignments'));
    return data;
  },

  async assignTA(payload: { user_email: string; course_id: number; permissions?: Partial<TAPermissions> }): Promise<TAAssignment> {
    const { data } = await api.post<TAAssignment>('/admin/ta/assign', payload);
    return data;
  },

  async removeTA(enrollmentId: number): Promise<void> {
    await api.delete(`/admin/ta/assignments/${enrollmentId}`);
  },

  async getTAPermissions(enrollmentId: number): Promise<TAPermissions & { enrollment_id: number }> {
    const { data } = await withRetry(() => api.get(`/admin/ta/assignments/${enrollmentId}/permissions`));
    return data;
  },

  async updateTAPermissions(enrollmentId: number, permissions: Partial<TAPermissions>): Promise<TAPermissions & { enrollment_id: number }> {
    const { data } = await api.put(`/admin/ta/assignments/${enrollmentId}/permissions`, permissions);
    return data;
  },

  async getTAInvitations(): Promise<TAInvitationAdmin[]> {
    const { data } = await withRetry(() => api.get<TAInvitationAdmin[]>('/admin/ta/invitations'));
    return data;
  },

  // Audit Log
  async getAuditLogs(params?: { skip?: number; limit?: number; action?: string; user_id?: number }): Promise<AuditLogsResponse> {
    const { data } = await withRetry(() => api.get<AuditLogsResponse>('/admin/audit-logs', { params }));
    return data;
  },

  // System Settings
  async getSettings(): Promise<Record<string, Record<string, string>>> {
    const { data } = await withRetry(() => api.get('/admin/settings'));
    return data;
  },

  async updateSettings(payload: Record<string, string>): Promise<void> {
    await api.put('/admin/settings', payload);
  },
};
