import { useQuery } from '@tanstack/react-query';
import api from '@/services/api/client';

export function useStudentDashboardStats() {
  return useQuery({
    queryKey: ['student-dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/student-dashboard/stats');
      return data;
    },
    staleTime: 0,
  });
}
