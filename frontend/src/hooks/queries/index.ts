/* ═══════════════════════════════════════════════════════════════════
   React Query Hooks — Barrel export
   ═══════════════════════════════════════════════════════════════════ */

export {
    useCourses,
    useCourse,
    useCreateCourse,
    useUpdateCourse,
    useDeleteCourse,
    useTACourses,
    useStudentCourses,
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
    useSubmissionsForGrading,
    useOverrideSubmissionScore,
} from './useSubmissions';

export {
    useGrades,
    useStudentReport,
    useCourseAnalytics,
    useUpdateGrade,
    useExportGrades,
} from './useGrades';
