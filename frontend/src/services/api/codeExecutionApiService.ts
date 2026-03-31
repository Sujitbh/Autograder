import api from './client';

export interface ExecuteCodeFile {
  name: string;
  content: string;
}

export interface ExecuteCodeRequest {
  code: string;
  language: string;
  stdin_input?: string;
  timeout?: number;
  compile_only?: boolean;
  assignment_id?: number;
  entry_filename?: string;
  files?: ExecuteCodeFile[];
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

  async compile(params: ExecuteCodeRequest): Promise<ExecuteCodeResponse> {
    const { data } = await api.post<ExecuteCodeResponse>('/grading/compile', params);
    return data;
  },
};
