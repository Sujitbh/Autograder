'use client';

import React, { useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { RubricCriterion, RubricSection } from './WeightedRubricTable';

interface UnweightedRubricTableProps {
    sections: RubricSection[];
    onChange: (sections: RubricSection[]) => void;
    allowReorder?: boolean;
    readOnly?: boolean;
}

function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

function emptyCriterion(name = 'New Criterion'): RubricCriterion {
    return {
        name,
        description: '',
        maxPoints: 1,
        weight: 1,
        gradingMethod: 'manual',
        defaultComments: {},
    };
}

function emptySection(name = 'New Section'): RubricSection {
    return {
        name,
        description: '',
        weight: 1,
        criteria: [emptyCriterion('Criterion 1')],
    };
}

export default function UnweightedRubricTable({
    sections,
    onChange,
    allowReorder = true,
    readOnly = false,
}: UnweightedRubricTableProps) {
    const totalPoints = useMemo(
        () =>
            sections.reduce(
                (sectionSum, section) =>
                    sectionSum +
                    (section.criteria ?? []).reduce(
                        (criterionSum, criterion) => criterionSum + (criterion.maxPoints ?? 0),
                        0,
                    ),
                0,
            ),
        [sections],
    );

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
            onChange(next);
        },
        [sections, onChange],
    );

    const addCriterion = useCallback(
        (si: number) => {
            const next = deepClone(sections);
            next[si].criteria.push(emptyCriterion(`Criterion ${next[si].criteria.length + 1}`));
            onChange(next);
        },
        [sections, onChange],
    );

    const removeCriterion = useCallback(
        (si: number, ci: number) => {
            const next = deepClone(sections);
            next[si].criteria.splice(ci, 1);
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

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-gray-300 bg-white p-4 space-y-2 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Point-Based Rubric
                        </h3>
                        <p className="text-xs text-gray-500">
                            Each criterion uses a fixed point value. The final rubric total is the sum of all criterion points.
                        </p>
                    </div>
                    <div className="rounded-full bg-[#F5EDED] px-3 py-1 text-xs font-semibold text-[#6B0000]">
                        Total points: {Math.round(totalPoints * 100) / 100}
                    </div>
                </div>
                <p className="text-xs text-gray-500">
                    No percentages, weights, or normalization are applied in this mode.
                </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            {!readOnly && <th className="w-8 border border-gray-300 px-1 dark:border-gray-600" />}
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold min-w-[220px] dark:border-gray-600">
                                Criterion
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-center font-semibold w-28 dark:border-gray-600">
                                Max Points
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold min-w-[280px] dark:border-gray-600">
                                Description
                            </th>
                            {!readOnly && <th className="w-10 border border-gray-300 px-1 dark:border-gray-600" />}
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((section, si) => {
                            const sectionTotal = (section.criteria ?? []).reduce(
                                (sum, criterion) => sum + (criterion.maxPoints ?? 0),
                                0,
                            );

                            return (
                                <React.Fragment key={`${section.name}-${si}`}>
                                    <tr className="bg-gray-50 dark:bg-gray-900">
                                        {!readOnly && (
                                            <td className="border border-gray-300 px-1 py-1 align-middle dark:border-gray-600">
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
                                                    <GripVertical className="mx-auto h-3 w-3 text-gray-400" />
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
                                            colSpan={3 + (readOnly ? 0 : 1)}
                                            className="border border-gray-300 px-3 py-2 dark:border-gray-600"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <Input
                                                    value={section.name}
                                                    onChange={(e) => updateSection(si, { name: e.target.value })}
                                                    className="h-8 max-w-[320px] bg-white font-semibold dark:bg-gray-800"
                                                    aria-label={`Section ${si + 1} name`}
                                                    disabled={readOnly}
                                                />
                                                <div className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                    {sectionTotal} pts
                                                </div>
                                            </div>
                                        </td>
                                        {!readOnly && (
                                            <td className="border border-gray-300 px-1 text-center dark:border-gray-600">
                                                {sections.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSection(si)}
                                                        className="p-1 text-red-400 hover:text-red-600"
                                                        aria-label={`Remove section ${section.name}`}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>

                                    {(section.criteria ?? []).map((criterion, ci) => (
                                        <tr key={`${si}-${ci}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            {!readOnly && (
                                                <td className="border border-gray-300 px-1 text-center text-xs text-gray-400 dark:border-gray-600">
                                                    {ci + 1}.
                                                </td>
                                            )}
                                            <td className="border border-gray-300 px-3 py-1.5 dark:border-gray-600">
                                                <Input
                                                    value={criterion.name}
                                                    onChange={(e) => updateCriterion(si, ci, { name: e.target.value })}
                                                    className="h-8 bg-white dark:bg-gray-800"
                                                    aria-label={`Criterion ${ci + 1} name`}
                                                    disabled={readOnly}
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1.5 text-center dark:border-gray-600">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="0.25"
                                                    value={criterion.maxPoints}
                                                    onChange={(e) => updateCriterion(si, ci, { maxPoints: Math.max(0, Number(e.target.value) || 0) })}
                                                    className="h-8 w-20 text-center bg-white dark:bg-gray-800"
                                                    aria-label={`Max points for ${criterion.name}`}
                                                    disabled={readOnly}
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1.5 dark:border-gray-600">
                                                <Textarea
                                                    value={criterion.description ?? ''}
                                                    onChange={(e) => updateCriterion(si, ci, { description: e.target.value })}
                                                    rows={2}
                                                    className="min-h-[40px] bg-white dark:bg-gray-800"
                                                    placeholder="Describe what this criterion evaluates..."
                                                    disabled={readOnly}
                                                />
                                            </td>
                                            {!readOnly && (
                                                <td className="border border-gray-300 px-1 text-center dark:border-gray-600">
                                                    {section.criteria.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCriterion(si, ci)}
                                                            className="p-0.5 text-red-400 hover:text-red-600"
                                                            aria-label={`Remove ${criterion.name}`}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}

                                    {!readOnly && (
                                        <tr>
                                            <td
                                                colSpan={3 + (readOnly ? 0 : 2)}
                                                className="border border-gray-300 px-3 py-2 dark:border-gray-600"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => addCriterion(si)}
                                                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    <Plus className="h-3 w-3" /> Add criterion to {section.name}
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        <tr className="bg-gray-100 font-bold dark:bg-gray-800">
                            {!readOnly && <td className="border border-gray-300 dark:border-gray-600" />}
                            <td className="border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
                                Totals
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-sm dark:border-gray-600">
                                {Math.round(totalPoints * 100) / 100}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-gray-500 dark:border-gray-600">
                                Sum of all criterion point values
                            </td>
                            {!readOnly && <td className="border border-gray-300 dark:border-gray-600" />}
                        </tr>
                    </tbody>
                </table>
            </div>

            {!readOnly && (
                <Button type="button" variant="outline" size="sm" onClick={addSection} className="mt-2">
                    <Plus className="mr-1 h-4 w-4" /> Add Section
                </Button>
            )}
        </div>
    );
}