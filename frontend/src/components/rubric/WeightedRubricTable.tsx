'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    GripVertical,
    MessageSquare,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GRADE_SCALE, MAX_GRADE, criterionPoints } from '@/lib/courseDefaultRubric';
import type {
    CourseDefaultRubricCriterionApi,
    CourseDefaultRubricSectionApi,
} from '@/lib/courseDefaultRubric';

// ── Types ────────────────────────────────────────────────────────────

export interface RubricSection extends CourseDefaultRubricSectionApi {}
export interface RubricCriterion extends CourseDefaultRubricCriterionApi {}

export interface GradeEntry {
    sectionIdx: number;
    criterionIdx: number;
    grade: number;
    comment: string;
}

export type RubricMode = 'edit' | 'grade' | 'preview';

export interface WeightedRubricTableProps {
    sections: RubricSection[];
    onChange: (sections: RubricSection[]) => void;
    mode?: RubricMode;
    grades?: GradeEntry[];
    onGradesChange?: (grades: GradeEntry[]) => void;
    instructorComment?: string;
    onInstructorCommentChange?: (comment: string) => void;
    /** Allow reorder via up/down buttons */
    allowReorder?: boolean;
    readOnly?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

function sectionWeightSum(sections: RubricSection[]): number {
    return sections.reduce(
        (sum, s) => sum + (s.criteria ?? []).reduce((cs, c) => cs + (c.weight ?? 0), 0),
        0,
    );
}

function emptyCriterion(name = 'New Criterion', weight = 0): RubricCriterion {
    return {
        name,
        description: '',
        maxPoints: 5,
        weight,
        gradingMethod: 'manual',
        defaultComments: {
            '5': '',
            '4': '',
            '3': '',
            '2': '',
            '1': '',
            '0': '',
        },
    };
}

function emptySection(name = 'New Section'): RubricSection {
    return {
        name,
        description: '',
        weight: 0,
        criteria: [emptyCriterion('Criterion 1', 0)],
    };
}

// ── Component ────────────────────────────────────────────────────────

export default function WeightedRubricTable({
    sections,
    onChange,
    mode = 'edit',
    grades = [],
    onGradesChange,
    instructorComment = '',
    onInstructorCommentChange,
    allowReorder = true,
    readOnly = false,
}: WeightedRubricTableProps) {
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

    const totalWeight = useMemo(() => sectionWeightSum(sections), [sections]);

    const getGrade = useCallback(
        (si: number, ci: number): GradeEntry | undefined =>
            grades.find((g) => g.sectionIdx === si && g.criterionIdx === ci),
        [grades],
    );

    const setGrade = useCallback(
        (si: number, ci: number, grade: number, comment?: string) => {
            if (!onGradesChange) return;
            const existing = grades.find((g) => g.sectionIdx === si && g.criterionIdx === ci);
            const criterion = sections[si]?.criteria?.[ci];
            const defaultComment =
                comment ?? criterion?.defaultComments?.[String(grade)] ?? '';
            if (existing) {
                onGradesChange(
                    grades.map((g) =>
                        g.sectionIdx === si && g.criterionIdx === ci
                            ? { ...g, grade, comment: comment !== undefined ? comment : defaultComment }
                            : g,
                    ),
                );
            } else {
                onGradesChange([
                    ...grades,
                    { sectionIdx: si, criterionIdx: ci, grade, comment: defaultComment },
                ]);
            }
        },
        [grades, onGradesChange, sections],
    );

    // ── Mutation helpers ─────────────────────────────────────────────

    const updateSection = useCallback(
        (idx: number, patch: Partial<RubricSection>) => {
            const next = deepClone(sections);
            next[idx] = { ...next[idx], ...patch };
            onChange(next);
        },
        [sections, onChange],
    );

    const updateCriterion = useCallback(
        (si: number, ci: number, patch: Partial<RubricCriterion>) => {
            const next = deepClone(sections);
            next[si].criteria[ci] = { ...next[si].criteria[ci], ...patch };
            // Keep section weight in sync (sum of its criteria weights)
            next[si].weight = next[si].criteria.reduce((s, c) => s + (c.weight ?? 0), 0);
            onChange(next);
        },
        [sections, onChange],
    );

    const addCriterion = useCallback(
        (si: number) => {
            const next = deepClone(sections);
            const crit = emptyCriterion(`Criterion ${next[si].criteria.length + 1}`, 0);
            next[si].criteria.push(crit);
            onChange(next);
        },
        [sections, onChange],
    );

    const removeCriterion = useCallback(
        (si: number, ci: number) => {
            const next = deepClone(sections);
            next[si].criteria.splice(ci, 1);
            next[si].weight = next[si].criteria.reduce((s, c) => s + (c.weight ?? 0), 0);
            onChange(next);
        },
        [sections, onChange],
    );

    const addSection = useCallback(() => {
        const next = deepClone(sections);
        next.push(emptySection(`Section ${sections.length + 1}`));
        onChange(next);
    }, [sections, onChange]);

    const removeSection = useCallback(
        (idx: number) => {
            const next = deepClone(sections);
            next.splice(idx, 1);
            onChange(next);
        },
        [sections, onChange],
    );

    const moveSection = useCallback(
        (idx: number, dir: -1 | 1) => {
            const next = deepClone(sections);
            const target = idx + dir;
            if (target < 0 || target >= next.length) return;
            [next[idx], next[target]] = [next[target], next[idx]];
            onChange(next);
        },
        [sections, onChange],
    );

    const toggleComments = (key: string) => {
        setExpandedComments((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // ── Grade totals ─────────────────────────────────────────────────

    const totalPts = useMemo(() => {
        return grades.reduce((sum, g) => {
            const c = sections[g.sectionIdx]?.criteria?.[g.criterionIdx];
            if (!c) return sum;
            return sum + criterionPoints(g.grade, c.weight);
        }, 0);
    }, [grades, sections]);

    const isGrading = mode === 'grade';
    const isEditing = mode === 'edit';
    const isPreview = mode === 'preview';

    // ── Render ───────────────────────────────────────────────────────

    return (
        <div className="space-y-4">
            {/* Main rubric table */}
            <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
                <table className="w-full text-sm border-collapse">
                    {/* Header */}
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-800">
                            {isEditing && !readOnly && (
                                <th className="w-8 border border-gray-300 dark:border-gray-600 px-1" />
                            )}
                            <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold min-w-[200px]">
                                &nbsp;
                            </th>
                            {(isGrading || isPreview) && (
                                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-semibold w-20">
                                    Grade
                                    <div className="text-[10px] font-normal text-gray-500">(0-5)</div>
                                </th>
                            )}
                            <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-semibold w-24">
                                % Weight
                                <div className="text-[10px] font-normal text-gray-500">(1-100)</div>
                            </th>
                            {(isGrading || isPreview) && (
                                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-semibold w-16">
                                    Pts
                                </th>
                            )}
                            <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold min-w-[250px]">
                                Instructor Comments
                            </th>
                            {isEditing && !readOnly && (
                                <th className="w-10 border border-gray-300 dark:border-gray-600 px-1" />
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {sections.map((section, si) => {
                            const sectionPts = (isGrading || isPreview)
                                ? grades
                                      .filter((g) => g.sectionIdx === si)
                                      .reduce((sum, g) => {
                                          const c = section.criteria?.[g.criterionIdx];
                                          return c ? sum + criterionPoints(g.grade, c.weight) : sum;
                                      }, 0)
                                : 0;

                            return (
                                <React.Fragment key={si}>
                                    {/* Section header row */}
                                    <tr className="bg-gray-100 dark:bg-gray-900">
                                        {isEditing && !readOnly && (
                                            <td className="border border-gray-300 dark:border-gray-600 px-1 py-1 align-middle">
                                                <div className="flex flex-col gap-0.5">
                                                    {allowReorder && si > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => moveSection(si, -1)}
                                                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                                            aria-label="Move section up"
                                                        >
                                                            <ChevronUp className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                    <GripVertical className="h-3 w-3 text-gray-400 mx-auto" />
                                                    {allowReorder && si < sections.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => moveSection(si, 1)}
                                                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                                            aria-label="Move section down"
                                                        >
                                                            <ChevronDown className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                        <td
                                            colSpan={
                                                (isGrading || isPreview ? 4 : 2) +
                                                (isEditing && !readOnly ? 1 : 0)
                                            }
                                            className="border border-gray-300 dark:border-gray-600 px-3 py-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                                    {toRoman(si + 1)}.
                                                </span>
                                                {isEditing && !readOnly ? (
                                                    <Input
                                                        value={section.name}
                                                        onChange={(e) =>
                                                            updateSection(si, { name: e.target.value })
                                                        }
                                                        className="h-7 text-sm font-bold max-w-[300px] bg-white dark:bg-gray-800"
                                                        aria-label={`Section ${si + 1} name`}
                                                    />
                                                ) : (
                                                    <span className="font-bold text-gray-900 dark:text-gray-100">
                                                        {section.name}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        {isEditing && !readOnly && (
                                            <td className="border border-gray-300 dark:border-gray-600 px-1 text-center">
                                                {sections.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSection(si)}
                                                        className="text-red-400 hover:text-red-600 p-1"
                                                        aria-label={`Remove section ${section.name}`}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>

                                    {/* Criteria rows */}
                                    {(section.criteria ?? []).map((criterion, ci) => {
                                        const gradeEntry = getGrade(si, ci);
                                        const pts =
                                            gradeEntry != null
                                                ? criterionPoints(gradeEntry.grade, criterion.weight)
                                                : 0;
                                        const commentKey = `${si}-${ci}`;
                                        const commentsExpanded = expandedComments[commentKey];

                                        return (
                                            <tr
                                                key={`${si}-${ci}`}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            >
                                                {isEditing && !readOnly && (
                                                    <td className="border border-gray-300 dark:border-gray-600 px-1 text-center text-xs text-gray-400">
                                                        {ci + 1}.
                                                    </td>
                                                )}
                                                {/* Criterion name */}
                                                <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5">
                                                    {isEditing && !readOnly ? (
                                                        <Input
                                                            value={criterion.name}
                                                            onChange={(e) =>
                                                                updateCriterion(si, ci, {
                                                                    name: e.target.value,
                                                                })
                                                            }
                                                            className="h-7 text-sm bg-white dark:bg-gray-800"
                                                            aria-label={`Criterion name`}
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-800 dark:text-gray-200">
                                                            {ci + 1}. {criterion.name}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Grade (grading/preview only) */}
                                                {(isGrading || isPreview) && (
                                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                                        {isGrading ? (
                                                            <select
                                                                value={gradeEntry?.grade ?? ''}
                                                                onChange={(e) => {
                                                                    const v = e.target.value;
                                                                    if (v === '') return;
                                                                    setGrade(si, ci, Number(v));
                                                                }}
                                                                className="w-14 h-7 text-sm text-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                                                aria-label={`Grade for ${criterion.name}`}
                                                            >
                                                                <option value="">—</option>
                                                                {GRADE_SCALE.map((g) => (
                                                                    <option key={g} value={g}>
                                                                        {g}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span className="text-sm font-medium">
                                                                {gradeEntry?.grade ?? '—'}
                                                            </span>
                                                        )}
                                                    </td>
                                                )}

                                                {/* % Weight */}
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                                    {isEditing && !readOnly ? (
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            value={criterion.weight}
                                                            onChange={(e) =>
                                                                updateCriterion(si, ci, {
                                                                    weight: clamp(
                                                                        Number(e.target.value) || 0,
                                                                        0,
                                                                        100,
                                                                    ),
                                                                })
                                                            }
                                                            className="h-7 w-16 text-sm text-center bg-white dark:bg-gray-800"
                                                            aria-label={`Weight for ${criterion.name}`}
                                                        />
                                                    ) : (
                                                        <span className="text-sm">
                                                            {criterion.weight}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Pts (grading/preview only) */}
                                                {(isGrading || isPreview) && (
                                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                                        <span
                                                            className={`text-sm font-medium ${
                                                                criterion.weight === 0
                                                                    ? 'text-gray-400'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {gradeEntry != null
                                                                ? pts
                                                                : criterion.weight === 0
                                                                  ? '0'
                                                                  : '—'}
                                                        </span>
                                                    </td>
                                                )}

                                                {/* Instructor Comments */}
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                                                    {isGrading ? (
                                                        <Textarea
                                                            value={gradeEntry?.comment ?? ''}
                                                            onChange={(e) =>
                                                                setGrade(
                                                                    si,
                                                                    ci,
                                                                    gradeEntry?.grade ?? 0,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            rows={1}
                                                            className="text-sm min-h-[28px] resize-y bg-white dark:bg-gray-800"
                                                            placeholder={
                                                                criterion.weight === 0
                                                                    ? 'n/a'
                                                                    : 'Comment...'
                                                            }
                                                        />
                                                    ) : isEditing && !readOnly ? (
                                                        <div className="space-y-1">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleComments(commentKey)
                                                                }
                                                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                            >
                                                                <MessageSquare className="h-3 w-3" />
                                                                {commentsExpanded
                                                                    ? 'Hide default comments'
                                                                    : 'Edit default comments (0-5)'}
                                                            </button>
                                                            {commentsExpanded && (
                                                                <DefaultCommentsEditor
                                                                    comments={
                                                                        criterion.defaultComments ?? {}
                                                                    }
                                                                    onChange={(dc) =>
                                                                        updateCriterion(si, ci, {
                                                                            defaultComments: dc,
                                                                        })
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                                                            {gradeEntry?.comment ||
                                                                (criterion.weight === 0
                                                                    ? 'n/a'
                                                                    : '')}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Remove criterion */}
                                                {isEditing && !readOnly && (
                                                    <td className="border border-gray-300 dark:border-gray-600 px-1 text-center">
                                                        {section.criteria.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeCriterion(si, ci)
                                                                }
                                                                className="text-red-400 hover:text-red-600 p-0.5"
                                                                aria-label={`Remove ${criterion.name}`}
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}

                                    {/* Add criterion row (edit mode) */}
                                    {isEditing && !readOnly && (
                                        <tr>
                                            <td
                                                colSpan={4 + (isEditing && !readOnly ? 1 : 0)}
                                                className="border border-gray-300 dark:border-gray-600 px-3 py-1"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => addCriterion(si)}
                                                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    <Plus className="h-3 w-3" /> Add criterion to{' '}
                                                    {section.name}
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {/* Totals row */}
                        <tr className="bg-gray-200 dark:bg-gray-800 font-bold">
                            {isEditing && !readOnly && (
                                <td className="border border-gray-300 dark:border-gray-600" />
                            )}
                            <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">
                                Totals
                            </td>
                            {(isGrading || isPreview) && (
                                <td className="border border-gray-300 dark:border-gray-600" />
                            )}
                            <td
                                className={`border border-gray-300 dark:border-gray-600 px-3 py-2 text-center text-sm ${
                                    Math.abs(totalWeight - 100) > 0.5
                                        ? 'text-red-600 dark:text-red-400'
                                        : ''
                                }`}
                            >
                                {Math.round(totalWeight * 100) / 100}
                            </td>
                            {(isGrading || isPreview) && (
                                <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center text-sm">
                                    {Math.round(totalPts * 100) / 100}
                                </td>
                            )}
                            <td className="border border-gray-300 dark:border-gray-600" />
                            {isEditing && !readOnly && (
                                <td className="border border-gray-300 dark:border-gray-600" />
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Weight validation */}
            {Math.abs(totalWeight - 100) > 0.5 && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    ⚠ Total weight is {Math.round(totalWeight * 100) / 100}% — should be 100%.
                </p>
            )}

            {/* Add section button (edit mode) */}
            {isEditing && !readOnly && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSection}
                    className="mt-2"
                >
                    <Plus className="h-4 w-4 mr-1" /> Add Section
                </Button>
            )}

            {/* Deductions & Final grade (grading mode) */}
            {isGrading && <DeductionsBlock totalPts={totalPts} totalWeight={totalWeight} />}

            {/* Instructor overall comment */}
            {(isGrading || isPreview) && onInstructorCommentChange && (
                <div className="mt-4 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm font-bold border-b border-gray-300 dark:border-gray-600">
                        Instructor&apos;s Comments
                    </div>
                    <Textarea
                        value={instructorComment}
                        onChange={(e) => onInstructorCommentChange(e.target.value)}
                        rows={3}
                        className="rounded-none border-0 text-sm resize-y"
                        placeholder="Overall assignment feedback..."
                    />
                </div>
            )}
        </div>
    );
}

// ── Default comments inline editor ──────────────────────────────────

function DefaultCommentsEditor({
    comments,
    onChange,
}: {
    comments: Record<string, string>;
    onChange: (comments: Record<string, string>) => void;
}) {
    return (
        <div className="grid gap-1 mt-1">
            {[...GRADE_SCALE].reverse().map((g) => (
                <div key={g} className="flex items-start gap-1.5">
                    <span className="text-[11px] font-mono text-gray-500 w-4 pt-1.5 text-right shrink-0">
                        {g}:
                    </span>
                    <Input
                        value={comments[String(g)] ?? ''}
                        onChange={(e) =>
                            onChange({ ...comments, [String(g)]: e.target.value })
                        }
                        placeholder={`Default comment for grade ${g}`}
                        className="h-6 text-[11px] bg-white dark:bg-gray-800"
                    />
                </div>
            ))}
        </div>
    );
}

// ── Deductions block (shown during grading) ─────────────────────────

function DeductionsBlock({
    totalPts,
    totalWeight,
}: {
    totalPts: number;
    totalWeight: number;
}) {
    const [lateDeduction, setLateDeduction] = useState(0);
    const [creditAdjustment, setCreditAdjustment] = useState(0);
    const [bonus, setBonus] = useState(0);

    const finalGrade = Math.max(0, totalPts - lateDeduction - creditAdjustment + bonus);

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700 mt-2">
            <table className="w-full text-sm border-collapse">
                <tbody>
                    <tr className="bg-gray-200 dark:bg-gray-800 font-bold">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 w-[300px]">
                            Totals
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-center w-24">
                            {Math.round(totalWeight * 100) / 100}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-center w-16">
                            {Math.round(totalPts * 100) / 100}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600" />
                    </tr>
                    <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5">
                            Late Deduction (10% per day)
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center bg-yellow-100 dark:bg-yellow-900/30">
                            <Input
                                type="number"
                                min={0}
                                value={lateDeduction}
                                onChange={(e) => setLateDeduction(Number(e.target.value) || 0)}
                                className="h-6 w-16 text-sm text-center"
                            />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-center">
                            {lateDeduction}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600" />
                    </tr>
                    <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5">
                            Credit Adjustment
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600" />
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-center">
                            {creditAdjustment}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600" />
                    </tr>
                    <tr className="bg-gray-200 dark:bg-gray-800 font-bold">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                            Final Grade
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center">
                            {Math.round(totalWeight * 100) / 100}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center text-lg">
                            {Math.round(finalGrade * 100) / 100}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">
                            out of {Math.round(totalWeight * 100) / 100}
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-right">
                            Bonus:
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                            <Input
                                type="number"
                                min={0}
                                value={bonus}
                                onChange={(e) => setBonus(Number(e.target.value) || 0)}
                                className="h-6 w-16 text-sm text-center"
                            />
                        </td>
                        <td
                            colSpan={2}
                            className="border border-gray-300 dark:border-gray-600"
                        />
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

// ── Utility ──────────────────────────────────────────────────────────

function toRoman(num: number): string {
    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    for (let i = 0; i < vals.length; i++) {
        while (num >= vals[i]) {
            result += syms[i];
            num -= vals[i];
        }
    }
    return result;
}
