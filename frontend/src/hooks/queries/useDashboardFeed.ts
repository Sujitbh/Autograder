import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/api';
import type {
    StudentDashboardFeed,
    FacultyDashboardFeed,
} from '@/services/api';

/**
 * Dashboard feeds are user-scoped and somewhat expensive (they aggregate
 * assignments/submissions/messages). We cache for 30s and refetch on
 * window focus, matching the UX of the rest of the app.
 */
export function useStudentFeed(enabled: boolean = true) {
    return useQuery<StudentDashboardFeed>({
        queryKey: ['dashboard', 'student', 'feed'],
        queryFn: () => dashboardService.getStudentFeed(),
        enabled,
        staleTime: 30_000,
    });
}

export function useFacultyFeed(enabled: boolean = true) {
    return useQuery<FacultyDashboardFeed>({
        queryKey: ['dashboard', 'faculty', 'feed'],
        queryFn: () => dashboardService.getFacultyFeed(),
        enabled,
        staleTime: 30_000,
    });
}
