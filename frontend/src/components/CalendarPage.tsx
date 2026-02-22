import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, ChevronRight, CalendarDays, Clock,
    ExternalLink, BookOpen,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface CalendarAssignment {
    id: string;
    name: string;
    dueDate: string;
    courseName: string;
    courseCode: string;
    courseId: string;
    language?: string;
}

/* ═══════════════════════════════════════════
   Course color mapping
   ═══════════════════════════════════════════ */

const COURSE_COLORS: Record<string, string> = {
    'CS-1001': '#6B0000',
    'CS-2050': '#1E40AF',
    'CS-3100': '#15803D',
    'CS-4200': '#B45309',
    'CS-3500': '#7C3AED',
};

function getCourseColor(courseCode: string): string {
    return COURSE_COLORS[courseCode] || '#6B0000';
}

/* ═══════════════════════════════════════════
   Assignment data
   ═══════════════════════════════════════════ */

function loadAllAssignments(): CalendarAssignment[] {
    const mockAssignments: CalendarAssignment[] = [
        { id: 'a1', name: 'Hello World Program', dueDate: '2026-02-24', courseName: 'Introduction to Computer Science', courseCode: 'CS-1001', courseId: 'cs-1001', language: 'Python' },
        { id: 'a2', name: 'Variables and Data Types', dueDate: '2026-03-03', courseName: 'Introduction to Computer Science', courseCode: 'CS-1001', courseId: 'cs-1001', language: 'Python' },
        { id: 'a3', name: 'Control Flow: Loops', dueDate: '2026-03-10', courseName: 'Introduction to Computer Science', courseCode: 'CS-1001', courseId: 'cs-1001', language: 'Python' },
        { id: 'a4', name: 'Functions and Modules', dueDate: '2026-03-17', courseName: 'Introduction to Computer Science', courseCode: 'CS-1001', courseId: 'cs-1001', language: 'Python' },
        { id: 'a5', name: 'Object-Oriented Programming', dueDate: '2026-03-24', courseName: 'Introduction to Computer Science', courseCode: 'CS-1001', courseId: 'cs-1001', language: 'Python' },
        { id: 'ds1', name: 'Linked List Implementation', dueDate: '2026-02-26', courseName: 'Data Structures and Algorithms', courseCode: 'CS-2050', courseId: 'cs-2050', language: 'Java' },
        { id: 'ds2', name: 'Binary Search Trees', dueDate: '2026-03-05', courseName: 'Data Structures and Algorithms', courseCode: 'CS-2050', courseId: 'cs-2050', language: 'Java' },
        { id: 'ds3', name: 'Graph Algorithms', dueDate: '2026-03-19', courseName: 'Data Structures and Algorithms', courseCode: 'CS-2050', courseId: 'cs-2050', language: 'Java' },
        { id: 'se1', name: 'Requirements Document', dueDate: '2026-02-28', courseName: 'Software Engineering Principles', courseCode: 'CS-3100', courseId: 'cs-3100' },
        { id: 'se2', name: 'System Design Diagram', dueDate: '2026-03-12', courseName: 'Software Engineering Principles', courseCode: 'CS-3100', courseId: 'cs-3100' },
        { id: 'se3', name: 'Sprint Review Presentation', dueDate: '2026-03-26', courseName: 'Software Engineering Principles', courseCode: 'CS-3100', courseId: 'cs-3100' },
        { id: 'wd1', name: 'React Portfolio App', dueDate: '2026-03-07', courseName: 'Advanced Web Development', courseCode: 'CS-4200', courseId: 'cs-4200', language: 'TypeScript' },
        { id: 'wd2', name: 'REST API Project', dueDate: '2026-03-21', courseName: 'Advanced Web Development', courseCode: 'CS-4200', courseId: 'cs-4200', language: 'TypeScript' },
    ];

    // Load course info from localStorage to map courseId to name/code
    let courseMap: Record<string, { code: string; title: string }> = {};
    try {
        const storedCourses = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        storedCourses.forEach((c: any) => {
            courseMap[c.id] = { code: c.code || '', title: c.title || 'Unknown Course' };
        });
    } catch { /* ignore */ }

    // Load user-created assignments
    try {
        const stored = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
        const created: CalendarAssignment[] = stored.map((a: any) => {
            const course = courseMap[a.courseId];
            return {
                id: a.id,
                name: a.name,
                dueDate: a.dueDate,
                courseName: course?.title || a.courseName || 'My Course',
                courseCode: course?.code || a.courseCode || '',
                courseId: a.courseId || 'cs-1001',
                language: a.language,
            };
        });
        return [...mockAssignments, ...created];
    } catch {
        return mockAssignments;
    }
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

const TODAY = new Date(2026, 1, 20); // Feb 20, 2026

export function CalendarPage() {
    const router = useRouter();
    const [calendarDate, setCalendarDate] = useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [allAssignments] = useState<CalendarAssignment[]>(loadAllAssignments);

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthLabel = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Group assignments by date
    const assignmentsByDate: Record<string, CalendarAssignment[]> = {};
    allAssignments.forEach(a => {
        if (!assignmentsByDate[a.dueDate]) assignmentsByDate[a.dueDate] = [];
        assignmentsByDate[a.dueDate].push(a);
    });

    // Calendar grid cells
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    // Selected day assignments
    const selectedAssignments = selectedDate ? (assignmentsByDate[selectedDate] || []) : [];

    // Upcoming assignments (next 14 days from today)
    const upcomingAssignments = allAssignments
        .filter(a => {
            const d = new Date(a.dueDate + 'T00:00:00');
            const diff = d.getTime() - TODAY.getTime();
            return diff >= 0 && diff < 14 * 24 * 60 * 60 * 1000;
        })
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    // Unique courses for legend
    const uniqueCourses = Array.from(
        new Map(allAssignments.map(a => [a.courseCode, { code: a.courseCode, name: a.courseName }])).values()
    );

    const prevMonth = () => {
        setCalendarDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
    };
    const nextMonth = () => {
        setCalendarDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
    };
    const goToday = () => {
        setCalendarDate(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
        setSelectedDate(formatDateStr(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()));
    };

    function formatDateStr(y: number, m: number, d: number) {
        return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    function handleDateClick(day: number) {
        const dateStr = formatDateStr(year, month, day);
        setSelectedDate(prev => prev === dateStr ? null : dateStr);
    }

    function getSelectedDateLabel() {
        if (!selectedDate) return '';
        const d = new Date(selectedDate + 'T00:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }

    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'My Courses', href: '/courses' }, { label: 'Calendar' }]} />

            <main className="p-8" style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>
                            Assignment Calendar
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
                            View all assignment due dates across your courses
                        </p>
                    </div>
                    <Button
                        onClick={goToday}
                        variant="outline"
                        className="gap-2"
                        style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                    >
                        <CalendarDays className="w-4 h-4" />
                        Today
                    </Button>
                </div>

                <div className="flex gap-6" style={{ alignItems: 'flex-start' }}>
                    {/* ═══ Left: Calendar Grid ═══ */}
                    <div
                        className="flex-1 rounded-xl"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            padding: '24px',
                        }}
                    >
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={prevMonth}
                                className="rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                            >
                                <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-text-mid)' }} />
                            </button>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                {monthLabel}
                            </h2>
                            <button
                                onClick={nextMonth}
                                className="rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                            >
                                <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-text-mid)' }} />
                            </button>
                        </div>

                        {/* Day of Week Headers */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div
                                    key={d}
                                    className="text-center"
                                    style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7">
                            {cells.map((day, idx) => {
                                if (day === null) {
                                    return (
                                        <div
                                            key={`empty-${idx}`}
                                            style={{ minHeight: '80px', borderTop: '1px solid var(--color-border)' }}
                                        />
                                    );
                                }

                                const dateStr = formatDateStr(year, month, day);
                                const dayAssignments = assignmentsByDate[dateStr] || [];
                                const isToday = TODAY.getFullYear() === year && TODAY.getMonth() === month && TODAY.getDate() === day;
                                const isPast = new Date(year, month, day) < TODAY;
                                const isSelected = selectedDate === dateStr;
                                const hasDue = dayAssignments.length > 0;

                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className="text-left transition-colors relative group"
                                        style={{
                                            minHeight: '80px',
                                            padding: '6px 8px',
                                            borderTop: '1px solid var(--color-border)',
                                            background: isSelected
                                                ? 'rgba(107,0,0,0.06)'
                                                : isToday
                                                    ? 'rgba(107,0,0,0.03)'
                                                    : 'transparent',
                                            cursor: 'pointer',
                                            border: 'none',
                                            borderTopWidth: '1px',
                                            borderTopStyle: 'solid',
                                            borderTopColor: 'var(--color-border)',
                                            outline: isSelected ? '2px solid var(--color-primary)' : 'none',
                                            outlineOffset: '-2px',
                                            borderRadius: isSelected ? '8px' : '0',
                                            width: '100%',
                                        }}
                                    >
                                        {/* Day Number */}
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span
                                                className="inline-flex items-center justify-center rounded-full"
                                                style={{
                                                    width: '28px', height: '28px',
                                                    fontSize: '13px',
                                                    fontWeight: isToday || hasDue ? 700 : 400,
                                                    color: isToday ? 'white' : isPast && !hasDue ? 'var(--color-text-light)' : 'var(--color-text-dark)',
                                                    backgroundColor: isToday ? 'var(--color-primary)' : 'transparent',
                                                }}
                                            >
                                                {day}
                                            </span>
                                            {hasDue && (
                                                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-primary)' }}>
                                                    {dayAssignments.length} due
                                                </span>
                                            )}
                                        </div>

                                        {/* Assignment dots/pills */}
                                        <div className="space-y-0.5">
                                            {dayAssignments.slice(0, 2).map(a => (
                                                <div
                                                    key={a.id}
                                                    className="truncate rounded"
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 500,
                                                        padding: '1px 5px',
                                                        backgroundColor: getCourseColor(a.courseCode) + '18',
                                                        color: getCourseColor(a.courseCode),
                                                        borderLeft: `3px solid ${getCourseColor(a.courseCode)}`,
                                                    }}
                                                >
                                                    {a.name}
                                                </div>
                                            ))}
                                            {dayAssignments.length > 2 && (
                                                <span style={{ fontSize: '10px', color: 'var(--color-text-light)', paddingLeft: '5px' }}>
                                                    +{dayAssignments.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Course Legend */}
                        <div className="flex flex-wrap gap-4 mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                            {uniqueCourses.map(c => (
                                <div key={c.code} className="flex items-center gap-2">
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: getCourseColor(c.code) }} />
                                    <span style={{ fontSize: '12px', color: 'var(--color-text-mid)', fontWeight: 500 }}>
                                        {c.code} — {c.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ═══ Right: Selected Day / Upcoming ═══ */}
                    <div style={{ width: '340px', flexShrink: 0 }}>
                        {/* Selected Date Panel */}
                        {selectedDate ? (
                            <div
                                className="rounded-xl mb-4"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    overflow: 'hidden',
                                }}
                            >
                                <div style={{ padding: '16px 20px', backgroundColor: 'var(--color-primary)', color: 'white' }}>
                                    <p style={{ fontSize: '13px', opacity: 0.8 }}>Selected Date</p>
                                    <p style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>{getSelectedDateLabel()}</p>
                                </div>

                                <div style={{ padding: '16px' }}>
                                    {selectedAssignments.length === 0 ? (
                                        <div className="text-center py-6">
                                            <CalendarDays className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--color-text-light)', opacity: 0.4 }} />
                                            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', fontWeight: 500 }}>No assignments due</p>
                                            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>Select a date with assignments to see details</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedAssignments.map(a => (
                                                <button
                                                    key={a.id}
                                                    onClick={() => router.push(`/courses/${a.courseId}/assignments/${a.id}/grading`)}
                                                    className="w-full text-left rounded-lg transition-all hover:shadow-md"
                                                    style={{
                                                        padding: '14px 16px',
                                                        backgroundColor: 'var(--color-surface-elevated)',
                                                        border: '1px solid var(--color-border)',
                                                        cursor: 'pointer',
                                                        borderLeftWidth: '4px',
                                                        borderLeftColor: getCourseColor(a.courseCode),
                                                    }}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)', lineHeight: 1.3 }}>
                                                                {a.name}
                                                            </p>
                                                            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                                {a.courseCode} · {a.courseName}
                                                            </p>
                                                            {a.language && (
                                                                <span style={{
                                                                    display: 'inline-block', marginTop: '6px',
                                                                    fontSize: '11px', fontWeight: 600,
                                                                    padding: '2px 8px', borderRadius: '4px',
                                                                    backgroundColor: 'var(--color-surface)',
                                                                    color: 'var(--color-text-mid)',
                                                                    border: '1px solid var(--color-border)',
                                                                }}>
                                                                    {a.language}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-light)', marginTop: '2px' }} />
                                                    </div>
                                                    <p className="flex items-center gap-1 mt-2" style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 500 }}>
                                                        <BookOpen className="w-3 h-3" />
                                                        View assignment →
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {/* Upcoming Assignments */}
                        <div
                            className="rounded-xl"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{
                                padding: '14px 20px',
                                borderBottom: '1px solid var(--color-border)',
                            }}>
                                <h3 className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                    <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                    Upcoming (next 2 weeks)
                                </h3>
                            </div>

                            <div style={{ padding: '12px 16px', maxHeight: '400px', overflowY: 'auto' }}>
                                {upcomingAssignments.length === 0 ? (
                                    <p className="text-center py-4" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                                        No upcoming assignments
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {upcomingAssignments.map(a => {
                                            const dueDate = new Date(a.dueDate + 'T00:00:00');
                                            const daysUntil = Math.ceil((dueDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
                                            const isUrgent = daysUntil <= 3;

                                            return (
                                                <button
                                                    key={a.id}
                                                    onClick={() => {
                                                        // Navigate calendar to that month & select the date
                                                        setCalendarDate(new Date(dueDate.getFullYear(), dueDate.getMonth(), 1));
                                                        setSelectedDate(a.dueDate);
                                                    }}
                                                    className="w-full text-left flex items-start gap-3 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                                                    style={{ padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <div
                                                        className="flex-shrink-0 rounded-md flex flex-col items-center justify-center"
                                                        style={{
                                                            width: '42px', height: '42px',
                                                            backgroundColor: getCourseColor(a.courseCode),
                                                            color: 'white',
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1 }}>{dueDate.getDate()}</span>
                                                        <span style={{ fontSize: '9px', fontWeight: 500, textTransform: 'uppercase', lineHeight: 1, marginTop: '1px' }}>
                                                            {dueDate.toLocaleDateString('en-US', { month: 'short' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="truncate" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                                            {a.name}
                                                        </p>
                                                        <p style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: '2px' }}>
                                                            {a.courseCode}
                                                        </p>
                                                        {isUrgent && (
                                                            <span style={{
                                                                display: 'inline-block', marginTop: '3px',
                                                                fontSize: '10px', fontWeight: 700,
                                                                padding: '1px 6px', borderRadius: '4px',
                                                                backgroundColor: '#FEF2F2', color: '#991B1B',
                                                            }}>
                                                                {daysUntil === 0 ? 'Due today' : daysUntil === 1 ? 'Due tomorrow' : `${daysUntil} days left`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
}
