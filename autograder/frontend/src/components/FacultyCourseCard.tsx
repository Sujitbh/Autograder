'use client';

/* ═══════════════════════════════════════════════════════════════════
   FacultyCourseCard — Rich course card for the faculty dashboard
   ═══════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import {
    MoreVertical,
    Pencil,
    Trash2,
    Users,
    FileText,
    Clock,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

// ── Props ───────────────────────────────────────────────────────────

export interface FacultyCourseCardCourse {
    id: string;
    code: string;
    name: string;
    semester: string;
    section?: string;
    students: number;
    assignments: number;
    pendingGrades: number;
    status: 'active' | 'archived' | 'draft';
    enrollmentCode?: string;
}

interface FacultyCourseCardProps {
    course: FacultyCourseCardCourse;
    onOpen: (courseId: string) => void;
    onEdit?: (courseId: string) => void;
    onDelete?: (courseId: string) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────

function getPendingGradeColor(count: number): string {
    if (count === 0) return 'text-gray-400';
    if (count <= 10) return 'text-orange-600';
    return 'text-red-600';
}

function getPendingGradeBg(count: number): string {
    if (count === 0) return 'bg-gray-50';
    if (count <= 10) return 'bg-orange-50';
    return 'bg-red-50';
}

// ── Component ───────────────────────────────────────────────────────

export function FacultyCourseCard({
    course,
    onOpen,
    onEdit,
    onDelete,
}: FacultyCourseCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            {/* Card */}
            <div
                role="article"
                className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
                {/* Top maroon bar */}
                <div className="h-2 w-full bg-[#6B0000]" />

                {/* Header row */}
                <div className="flex items-start justify-between gap-2 px-5 pt-4">
                    {/* Course code badge */}
                    <span className="inline-flex items-center rounded-full bg-[#6B0000] px-3 py-0.5 text-xs font-semibold text-white">
                        {course.code}
                    </span>

                    <div className="flex items-center gap-2">
                        {/* Enrollment code */}
                        {course.enrollmentCode && (
                            <span
                                className="hidden text-xs text-gray-400 sm:inline"
                                title="Enrollment Code"
                            >
                                {course.enrollmentCode}
                            </span>
                        )}

                        {/* Three-dot menu */}
                        {(onEdit || onDelete) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                                        aria-label={`Actions for ${course.name}`}
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {onEdit && (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(course.id);
                                            }}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Course
                                        </DropdownMenuItem>
                                    )}
                                    {onDelete && (
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDeleteDialog(true);
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Course
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {/* Course name + semester */}
                <div className="flex-1 px-5 pt-3 pb-4">
                    <h3 className="text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
                        {course.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {course.semester}
                        {course.section ? ` · ${course.section}` : ''}
                    </p>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-px border-t border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                    {/* Students */}
                    <div className="flex flex-col items-center gap-1 bg-white py-3 dark:bg-gray-900">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {course.students}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            Students
                        </span>
                    </div>

                    {/* Assignments */}
                    <div className="flex flex-col items-center gap-1 bg-white py-3 dark:bg-gray-900">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {course.assignments}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            Assignments
                        </span>
                    </div>

                    {/* Pending Grades */}
                    <div
                        className={`flex flex-col items-center gap-1 py-3 ${getPendingGradeBg(course.pendingGrades)} dark:bg-gray-900`}
                    >
                        <Clock className={`h-4 w-4 ${getPendingGradeColor(course.pendingGrades)}`} />
                        <span
                            className={`text-sm font-semibold ${getPendingGradeColor(course.pendingGrades)}`}
                        >
                            {course.pendingGrades}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            Pending
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-800">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.status === 'active'
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : course.status === 'draft'
                                    ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                    >
                        {course.status === 'active'
                            ? 'Active'
                            : course.status === 'draft'
                                ? 'Draft'
                                : 'Archived'}
                    </span>

                    <Button
                        size="sm"
                        className="gap-1 bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
                        onClick={() => onOpen(course.id)}
                        aria-label={`Open ${course.name}`}
                    >
                        Open Course
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Course</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{course.name}</strong>? This
                            action cannot be undone and all associated assignments, submissions,
                            and grades will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onDelete?.(course.id);
                                setShowDeleteDialog(false);
                            }}
                        >
                            Delete Course
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
