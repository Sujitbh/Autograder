import { useQuery } from '@tanstack/react-query';
import { rubricService } from '@/services/api/rubricService';

export function useAssignmentRubrics(assignmentId: string | number) {
    return useQuery({
        queryKey: ['rubrics', 'assignment', assignmentId],
        queryFn: () => rubricService.getAssignmentRubrics(assignmentId),
        enabled: !!assignmentId,
    });
}
