'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User, UserRole, Faculty, Student, RegisterData } from '@/types';
import { getStore, clearAllAuth, setRememberMe, checkSession } from '@/utils/authStorage';

// ── Context shape ───────────────────────────────────────────────────

interface AuthContextType {
    /** Currently authenticated user (null when logged out). */
    user: User | null;
    /** Shorthand role accessor. */
    role: UserRole | null;
    /** Whether the user is logged in. */
    isAuthenticated: boolean;
    /** True while restoring the session on mount. */
    isLoading: boolean;
    /** Sign in — stores user in state + storage. Token is already stored by authService. */
    login: (userData?: Partial<User>, token?: string, rememberMe?: boolean) => void;
    /** Register → same as login for simplicity. */
    signup: (userData?: Partial<User>) => void;
    /** Log out — clears everything. */
    logout: () => void;
    /** Replace the stored user (e.g. after profile edit). */
    updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
    login: () => { },
    signup: () => { },
    logout: () => { },
    updateUser: () => { },
});

// ── Helper: build a user from partial data for any role ─────────────

function buildUser(partial?: Partial<User>): User {
    const role = partial?.role ?? 'faculty';
    if (role === 'student') {
        return {
            id: partial?.id ?? 'student-1',
            firstName: (partial as any)?.firstName ?? 'Student',
            lastName: (partial as any)?.lastName ?? '',
            email: (partial as any)?.email ?? 'student@ulm.edu',
            sisUserId: (partial as any)?.sisUserId ?? '',
            sisLoginId: (partial as any)?.sisLoginId ?? '',
            enrolledCourses: (partial as any)?.enrolledCourses ?? [],
            profilePhoto: partial?.profilePhoto,
            role: 'student',
        } as any;
    }
    // faculty or admin — use Faculty shape
    return {
        id: partial?.id ?? 'faculty-1',
        firstName: (partial as Faculty)?.firstName ?? 'User',
        lastName: (partial as Faculty)?.lastName ?? '',
        email: (partial as Faculty)?.email ?? 'user@ulm.edu',
        title: (partial as Faculty)?.title ?? '',
        department: (partial as Faculty)?.department ?? '',
        profilePhoto: partial?.profilePhoto,
        role: role as any,
    };
}

// ── Provider ────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    // Restore session on mount
    useEffect(() => {
        try {
            checkSession();
            const stored = localStorage.getItem('autograde_current_user');
            const auth = localStorage.getItem('autograde_auth');
            if (stored && auth === 'true') {
                setUser(JSON.parse(stored));
            }
        } catch {
            // corrupt data — ignore
        } finally {
            setIsLoading(false);
        }
    }, []);

    const persistUser = useCallback((u: User) => {
        setUser(u);
        localStorage.setItem('autograde_current_user', JSON.stringify(u));
        localStorage.setItem('autograde_auth', 'true');
        sessionStorage.setItem('autograde_session_active', 'true');
    }, []);

    const login = useCallback(
        (userData?: Partial<User>, token?: string, rememberMe?: boolean) => {
            clearAllAuth();
            setRememberMe(rememberMe ?? false);
            setUser(null);

            queryClient.clear();

            const u = buildUser(userData);
            persistUser(u);

            if (token && typeof globalThis.window !== 'undefined') {
                localStorage.setItem('autograde_token', token);
            }
        },
        [persistUser, queryClient]
    );

    const signup = useCallback(
        (userData?: Partial<User>) => {
            const u = buildUser(userData);
            persistUser(u);
        },
        [persistUser]
    );

    const logout = useCallback(() => {
        setUser(null);
        clearAllAuth();
        queryClient.clear();
    }, [queryClient]);

    const updateUser = useCallback(
        (patch: Partial<User>) => {
            setUser((prev) => {
                if (!prev) return prev;
                const updated = { ...prev, ...patch } as User;
                localStorage.setItem('autograde_current_user', JSON.stringify(updated));
                return updated;
            });
        },
        []
    );

    // Listen for forced sign-out from the API interceptor (e.g. expired token)
    useEffect(() => {
        const handleSignout = () => {
            logout();
            // Redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        };
        window.addEventListener('auth:signout', handleSignout);
        return () => window.removeEventListener('auth:signout', handleSignout);
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{
                user,
                role: user?.role ?? null,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ────────────────────────────────────────────────────────────

export function useAuth() {
    return useContext(AuthContext);
}
