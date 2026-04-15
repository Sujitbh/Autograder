export type RubricWeightPolicy = 'percent' | 'points';

export interface RubricFormCriterion {
    name: string;
    description: string;
    maxPoints: number;
    weight: number;
    gradingMethod: 'auto' | 'manual' | 'hybrid';
    defaultComments?: Record<string, string>;
}

export interface RubricFormSection {
    name: string;
    description: string;
    weight: number;
    criteria: RubricFormCriterion[];
}

export interface CourseDefaultRubricCriterionApi {
    name: string;
    description: string;
    maxPoints: number;
    weight: number;
    gradingMethod: 'auto' | 'manual' | 'hybrid';
    defaultComments?: Record<string, string> | null;
}

export interface CourseDefaultRubricSectionApi {
    name: string;
    description: string;
    weight: number;
    criteria: CourseDefaultRubricCriterionApi[];
}

export interface CourseDefaultRubricApi {
    rubricMode: 'weighted' | 'unweighted';
    weightPolicy: RubricWeightPolicy;
    pointBudget: number;
    sections: CourseDefaultRubricSectionApi[];
    isBuiltin: boolean;
    updatedAt?: string | null;
    updatedByUserId?: number | null;
    updatedByName?: string | null;
}

export interface CourseDefaultRubricPutApi {
    rubricMode: 'weighted' | 'unweighted';
    weightPolicy: RubricWeightPolicy;
    pointBudget: number;
    sections: CourseDefaultRubricSectionApi[];
    autoNormalize: boolean;
}

/** Grade scale used across the rubric */
export const GRADE_SCALE = [0, 1, 2, 3, 4, 5] as const;
export const MAX_GRADE = 5;

/** Calculate points for a criterion: (grade / maxGrade) × weight */
export function criterionPoints(grade: number, weight: number): number {
    return Math.round(((grade / MAX_GRADE) * weight) * 100) / 100;
}

/** Convert course default API response → Create Assignment form slice. */
export function courseDefaultApiToFormPartial(api: CourseDefaultRubricApi): {
    rubricMode: 'weighted' | 'unweighted';
    rubricWeightKind: RubricWeightPolicy;
    rubric: RubricFormSection[];
} {
    const rubric: RubricFormSection[] = api.sections.map((s) => ({
        name: s.name,
        description: s.description ?? '',
        weight: s.weight,
        criteria: (s.criteria ?? []).map((c) => ({
            name: c.name,
            description: c.description ?? '',
            maxPoints: c.maxPoints ?? 5,
            weight: c.weight,
            gradingMethod: c.gradingMethod,
            defaultComments: c.defaultComments ?? undefined,
        })),
    }));

    return {
        rubricMode: api.rubricMode,
        rubricWeightKind: api.weightPolicy,
        rubric,
    };
}

export function formRubricToCoursePutApi(data: {
    rubric: RubricFormSection[];
    rubricMode: 'weighted' | 'unweighted';
    rubricWeightKind?: RubricWeightPolicy;
    maxPoints: number;
}): CourseDefaultRubricPutApi {
    const weightPolicy = data.rubricWeightKind ?? 'percent';
    const pointBudget = data.maxPoints > 0 ? data.maxPoints : 100;
    return {
        rubricMode: data.rubricMode,
        weightPolicy,
        pointBudget,
        sections: (data.rubric ?? []).map((s) => ({
            name: s.name,
            description: s.description ?? '',
            weight: s.weight ?? 0,
            criteria: (s.criteria ?? []).map((c) => ({
                name: c.name,
                description: c.description ?? '',
                maxPoints: c.maxPoints ?? 5,
                weight: typeof c.weight === 'number' ? c.weight : 0,
                gradingMethod: c.gradingMethod,
                defaultComments: c.defaultComments ?? null,
            })),
        })),
        autoNormalize: true,
    };
}
