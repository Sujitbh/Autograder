import type { Metadata } from 'next';
import '@/styles/index.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'Axiom',
    description:
        'Grading and assessment for ULM Computer Science. Faculty stay in charge while the system handles the tedious parts of evaluation and keeps integrity visible in the workflow.',
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
