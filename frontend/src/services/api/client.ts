/* ═══════════════════════════════════════════════════════════════════
   Axios Instance — Base HTTP client with interceptors
   ═══════════════════════════════════════════════════════════════════ */

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config/env';
import type { ApiResponse } from '@/types';
import { clearAllAuth } from '@/utils/authStorage';

// ── Custom error classes ────────────────────────────────────────────

export class AuthError extends Error {
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthError';
    }
}

export class NetworkError extends Error {
    constructor(message = 'Network request failed') {
        super(message);
        this.name = 'NetworkError';
    }
}

export class ValidationError extends Error {
    public readonly fields: Record<string, string>;

    constructor(message = 'Validation failed', fields: Record<string, string> = {}) {
        super(message);
        this.name = 'ValidationError';
        this.fields = fields;
    }
}

// ── Axios instance ──────────────────────────────────────────────────

const api = axios.create({
    baseURL: config.apiUrl,
    timeout: 30_000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor (attach JWT if available) ───────────────────

api.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('autograde_token');
        if (token && req.headers) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    }

    // If the request body is FormData, remove Content-Type header
    // so axios can set the correct multipart/form-data boundary
    if (req.data instanceof FormData && req.headers) {
        req.headers.set('Content-Type', false as any);
    }

    return req;
});

// ── Response interceptor (global error handling) ────────────────────

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError<ApiResponse<unknown>>) => {
        if (!error.response) {
            throw new NetworkError('Unable to connect to the server');
        }

        const { status, data } = error.response;
        const backendDetail = (data as any)?.detail;
        const backendDetailFromArray = Array.isArray(backendDetail)
            ? backendDetail
                .map((d: any) => d?.msg)
                .filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0)
                .join('; ')
            : undefined;
        const backendMessage = (typeof backendDetail === 'string' ? backendDetail : undefined)
            ?? backendDetailFromArray
            ?? data?.message
            ?? data?.error;

        if (status === 401) {
            const requestUrl = error.config?.url ?? '';
            const isLoginRequest = requestUrl.includes('/auth/login');

            // Wrong credentials on login should not trigger global signout + page reset.
            // Keep user on the login form and surface the error locally.
            if (!isLoginRequest && typeof window !== 'undefined') {
                clearAllAuth();
                window.dispatchEvent(new Event('auth:signout'));
            }
            throw new AuthError(backendMessage ?? 'Unauthorized');
        }

        if (status === 422) {
            throw new ValidationError(backendMessage ?? 'Validation error');
        }

        throw new Error(backendMessage ?? `Request failed (${status})`);
    }
);

// ── Retry wrapper (exponential back-off, max 3 retries) ────────────

export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3
): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            // Don't retry auth or validation errors
            if (err instanceof AuthError || err instanceof ValidationError) throw err;
            if (attempt === retries) throw err;
            const delay = Math.min(1000 * 2 ** attempt, 10_000);
            await new Promise((r) => setTimeout(r, delay));
        }
    }
    throw new Error('Retry limit reached');
}

export default api;
