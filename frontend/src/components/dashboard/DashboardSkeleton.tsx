'use client';

/**
 * DashboardSkeleton — matches the real dashboard layout bone-for-bone.
 * Not a generic gray box: mirrors hero, KPI row, todo list, timeline, course grid.
 * Uses .dash-skeleton for shimmer, respects reduced-motion.
 */
export function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            {/* Hero */}
            <div
                className="relative overflow-hidden rounded-[16px] p-7"
                style={{
                    background: 'var(--dash-surface-3)',
                    boxShadow:
                        'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-raised)',
                }}
            >
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="flex min-w-0 flex-col gap-3">
                        <div className="dash-skeleton h-[14px] w-[220px]" />
                        <div className="dash-skeleton h-[32px] w-[360px] max-w-full" />
                        <div className="dash-skeleton h-[18px] w-[260px] max-w-full" />
                    </div>
                    <div className="dash-skeleton h-[96px] w-full md:w-[360px]" />
                </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex flex-col justify-between gap-4 rounded-[12px] p-4"
                        style={{
                            background: 'var(--dash-surface-2)',
                            boxShadow:
                                'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
                        }}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="dash-skeleton h-[12px] w-[72px]" />
                            <div className="dash-skeleton h-[20px] w-[36px] rounded-full" />
                        </div>
                        <div className="flex items-end justify-between gap-3">
                            <div className="dash-skeleton h-[28px] w-[56px]" />
                            <div className="dash-skeleton h-[28px] w-[88px]" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                {/* Todo */}
                <div
                    className="rounded-[12px] p-5 xl:col-span-5"
                    style={{
                        background: 'var(--dash-surface-2)',
                        boxShadow:
                            'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
                    }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <div className="dash-skeleton h-[14px] w-[120px]" />
                        <div className="dash-skeleton h-[14px] w-[80px]" />
                    </div>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 py-2"
                        >
                            <div className="dash-skeleton h-8 w-8 rounded-[8px]" />
                            <div className="flex-1">
                                <div className="dash-skeleton mb-1 h-[14px] w-[78%]" />
                                <div className="dash-skeleton h-[11px] w-[50%]" />
                            </div>
                            <div className="dash-skeleton h-[18px] w-[52px] rounded-full" />
                        </div>
                    ))}
                </div>

                {/* Timeline */}
                <div
                    className="rounded-[12px] p-5 xl:col-span-4"
                    style={{
                        background: 'var(--dash-surface-2)',
                        boxShadow:
                            'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
                    }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <div className="dash-skeleton h-[14px] w-[120px]" />
                    </div>
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="relative flex items-start gap-3 py-1.5">
                            <div className="dash-skeleton h-7 w-7 rounded-full" />
                            <div className="flex-1">
                                <div className="dash-skeleton mb-1 h-[14px] w-[82%]" />
                                <div className="dash-skeleton h-[11px] w-[40%]" />
                            </div>
                            <div className="dash-skeleton h-[12px] w-[32px]" />
                        </div>
                    ))}
                </div>

                {/* Course strip */}
                <div
                    className="rounded-[12px] p-5 xl:col-span-3"
                    style={{
                        background: 'var(--dash-surface-2)',
                        boxShadow:
                            'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
                    }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <div className="dash-skeleton h-[14px] w-[100px]" />
                    </div>
                    <div className="flex flex-col gap-3">
                        {[0, 1].map((i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-[12px]"
                                style={{
                                    boxShadow:
                                        'inset 0 0 0 1px var(--dash-ring-subtle)',
                                }}
                            >
                                <div className="dash-skeleton h-14 w-full rounded-none" />
                                <div className="p-3">
                                    <div className="dash-skeleton mb-3 h-[14px] w-[85%]" />
                                    <div className="dash-skeleton h-[18px] w-[70%]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
