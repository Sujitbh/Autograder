'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Users } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { courseColorVar } from './utils';
import { EmptyState } from './EmptyState';

export interface StudentCourseLike {
    id: number;
    name: string;
    code: string | null;
    assignments_count: number;
    completed_count: number;
    average_score: number | null;
}

export interface FacultyCourseLike {
    id: number;
    name: string;
    code: string | null;
    student_count: number;
    published_count: number;
    draft_count: number;
}

function MicroStat({
    label,
    value,
    tone,
    title,
}: {
    label: string;
    value: React.ReactNode;
    tone?: 'default' | 'warn' | 'primary';
    title?: string;
}) {
    const color =
        tone === 'warn'
            ? 'var(--dash-warn-ink)'
            : tone === 'primary'
            ? 'var(--dash-primary-ink)'
            : 'var(--dash-ink-2)';
    return (
        <div className="flex min-w-0 flex-col" title={title}>
            <span
                className="text-[14px] font-semibold leading-[18px]"
                style={{ color }}
            >
                {value}
            </span>
            <span
                className="truncate text-[10px] font-medium uppercase leading-[12px] tracking-[0.06em]"
                style={{ color: 'var(--dash-ink-4)' }}
            >
                {label}
            </span>
        </div>
    );
}

function Divider() {
    return (
        <span
            aria-hidden
            className="mx-2 h-6 w-px shrink-0"
            style={{ background: 'var(--dash-ring-subtle)' }}
        />
    );
}

export function CourseTile({
    course,
    role,
}: {
    course: StudentCourseLike | FacultyCourseLike;
    role: 'student' | 'faculty';
}) {
    const router = useRouter();
    const color = courseColorVar(course.id);
    const codeLabel = course.code ?? '—';
    const destination =
        role === 'student'
            ? `/student/courses/${course.id}`
            : `/courses/${course.id}`;

    return (
        <button
            type="button"
            onClick={() => router.push(destination)}
            className={cn(
                'group relative flex w-full flex-col overflow-hidden rounded-[12px] text-left',
                'transition-all duration-200',
                'hover:-translate-y-[1px]',
            )}
            style={{
                background: 'var(--dash-surface-2)',
                boxShadow:
                    'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
            }}
            aria-label={`Open ${codeLabel} ${course.name}`}
        >
            {/* 56px color band with soft gradient wash */}
            <div
                className="relative"
                style={{
                    height: 56,
                    background: `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 82%, #000) 100%)`,
                }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 60%)',
                    }}
                />
                <div className="relative flex h-full items-center justify-between px-3">
                    <span
                        className="font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white/95"
                    >
                        {codeLabel}
                    </span>
                    <ArrowUpRight
                        className="h-4 w-4 text-white/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        aria-hidden
                    />
                </div>
            </div>

            <div className="flex min-h-[110px] flex-col justify-between gap-3 p-3">
                <p
                    className="line-clamp-2 text-[14px] font-semibold leading-[20px]"
                    style={{ color: 'var(--dash-ink-1)' }}
                    title={course.name}
                >
                    {course.name}
                </p>

                <div className="flex items-center">
                    {role === 'student' ? (
                        <>
                            <MicroStat
                                label="Done"
                                value={`${(course as StudentCourseLike).completed_count}/${(course as StudentCourseLike).assignments_count}`}
                            />
                            <Divider />
                            <MicroStat
                                label="Open"
                                value={
                                    (course as StudentCourseLike).assignments_count -
                                    (course as StudentCourseLike).completed_count
                                }
                            />
                            <Divider />
                            <MicroStat
                                label="Avg"
                                value={
                                    (course as StudentCourseLike).average_score == null
                                        ? '—'
                                        : `${(course as StudentCourseLike).average_score}%`
                                }
                                tone={
                                    (course as StudentCourseLike).average_score == null
                                        ? 'default'
                                        : 'primary'
                                }
                            />
                        </>
                    ) : (
                        <>
                            <MicroStat
                                label="Students"
                                value={
                                    <span className="inline-flex items-center gap-1">
                                        <Users className="h-3 w-3" aria-hidden />
                                        {(course as FacultyCourseLike).student_count}
                                    </span>
                                }
                            />
                            <Divider />
                            <MicroStat
                                label="Published"
                                value={(course as FacultyCourseLike).published_count}
                            />
                            <Divider />
                            <MicroStat
                                label="Drafts"
                                value={(course as FacultyCourseLike).draft_count}
                                tone={
                                    (course as FacultyCourseLike).draft_count > 0
                                        ? 'warn'
                                        : 'default'
                                }
                            />
                        </>
                    )}
                </div>
            </div>
        </button>
    );
}

export function CourseGrid({
    role,
    courses,
    onExplore,
}: {
    role: 'student' | 'faculty';
    courses: Array<StudentCourseLike | FacultyCourseLike>;
    onExplore?: () => void;
}) {
    if (courses.length === 0) {
        return (
            <EmptyState
                variant="no-courses"
                title={
                    role === 'faculty'
                        ? 'No courses yet.'
                        : 'You are not enrolled in any courses yet.'
                }
                hint={
                    role === 'faculty'
                        ? 'Create your first course to start grading with Axiom.'
                        : 'Join a course to see your assignments here.'
                }
                action={
                    onExplore
                        ? {
                              label:
                                  role === 'faculty'
                                      ? 'Create a course'
                                      : 'Join a course',
                              onClick: onExplore,
                          }
                        : undefined
                }
            />
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {courses.map((c) => (
                <CourseTile key={c.id} course={c} role={role} />
            ))}
        </div>
    );
}
