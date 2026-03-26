/* ═══════════════════════════════════════════════════════════════════
   Auth Service — Login, logout, register, session management
   Adapted to work with the FastAPI backend response format.
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type { RegisterData, User } from '@/types';
import { clearAllAuth } from '@/utils/authStorage';

interface BackendTokenResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
}

interface MFARequiredResponse {
    mfa_required: boolean;
    mfa_token: string;
    expires_in: number;
}

type LoginResponse = BackendTokenResponse | MFARequiredResponse;

function isMFARequired(data: LoginResponse): data is MFARequiredResponse {
    return 'mfa_required' in data && data.mfa_required === true;
}

interface BackendUser {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    profile_photo?: string | null;
    created_at?: string;
}

function photoUrl(filename?: string | null): string | undefined {
    if (!filename) return undefined;
    const base = (api.defaults.baseURL ?? '').replace(/\/+$/, '');
    return `${base}/auth/photos/${filename}`;
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
            profilePhoto: photoUrl(u.profile_photo),
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
        profilePhoto: photoUrl(u.profile_photo),
        role: u.role === 'admin' ? 'admin' : 'faculty',
    };
}

export const authService = {
    /**
     * Sign in with email + password.
     * If MFA is enabled, returns { mfaRequired, mfaToken, expiresIn }.
     * If MFA is disabled, returns { user, token }.
     */
    async login(email: string, password: string): Promise<
        { user: User; token: string; mfaRequired?: false } |
        { mfaRequired: true; mfaToken: string; expiresIn: number }
    > {
        const { data } = await api.post<LoginResponse>(
            '/auth/login',
            { email, password }
        );

        if (isMFARequired(data)) {
            return {
                mfaRequired: true,
                mfaToken: data.mfa_token,
                expiresIn: data.expires_in,
            };
        }

        if (data.access_token && typeof window !== 'undefined') {
            localStorage.setItem('autograde_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('autograde_refresh_token', data.refresh_token);
            }
        }
        const user = await authService.getCurrentUser();
        return { user, token: data.access_token, mfaRequired: false };
    },

    /** Verify OTP code and get full session tokens. */
    async verifyOtp(mfaToken: string, otpCode: string): Promise<BackendTokenResponse> {
        const { data } = await api.post<BackendTokenResponse>(
            '/auth/verify-otp',
            { mfa_token: mfaToken, otp_code: otpCode }
        );
        if (data.access_token && typeof window !== 'undefined') {
            localStorage.setItem('autograde_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('autograde_refresh_token', data.refresh_token);
            }
        }
        return data;
    },

    /** Request a new OTP code. */
    async resendOtp(mfaToken: string): Promise<{ message: string }> {
        const { data } = await api.post<{ message: string }>(
            '/auth/resend-otp',
            { mfa_token: mfaToken }
        );
        return data;
    },

    /** Register a new account (faculty or student). */
    async register(userData: RegisterData): Promise<User> {
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
            clearAllAuth();
        }
    },

    /** Retrieve the currently authenticated user (from token). */
    async getCurrentUser(): Promise<User> {
        const { data } = await withRetry(() =>
            api.get<BackendUser>('/auth/me')
        );
        return mapUser(data);
    },

    /** Upload a profile photo. Returns the updated user. */
    async uploadPhoto(file: File): Promise<User> {
        const form = new FormData();
        form.append('file', file);
        const { data } = await api.post<BackendUser>('/auth/me/photo', form);
        return mapUser(data);
    },

    /** Remove the profile photo. Returns the updated user. */
    async deletePhoto(): Promise<User> {
        const { data } = await api.delete<BackendUser>('/auth/me/photo');
        return mapUser(data);
    },

    /** Request a password reset email. */
    async forgotPassword(email: string): Promise<{ message: string }> {
        const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
        return data;
    },

    /** Reset password using a token from the reset email. */
    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        const { data } = await api.post<{ message: string }>('/auth/reset-password', {
            token,
            new_password: newPassword,
        });
        return data;
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
