'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { DesignSystem } from '@/components/DesignSystem';

export default function DesignSystemPage() {
    return (
        <AuthGuard>
            <DesignSystem />
        </AuthGuard>
    );
}
