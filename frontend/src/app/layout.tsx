import type { Metadata } from 'next';
import '@/styles/index.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'Axiom',
    description: 'Axiom – Automated Grading Platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                    <Toaster richColors position="top-right" />
                </Providers>
            </body>
        </html>
    );
}
