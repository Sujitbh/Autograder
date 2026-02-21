/* ═══════════════════════════════════════════════════════════════════
   Environment Configuration — Type-safe config accessor
   ═══════════════════════════════════════════════════════════════════ */

interface EnvironmentConfig {
    apiUrl: string;
    wsUrl: string;
    pistonApiUrl: string;
    s3Bucket: string;
    cloudFrontUrl: string;
    awsRegion: string;
    features: {
        darkMode: boolean;
        aiDetection: boolean;
        canvasIntegration: boolean;
    };
    monitoring: {
        sentryDsn: string | null;
        googleAnalyticsId: string | null;
    };
}

function envBool(value: string | undefined, fallback: boolean): boolean {
    if (value === undefined) return fallback;
    return value === 'true';
}

export const config: EnvironmentConfig = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002',
    pistonApiUrl: process.env.NEXT_PUBLIC_PISTON_API_URL || 'https://emkc.org/api/v2/piston',
    s3Bucket: process.env.NEXT_PUBLIC_S3_BUCKET || 'autograde-uploads-dev',
    cloudFrontUrl: process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '',
    awsRegion: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    features: {
        darkMode: envBool(process.env.NEXT_PUBLIC_ENABLE_DARK_MODE, true),
        aiDetection: envBool(process.env.NEXT_PUBLIC_ENABLE_AI_DETECTION, false),
        canvasIntegration: envBool(process.env.NEXT_PUBLIC_ENABLE_CANVAS_INTEGRATION, false),
    },
    monitoring: {
        sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || null,
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || null,
    },
};

/**
 * Validate that critical environment variables are present in production.
 * Call this once at app startup.
 */
export function validateEnv(): void {
    if (process.env.NODE_ENV !== 'production') return;

    const required = ['NEXT_PUBLIC_API_URL'] as const;
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error(
            `[AutoGrade] Missing required environment variables: ${missing.join(', ')}`
        );
    }
}
