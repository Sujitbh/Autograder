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
