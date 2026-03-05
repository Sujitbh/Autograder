'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ── Types ───────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    /** Raw preference ('light' | 'dark' | 'system'). */
    theme: ThemeMode;
    /** Resolved boolean — true when actual appearance is dark. */
    isDark: boolean;
    /** Set an explicit mode. */
    setTheme: (mode: ThemeMode) => void;
    /** Toggle between light ↔ dark (resets 'system' to explicit). */
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    isDark: false,
    setTheme: () => { },
    toggleTheme: () => { },
});

// ── Provider ────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        if (typeof window === 'undefined') return 'light';
        const stored = localStorage.getItem('autograde_theme') as ThemeMode | null;
        return stored ?? 'light';
    });

    const [systemDark, setSystemDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Listen for OS-level theme changes
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const isDark = theme === 'dark' || (theme === 'system' && systemDark);

    // Apply class + persist whenever the resolved value changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', isDark);
        root.style.setProperty('color-scheme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
        localStorage.setItem('autograde_theme', mode);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(isDark ? 'light' : 'dark');
    }, [isDark, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// ── Hook ────────────────────────────────────────────────────────────

export const useTheme = () => useContext(ThemeContext);
