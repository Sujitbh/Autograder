const API_BASE = import.meta.env.VITE_API_URL ?? ''

function getAuthHeader() {
  const token = localStorage.getItem('token')
  if (token) return { Authorization: `Bearer ${token}` }
  return {}
}

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

export default API_BASE
