import api, { withRetry } from './client';

export interface BackendTestCase {
  id: number;
  assignment_id: number;
  name: string | null;
  input_data: string | null;
  expected_output: string | null;
  is_public: boolean;
  points: number;
}

export const testcaseService = {
  async getAssignmentTestCases(assignmentId: string | number): Promise<BackendTestCase[]> {
    const { data } = await withRetry(() =>
      api.get<BackendTestCase[]>(`/testcases/by-assignment/${assignmentId}`)
    );
    return data;
  },
};
