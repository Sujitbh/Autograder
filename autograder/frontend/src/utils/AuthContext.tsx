'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from 'react';
import type { User, UserRole, Faculty, Student, RegisterData } from '@/types';

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
    /** Sign in — stores user in state + localStorage. */
    login: (userData?: Partial<User>) => void;
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

// ── Helper: build a default Faculty user from a partial ─────────────

function buildDefaultFaculty(partial?: Partial<User>): Faculty {
    return {
        id: partial?.id ?? 'faculty-1',
        firstName: (partial as Faculty)?.firstName ?? 'Sarah',
        lastName: (partial as Faculty)?.lastName ?? 'Johnson',
        email: (partial as Faculty)?.email ?? 'sjohnson@ulm.edu',
        title: (partial as Faculty)?.title ?? 'Associate Professor',
        department: (partial as Faculty)?.department ?? 'Computer Science',
        profilePhoto: partial?.profilePhoto,
        role: 'faculty',
    };
}

// ── Provider ────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
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
    }, []);

    const login = useCallback(
        (userData?: Partial<User>) => {
            const u = buildDefaultFaculty(userData);
            persistUser(u);
        },
        [persistUser]
    );

    const signup = useCallback(
        (userData?: Partial<User>) => {
            const u = buildDefaultFaculty(userData);
            persistUser(u);
        },
        [persistUser]
    );

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('autograde_current_user');
        localStorage.removeItem('autograde_auth');
        localStorage.removeItem('autograde_token');
    }, []);

    const updateUser = useCallback(
        (patch: Partial<User>) => {
            setUser((prev) => {
                if (!prev) return prev;
                const updated = { ...prev, ...patch } as User;
                localStorage.setItem(
                    'autograde_current_user',
                    JSON.stringify(updated)
                );
                return updated;
            });
        },
        []
    );

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
