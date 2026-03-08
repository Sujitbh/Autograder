/* ═══════════════════════════════════════════════════════════════════
   React Query Hooks — Admin
   ═══════════════════════════════════════════════════════════════════ */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/api/adminService';
import type { TAPermissions } from '@/services/api/adminService';

// ── Dashboard ─────────────────────────────────────────────────────

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats(),
    staleTime: 30_000,
  });
}

export function useAdminActivity(limit = 20) {
  return useQuery({
    queryKey: ['admin', 'activity', limit],
    queryFn: () => adminService.getActivity(limit),
    staleTime: 30_000,
  });
}

// ── Users ─────────────────────────────────────────────────────────

export function useAdminUsers(params?: { skip?: number; limit?: number; role?: string; search?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminService.getUsers(params),
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, activate }: { userId: number; activate: boolean }) =>
      activate ? adminService.activateUser(userId) : adminService.deactivateUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: number; newPassword?: string }) =>
      adminService.resetUserPassword(userId, newPassword),
  });
}

// ── Courses ───────────────────────────────────────────────────────

export function useAdminCourses(params?: { search?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: ['admin', 'courses', params],
    queryFn: () => adminService.getCourses(params),
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });
}

export function useDeleteAdminCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// ── Semesters ─────────────────────────────────────────────────────

export function useAdminSemesters() {
  return useQuery({
    queryKey: ['admin', 'semesters'],
    queryFn: () => adminService.getSemesters(),
  });
}

export function useCreateSemester() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; start_date: string; end_date: string; is_current?: boolean }) =>
      adminService.createSemester(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'semesters'] }),
  });
}

export function useUpdateSemester() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; name?: string; start_date?: string; end_date?: string; is_current?: boolean }) =>
      adminService.updateSemester(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'semesters'] }),
  });
}

export function useDeleteSemester() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteSemester(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'semesters'] }),
  });
}

// ── Languages ─────────────────────────────────────────────────────

export function useAdminLanguages() {
  return useQuery({
    queryKey: ['admin', 'languages'],
    queryFn: () => adminService.getLanguages(),
  });
}

export function useCreateLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; file_extension?: string; docker_image?: string }) =>
      adminService.createLanguage(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'languages'] }),
  });
}

export function useUpdateLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; name?: string; file_extension?: string; docker_image?: string }) =>
      adminService.updateLanguage(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'languages'] }),
  });
}

export function useDeleteLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteLanguage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'languages'] }),
  });
}

// ── TA Management ─────────────────────────────────────────────────

export function useAdminTAAssignments() {
  return useQuery({
    queryKey: ['admin', 'ta', 'assignments'],
    queryFn: () => adminService.getTAAssignments(),
  });
}

export function useAssignTA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { user_email: string; course_id: number; permissions?: Partial<TAPermissions> }) =>
      adminService.assignTA(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'ta', 'assignments'] });
    },
  });
}

export function useRemoveTA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: number) => adminService.removeTA(enrollmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'ta', 'assignments'] });
    },
  });
}

export function useUpdateTAPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, permissions }: { enrollmentId: number; permissions: Partial<TAPermissions> }) =>
      adminService.updateTAPermissions(enrollmentId, permissions),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'ta', 'assignments'] });
    },
  });
}

export function useAdminTAInvitations() {
  return useQuery({
    queryKey: ['admin', 'ta', 'invitations'],
    queryFn: () => adminService.getTAInvitations(),
  });
}

// ── Audit Log ─────────────────────────────────────────────────────

export function useAdminAuditLogs(params?: { skip?: number; limit?: number; action?: string; user_id?: number }) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => adminService.getAuditLogs(params),
  });
}

// ── System Settings ───────────────────────────────────────────────

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getSettings(),
  });
}

export function useUpdateAdminSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, string>) => adminService.updateSettings(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'settings'] }),
  });
}
