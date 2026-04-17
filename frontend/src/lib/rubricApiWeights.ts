/** Align rubric weights with backend `assignments` routes (global % vs legacy fraction). */

export function toCriterionWeightPercent(weight?: number | string | null): number {
    if (weight == null) return 0;
    const numeric = typeof weight === 'number' ? weight : Number.parseFloat(String(weight).replace('%', '').trim());
    if (!Number.isFinite(numeric)) return 0;
    if (numeric >= 0 && numeric <= 1.5) return numeric * 100;
    return numeric;
}

/** Criterion `weight` field for POST /assignments and POST /assignments/:id/rubric */
export function criterionWeightForAssignmentApi(
    rubricMode: 'weighted' | 'unweighted',
    criterionWeight: unknown,
    sectionWeight: number
): number {
    if (rubricMode === 'weighted') {
        if (criterionWeight == null) return toCriterionWeightPercent(sectionWeight);
        if (typeof criterionWeight === 'number' && criterionWeight <= 1.5) return criterionWeight;
        return toCriterionWeightPercent(criterionWeight as number | string | null | undefined);
    }
    if (criterionWeight == null) return toCriterionWeightPercent(100) / 100;
    if (typeof criterionWeight === 'number' && criterionWeight <= 1.5) return criterionWeight;
    return toCriterionWeightPercent(criterionWeight as number | string | null | undefined) / 100;
}
