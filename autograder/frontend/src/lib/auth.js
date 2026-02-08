export function setToken(token) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function getToken() {
  return localStorage.getItem('token')
}

export function setRole(role) {
  if (role) localStorage.setItem('role', role)
  else localStorage.removeItem('role')
}

export function getRole() {
  return localStorage.getItem('role')
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}
