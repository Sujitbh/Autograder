/* ═══════════════════════════════════════════════════════════════════
   API Service Barrel Export
   ═══════════════════════════════════════════════════════════════════ */

export { default as api } from './client';
export { AuthError, NetworkError, ValidationError, withRetry } from './client';
export { authService } from './authService';
export { courseService } from './courseService';
export { assignmentService } from './assignmentService';
export { submissionService } from './submissionService';
export { gradeService, reportService } from './gradeService';
export { adminService } from './adminService';
export { testcaseService } from './testcaseService';
export { rubricService } from './rubricService';
export { codeExecutionApiService } from './codeExecutionApiService';
export { taDashboardService } from './taDashboardService';
export * from './messageService';
