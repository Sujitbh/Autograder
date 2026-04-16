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

export interface UpsertTestCaseInput {
  assignmentId: string | number;
  name?: string;
  input?: string;
  expectedOutput?: string;
  isPublic: boolean;
  points?: number;
}

export const testcaseService = {
  async getAssignmentTestCases(assignmentId: string | number): Promise<BackendTestCase[]> {
    const { data } = await withRetry(() =>
      api.get<BackendTestCase[]>(`/testcases/by-assignment/${assignmentId}`)
    );
    return data;
  },

  async createTestCase(input: UpsertTestCaseInput): Promise<BackendTestCase> {
    const payload = {
      assignment_id: Number(input.assignmentId),
      name: input.name ?? null,
      input_data: input.input ?? null,
      expected_output: input.expectedOutput ?? null,
      is_public: input.isPublic,
      points: input.points ?? 1,
    };
    const { data } = await withRetry(() => api.post<BackendTestCase>('/testcases/', payload));
    return data;
  },

  async deleteTestCase(testCaseId: number): Promise<void> {
    await withRetry(() => api.delete(`/testcases/${testCaseId}`));
  },

  async replaceAssignmentTestCases(
    assignmentId: string | number,
    testCases: Array<{
      name?: string;
      input?: string;
      expectedOutput?: string;
      isPublic: boolean;
      points?: number;
    }>
  ): Promise<void> {
    const existing = await this.getAssignmentTestCases(assignmentId);
    await Promise.all(existing.map((tc) => this.deleteTestCase(tc.id)));
    await Promise.all(
      testCases.map((tc) =>
        this.createTestCase({
          assignmentId,
          name: tc.name,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isPublic: tc.isPublic,
          points: tc.points ?? 1,
        })
      )
    );
  },
};
