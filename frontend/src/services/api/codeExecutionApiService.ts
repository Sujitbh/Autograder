import api from './client';

export interface ExecuteCodeRequest {
  code: string;
  language: string;
  stdin_input?: string;
  timeout?: number;
}

export interface ExecuteCodeResponse {
  status: string;
  stdout: string;
  stderr: string;
  exit_code: number;
  execution_time_ms: number;
}

export const codeExecutionApiService = {
  async execute(params: ExecuteCodeRequest): Promise<ExecuteCodeResponse> {
    const { data } = await api.post<ExecuteCodeResponse>('/grading/execute', params);
    return data;
  },
};
