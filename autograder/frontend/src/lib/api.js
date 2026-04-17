/**
 * API Service for Autograder Backend
 * Provides typed methods for all API endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL ?? ''

function getAuthHeader() {
  const token = localStorage.getItem('token')
  if (token) return { Authorization: `Bearer ${token}` }
  return {}
}

/**
 * Base fetch wrapper with auth and error handling
 */
export async function apiFetch(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const headers = opts.headers || {}
  const auth = getAuthHeader()
  const final = {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...auth, ...headers },
  }
  const res = await fetch(url, final)
  return res
}

/**
 * Helper to parse JSON response with error handling
 */
async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// ==================== Auth API ====================

export const authApi = {
  async login(email, password) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return handleResponse(res)
  },

  async register(name, email, password) {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    return handleResponse(res)
  },

  async refreshToken(refreshToken) {
    const res = await apiFetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    return handleResponse(res)
  },

  async getMe() {
    const res = await apiFetch('/api/auth/me')
    return handleResponse(res)
  },

  async updateProfile(data) {
    const res = await apiFetch('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async changePassword(currentPassword, newPassword) {
    const res = await apiFetch('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    })
    return handleResponse(res)
  },
}

// ==================== Assignments API ====================

export const assignmentsApi = {
  async list() {
    const res = await apiFetch('/api/assignments/')
    return handleResponse(res)
  },

  async get(id) {
    const res = await apiFetch(`/api/assignments/${id}`)
    return handleResponse(res)
  },

  async create(data) {
    const res = await apiFetch('/api/assignments/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async update(id, data) {
    const res = await apiFetch(`/api/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async delete(id) {
    const res = await apiFetch(`/api/assignments/${id}`, { method: 'DELETE' })
    return handleResponse(res)
  },
}

// ==================== Courses API ====================

export const coursesApi = {
  async list() {
    const res = await apiFetch('/api/courses/')
    return handleResponse(res)
  },

  async get(id) {
    const res = await apiFetch(`/api/courses/${id}`)
    return handleResponse(res)
  },

  async create(data) {
    const res = await apiFetch('/api/courses/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async update(id, data) {
    const res = await apiFetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async delete(id) {
    const res = await apiFetch(`/api/courses/${id}`, { method: 'DELETE' })
    return handleResponse(res)
  },
}

// ==================== Submissions API ====================

export const submissionsApi = {
  async list() {
    const res = await apiFetch('/api/submissions/')
    return handleResponse(res)
  },

  async get(id) {
    const res = await apiFetch(`/api/submissions/${id}`)
    return handleResponse(res)
  },

  async create(assignmentId, studentId) {
    const res = await apiFetch('/api/submissions/', {
      method: 'POST',
      body: JSON.stringify({ assignment_id: assignmentId, student_id: studentId }),
    })
    return handleResponse(res)
  },

  async uploadFiles(assignmentId, files) {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE}/api/submissions/assignments/${assignmentId}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    return handleResponse(res)
  },

  async delete(id) {
    const res = await apiFetch(`/api/submissions/${id}`, { method: 'DELETE' })
    return handleResponse(res)
  },
}

// ==================== Grading API ====================

export const gradingApi = {
  async executeCode(code, language, stdinInput = '', timeout = 10) {
    const res = await apiFetch('/api/grading/execute', {
      method: 'POST',
      body: JSON.stringify({
        code,
        language,
        stdin_input: stdinInput,
        timeout,
      }),
    })
    return handleResponse(res)
  },

  async gradeSubmission(submissionId, runTests = true, applyRubric = true) {
    const res = await apiFetch(`/api/grading/submissions/${submissionId}/grade?run_tests=${runTests}&apply_rubric=${applyRubric}`, {
      method: 'POST',
    })
    return handleResponse(res)
  },

  async getResults(submissionId) {
    const res = await apiFetch(`/api/grading/submissions/${submissionId}/results`)
    return handleResponse(res)
  },

  async getAssignmentStats(assignmentId) {
    const res = await apiFetch(`/api/grading/assignments/${assignmentId}/stats`)
    return handleResponse(res)
  },

  async gradeAll(assignmentId) {
    const res = await apiFetch(`/api/grading/assignments/${assignmentId}/grade-all`, {
      method: 'POST',
    })
    return handleResponse(res)
  },
}

// ==================== Test Cases API ====================

export const testcasesApi = {
  async list() {
    const res = await apiFetch('/api/testcases/')
    return handleResponse(res)
  },

  async get(id) {
    const res = await apiFetch(`/api/testcases/${id}`)
    return handleResponse(res)
  },

  async create(data) {
    const res = await apiFetch('/api/testcases/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async update(id, data) {
    const res = await apiFetch(`/api/testcases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async delete(id) {
    const res = await apiFetch(`/api/testcases/${id}`, { method: 'DELETE' })
    return handleResponse(res)
  },
}

// ==================== Rubrics API ====================

export const rubricsApi = {
  async list() {
    const res = await apiFetch('/api/rubrics/')
    return handleResponse(res)
  },

  async get(id) {
    const res = await apiFetch(`/api/rubrics/${id}`)
    return handleResponse(res)
  },

  async create(data) {
    const res = await apiFetch('/api/rubrics/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async update(id, data) {
    const res = await apiFetch(`/api/rubrics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async delete(id) {
    const res = await apiFetch(`/api/rubrics/${id}`, { method: 'DELETE' })
    return handleResponse(res)
  },
}

export default API_BASE

