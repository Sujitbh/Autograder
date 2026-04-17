'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    ClipboardList,
    Loader2,
    RotateCcw,
    Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { courseService } from '@/services/api/courseService';
import type {
    CourseDefaultRubricApi,
    CourseDefaultRubricPutApi,
    CourseDefaultRubricSectionApi,
} from '@/lib/courseDefaultRubric';
import { criterionPoints, MAX_GRADE } from '@/lib/courseDefaultRubric';
import { useAuth } from '@/utils/AuthContext';
import WeightedRubricTable from './WeightedRubricTable';
import type { GradeEntry, RubricSection } from './WeightedRubricTable';

export function CourseDefaultRubricEditor({ courseId }: { courseId: string }) {
    const { user } = useAuth();
    const canSave = user?.role === 'faculty' || user?.role === 'admin';
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [meta, setMeta] = useState<CourseDefaultRubricApi | null>(null);
    const [sections, setSections] = useState<RubricSection[]>([]);
    const [previewGrades, setPreviewGrades] = useState<GradeEntry[]>([]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const d = await courseService.getCourseDefaultRubric(courseId);
            setMeta(d);
            setSections(JSON.parse(JSON.stringify(d.sections)) as RubricSection[]);
            setPreviewGrades([]);
        } catch {
            toast.error('Could not load course default rubric.');
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        load();
    }, [load]);

    const totalWeight = useMemo(
        () =>
            sections.reduce(
                (sum, s) => sum + (s.criteria ?? []).reduce((cs, c) => cs + (c.weight ?? 0), 0),
                0,
            ),
        [sections],
    );

    const handleSave = async () => {
        if (!canSave) return;
        for (const s of sections) {
            if (!s.name.trim()) {
                toast.error('Each section needs a title.');
                return;
            }
            for (const c of s.criteria) {
                if (!c.name.trim()) {
                    toast.error(`Criterion in "${s.name}" needs a title.`);
                    return;
                }
            }
        }
        // Auto-recalculate section weights from criteria
        const normalized: CourseDefaultRubricSectionApi[] = sections.map((s) => ({
            ...s,
            weight: (s.criteria ?? []).reduce((sum, c) => sum + (c.weight ?? 0), 0),
        }));

        const payload: CourseDefaultRubricPutApi = {
            rubricMode: 'weighted',
            weightPolicy: 'percent',
            pointBudget: 100,
            sections: normalized,
            autoNormalize: false,
        };
        setSaving(true);
        try {
            const saved = await courseService.putCourseDefaultRubric(courseId, payload);
            setMeta(saved);
            toast.success('Course default rubric saved.');
        } catch (e: unknown) {
            const ax = e as { response?: { data?: { detail?: unknown } } };
            const d = ax.response?.data?.detail;
            toast.error(typeof d === 'string' ? d : 'Save failed.');
        } finally {
            setSaving(false);
        }
    };

    // Preview calculations
    const previewPts = useMemo(() => {
        return previewGrades.reduce((sum, g) => {
            const c = sections[g.sectionIdx]?.criteria?.[g.criterionIdx];
            return c ? sum + criterionPoints(g.grade, c.weight) : sum;
        }, 0);
    }, [previewGrades, sections]);

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 py-20 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-16">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <ClipboardList className="h-7 w-7 text-[#C9A84C]" />
                        Default Rubric
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Template for new assignments. Grade scale 0–5, weights must total 100%.
                    </p>
                    {meta?.updatedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                            Last updated {new Date(meta.updatedAt).toLocaleString()}
                            {meta.updatedByName ? ` · ${meta.updatedByName}` : ''}
                        </p>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={load}
                        disabled={saving}
                    >
                        <RotateCcw className="h-4 w-4 mr-1" /> Reload
                    </Button>
                    {canSave && (
                        <Button
                            type="button"
                            size="sm"
                            className="bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                                <Save className="h-4 w-4 mr-1" />
                            )}
                            Save as default
                        </Button>
                    )}
                </div>
            </div>

            {/* Weight summary */}
            <div className="flex items-center gap-3 text-sm">
                <Label className="text-xs font-medium">Total weight:</Label>
                <span
                    className={`font-bold ${
                        Math.abs(totalWeight - 100) <= 0.5
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                    }`}
                >
                    {Math.round(totalWeight * 100) / 100}%
                </span>
                <span className="text-gray-400">/ 100%</span>
            </div>

            {/* Rubric table — edit mode */}
            <WeightedRubricTable
                sections={sections}
                onChange={setSections}
                mode="edit"
                allowReorder
            />

            {/* Grade Preview */}
            <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 bg-[#F5EDED]/60 dark:bg-gray-900/60 space-y-3">
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Grade Preview (example)
                </h2>
                <p className="text-xs text-gray-500">
                    Select grades 0–5 per criterion to see how scores aggregate into the final
                    grade.
                </p>
                <WeightedRubricTable
                    sections={sections}
                    onChange={() => {}}
                    mode="grade"
                    grades={previewGrades}
                    onGradesChange={setPreviewGrades}
                    readOnly={false}
                />
                <div className="flex items-center gap-4 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <span className="text-sm font-bold text-[#6B0000]">
                        Final Grade: {Math.round(previewPts * 100) / 100} / {Math.round(totalWeight * 100) / 100}
                    </span>
                    <span className="text-xs text-gray-500">
                        ({totalWeight > 0 ? Math.round((previewPts / totalWeight) * 100) : 0}%)
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <p className="text-xs text-gray-500">
                <Link
                    href={`/courses/${courseId}/settings`}
                    className="text-[#6B0000] underline"
                >
                    ← Back to course settings
                </Link>
                {' · '}
                <Link
                    href={`/courses/${courseId}/assignment/new`}
                    className="text-[#6B0000] underline"
                >
                    Create assignment
                </Link>
            </p>
        </div>
    );
}
