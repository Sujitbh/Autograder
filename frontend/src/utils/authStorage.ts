const REMEMBER_KEY = 'autograde_remember';
const SESSION_MARKER = 'autograde_session_active';
const AUTH_KEYS = ['autograde_token', 'autograde_refresh_token', 'autograde_current_user', 'autograde_auth'];

export function setRememberMe(value: boolean) {
  if (value) {
    localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

/**
 * Always returns localStorage.
 * Auth data lives in one place; session expiry is handled on mount via checkSession().
 */
export function getStore(): Storage {
  return localStorage;
}

/**
 * Called once on app mount. If "remember me" was NOT checked and the browser
 * was closed (sessionStorage marker is gone), wipe auth so the user must log in again.
 */
export function checkSession() {
  if (typeof window === 'undefined') return;

  const remembered = localStorage.getItem(REMEMBER_KEY) === 'true';
  const sessionAlive = sessionStorage.getItem(SESSION_MARKER) === 'true';

  if (!remembered && !sessionAlive) {
    for (const key of AUTH_KEYS) {
      localStorage.removeItem(key);
    }
  }

  sessionStorage.setItem(SESSION_MARKER, 'true');
}

/** Clear all auth keys from localStorage + remove the remember/session flags. */
export function clearAllAuth() {
  for (const key of AUTH_KEYS) {
    localStorage.removeItem(key);
  }
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(SESSION_MARKER);
}
