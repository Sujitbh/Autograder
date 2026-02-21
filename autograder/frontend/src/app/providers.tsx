'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/utils/ThemeContext';
import { AuthProvider } from '@/utils/AuthContext';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,      // 5 minutes
                gcTime: 30 * 60 * 1000,         // 30 minutes (was cacheTime)
                retry: 3,
                retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
                refetchOnWindowFocus: true,
            },
            mutations: {
                retry: 1,
            },
        },
    });
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(makeQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
