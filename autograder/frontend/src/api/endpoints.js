import api from './axios'

// ============ AUTH ============
export const authAPI = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  register: (name, email, password) =>
    api.post('/api/auth/register', { name, email, password }),

  me: () => api.get('/api/auth/me'),

  refresh: (refreshToken) =>
    api.post('/api/auth/refresh', { refresh_token: refreshToken }),

  updateProfile: (data) => api.put('/api/auth/me', data),

  changePassword: (currentPassword, newPassword) =>
    api.post('/api/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    }),

  // Admin only
  getUsers: () => api.get('/api/auth/users'),
  
  getUser: (userId) => api.get(`/api/auth/users/${userId}`),
  
  updateUserRole: (userId, role) =>
    api.put(`/api/auth/users/${userId}/role`, { role }),
  
  activateUser: (userId) =>
    api.post(`/api/auth/users/${userId}/activate`),
  
  deactivateUser: (userId) =>
    api.post(`/api/auth/users/${userId}/deactivate`),
}

// ============ COURSES ============
export const coursesAPI = {
  list: () => api.get('/api/courses/'),
  
  get: (id) => api.get(`/api/courses/${id}`),
  
  create: (data) => api.post('/api/courses/', data),
  
  update: (id, data) => api.put(`/api/courses/${id}`, data),
  
  delete: (id) => api.delete(`/api/courses/${id}`),
  
  getStudents: (id) => api.get(`/api/courses/${id}/students`),
  
  enrollStudent: (courseId, studentId) =>
    api.post(`/api/courses/${courseId}/students/${studentId}`),
}

// ============ ASSIGNMENTS ============
export const assignmentsAPI = {
  list: (params = {}) => api.get('/api/assignments/', { params }),
  
  get: (id) => api.get(`/api/assignments/${id}`),
  
  create: (data) => api.post('/api/assignments/', data),
  
  update: (id, data) => api.put(`/api/assignments/${id}`, data),
  
  delete: (id) => api.delete(`/api/assignments/${id}`),
}

// ============ SUBMISSIONS ============
export const submissionsAPI = {
  list: (params = {}) => api.get('/api/submissions/', { params }),
  
  get: (id) => api.get(`/api/submissions/${id}`),
  
  getByAssignment: (assignmentId) =>
    api.get(`/api/submissions/assignments/${assignmentId}`),
  
  upload: (assignmentId, files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    return api.post(`/api/submissions/assignments/${assignmentId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  getFiles: (submissionId) =>
    api.get(`/api/submissions/${submissionId}/files`),
  
  downloadFile: (submissionId, fileId) =>
    api.get(`/api/submissions/${submissionId}/files/${fileId}/download`, {
      responseType: 'blob',
    }),
}

// ============ GRADING ============
export const gradingAPI = {
  executeCode: (code, language, input = '', timeout = 10) =>
    api.post('/api/grading/execute', { code, language, input, timeout }),
  
  gradeSubmission: (submissionId) =>
    api.post(`/api/grading/submissions/${submissionId}/grade`),
  
  getResults: (submissionId) =>
    api.get(`/api/grading/submissions/${submissionId}/results`),
  
  getAssignmentStats: (assignmentId) =>
    api.get(`/api/grading/assignments/${assignmentId}/stats`),
  
  gradeAll: (assignmentId) =>
    api.post(`/api/grading/assignments/${assignmentId}/grade-all`),
}

// ============ TEST CASES ============
export const testcasesAPI = {
  list: (assignmentId) =>
    api.get(`/api/testcases/assignments/${assignmentId}`),
  
  get: (id) => api.get(`/api/testcases/${id}`),
  
  create: (data) => api.post('/api/testcases/', data),
  
  update: (id, data) => api.put(`/api/testcases/${id}`, data),
  
  delete: (id) => api.delete(`/api/testcases/${id}`),
}

// ============ RUBRICS ============
export const rubricsAPI = {
  list: (assignmentId) =>
    api.get(`/api/rubrics/assignments/${assignmentId}`),
  
  get: (id) => api.get(`/api/rubrics/${id}`),
  
  create: (data) => api.post('/api/rubrics/', data),
  
  update: (id, data) => api.put(`/api/rubrics/${id}`, data),
  
  delete: (id) => api.delete(`/api/rubrics/${id}`),
}

// ============ FACULTY DOWNLOADS ============
export const facultyAPI = {
  downloadAssignmentZip: (assignmentId) =>
    api.get(`/api/faculty/assignments/${assignmentId}/download-zip`, {
      responseType: 'blob',
    }),
}

export default {
  auth: authAPI,
  courses: coursesAPI,
  assignments: assignmentsAPI,
  submissions: submissionsAPI,
  grading: gradingAPI,
  testcases: testcasesAPI,
  rubrics: rubricsAPI,
  faculty: facultyAPI,
}
