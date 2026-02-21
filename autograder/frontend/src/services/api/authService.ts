/* ═══════════════════════════════════════════════════════════════════
   Auth Service — Login, logout, register, session management
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type { Faculty, Student, RegisterData, ApiResponse, User } from '@/types';

export const authService = {
    /** Sign in with email + password. Returns user & stores token. */
    async login(email: string, password: string): Promise<User> {
        const { data } = await api.post<ApiResponse<{ user: User; token: string }>>(
            '/auth/login',
            { email, password }
        );
        if (data.data.token && typeof window !== 'undefined') {
            localStorage.setItem('autograde_token', data.data.token);
        }
        return data.data.user;
    },

    /** Register a new account (faculty or student). */
    async register(userData: RegisterData): Promise<User> {
        const { data } = await api.post<ApiResponse<{ user: User; token: string }>>(
            '/auth/register',
            userData
        );
        if (data.data.token && typeof window !== 'undefined') {
            localStorage.setItem('autograde_token', data.data.token);
        }
        return data.data.user;
    },

    /** Log out (clear token, invalidate session server-side). */
    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('autograde_token');
                localStorage.removeItem('autograde_auth');
                localStorage.removeItem('autograde_current_user');
            }
        }
    },

    /** Retrieve the currently authenticated user (from token). */
    async getCurrentUser(): Promise<User> {
        const { data } = await withRetry(() =>
            api.get<ApiResponse<User>>('/auth/me')
        );
        return data.data;
    },

    /** Refresh the JWT token. */
    async refreshToken(): Promise<string> {
        const { data } = await api.post<ApiResponse<{ token: string }>>(
            '/auth/refresh'
        );
        if (typeof window !== 'undefined') {
            localStorage.setItem('autograde_token', data.data.token);
        }
        return data.data.token;
    },
};
