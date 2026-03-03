/* ═══════════════════════════════════════════════════════════════════
   Auth Service — Login, logout, register, session management
   Adapted to work with the FastAPI backend response format.
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type { RegisterData, User } from '@/types';

interface BackendTokenResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
}

interface BackendUser {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at?: string;
}

function mapUser(u: BackendUser): User {
    const [firstName = '', ...rest] = (u.name ?? '').trim().split(' ');
    const lastName = rest.join(' ');
    if (u.role === 'student') {
        return {
            id: String(u.id),
            firstName: firstName || 'Student',
            lastName,
            email: u.email,
            sisUserId: '',
            sisLoginId: '',
            enrolledCourses: [],
            role: 'student',
        };
    }
    return {
        id: String(u.id),
        firstName: firstName || 'User',
        lastName,
        email: u.email,
        title: '',
        department: '',
        role: u.role === 'admin' ? 'admin' : 'faculty',
    };
}

export const authService = {
    /** Sign in with email + password. Returns user & stores token. */
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        // Backend returns { access_token, refresh_token, token_type, expires_in }
        const { data } = await api.post<BackendTokenResponse>(
            '/auth/login',
            { email, password }
        );
        if (data.access_token && typeof window !== 'undefined') {
            localStorage.setItem('autograde_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('autograde_refresh_token', data.refresh_token);
            }
        }
        // Fetch user profile after login
        const user = await authService.getCurrentUser();
        return { user, token: data.access_token };
    },

    /** Register a new account (faculty or student). */
    async register(userData: RegisterData): Promise<User> {
        // Backend returns UserOut directly
        const { data } = await api.post<BackendUser>(
            '/auth/register',
            userData
        );
        return mapUser(data);
    },

    /** Log out (clear token, invalidate session server-side). */
    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch { /* backend may not have a logout endpoint */ }
        if (typeof window !== 'undefined') {
            localStorage.removeItem('autograde_token');
            localStorage.removeItem('autograde_refresh_token');
            localStorage.removeItem('autograde_auth');
            localStorage.removeItem('autograde_current_user');
        }
    },

    /** Retrieve the currently authenticated user (from token). */
    async getCurrentUser(): Promise<User> {
        const { data } = await withRetry(() =>
            api.get<BackendUser>('/auth/me')
        );
        return mapUser(data);
    },

    /** Refresh the JWT token. */
    async refreshToken(refreshToken?: string): Promise<string> {
        const token = refreshToken || (typeof window !== 'undefined' ? localStorage.getItem('autograde_refresh_token') : null);
        const { data } = await api.post<BackendTokenResponse>(
            '/auth/refresh',
            { refresh_token: token }
        );
        if (typeof window !== 'undefined') {
            localStorage.setItem('autograde_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('autograde_refresh_token', data.refresh_token);
            }
        }
        return data.access_token;
    },
};
