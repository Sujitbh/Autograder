import api, { withRetry } from './client';

export interface BackendRubric {
    id: number;
    assignment_id: number;
    name: string;
    description: string | null;
    weight: number | null;
    max_points: number | null;
    order?: number | null;
}

export const rubricService = {
    async getAssignmentRubrics(assignmentId: string | number): Promise<BackendRubric[]> {
        const { data } = await withRetry(() =>
            api.get<BackendRubric[]>(`/rubrics/?assignment_id=${assignmentId}`)
        );
        return data;
    },
};
