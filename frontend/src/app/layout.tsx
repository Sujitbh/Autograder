import type { Metadata } from 'next';
import '@/styles/index.css';
import { Providers } from './providers';

export const metadata: Metadata = {
    title: 'Axiom Autograder',
    description: 'Axiom Autograder – Automated Grading Platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
