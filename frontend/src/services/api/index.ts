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
