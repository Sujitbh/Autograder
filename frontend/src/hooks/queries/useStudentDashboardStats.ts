import { useQuery } from '@tanstack/react-query';
import api from '@/services/api/client';
import { useAuth } from '@/utils/AuthContext';

export function useStudentDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-dashboard-stats', user?.id ?? 'anonymous'],
    queryFn: async () => {
      const { data } = await api.get('/student-dashboard/stats');
      return data;
    },
    enabled: !!user,
    refetchOnMount: 'always',
    staleTime: 60 * 1000,
  });
}
