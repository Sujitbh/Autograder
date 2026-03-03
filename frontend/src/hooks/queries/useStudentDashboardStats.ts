import { useQuery } from '@tanstack/react-query';
import api from '@/services/api/client';
<<<<<<< HEAD
import { useAuth } from '@/utils/AuthContext';

export function useStudentDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-dashboard-stats', user?.id ?? 'anonymous'],
=======

export function useStudentDashboardStats() {
  return useQuery({
    queryKey: ['student-dashboard-stats'],
>>>>>>> origin/ree_update
    queryFn: async () => {
      const { data } = await api.get('/student-dashboard/stats');
      return data;
    },
<<<<<<< HEAD
    enabled: !!user,
    refetchOnMount: 'always',
=======
>>>>>>> origin/ree_update
    staleTime: 60 * 1000,
  });
}
