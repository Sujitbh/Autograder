/* ═══════════════════════════════════════════════════════════════════
   React Query Hooks — Barrel export
   ═══════════════════════════════════════════════════════════════════ */

export {
    useCourses,
    useCourse,
    useCreateCourse,
    useUpdateCourse,
    useDeleteCourse,
} from './useCourses';

export {
    useAssignments,
    useAllAssignments,
    useAssignment,
    useCreateAssignment,
    useUpdateAssignment,
    useDeleteAssignment,
} from './useAssignments';

export {
    useSubmissions,
    useSubmission,
    useSubmitCode,
    useGradeSubmission,
} from './useSubmissions';

export {
    useGrades,
    useStudentReport,
    useCourseAnalytics,
    useUpdateGrade,
    useExportGrades,
} from './useGrades';

export {
    useAdminStats,
    useAdminActivity,
    useAdminUsers,
    useUpdateUserRole,
    useToggleUserActive,
    useResetPassword,
    useAdminCourses,
    useAdminSemesters,
    useCreateSemester,
    useUpdateSemester,
    useDeleteSemester,
    useAdminLanguages,
    useCreateLanguage,
    useUpdateLanguage,
    useDeleteLanguage,
    useAdminTAAssignments,
    useAdminTAInvitations,
    useAdminAuditLogs,
    useAdminSettings,
    useUpdateAdminSettings,
} from './useAdmin';

export {
    useAssignmentTestCases,
} from './useTestCases';

export {
    useTAStatus,
    useTAOverview,
    useTAPermissions,
    useTACoursePermissions,
    useTACourseAssignments,
    useTACourseSubmissions,
    useTASubmissionDetail,
    useTAGradeSubmission,
    useTACourseStudents,
    useTAGradebook,
} from './useTADashboard';
