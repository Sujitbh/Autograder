import { useQuery } from '@tanstack/react-query';
import { testcaseService } from '@/services/api/testcaseService';

export function useAssignmentTestCases(assignmentId: string | number) {
  return useQuery({
    queryKey: ['testcases', 'assignment', assignmentId],
    queryFn: () => testcaseService.getAssignmentTestCases(assignmentId),
    enabled: !!assignmentId,
  });
}
