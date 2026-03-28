import type { GradingMethod, RubricCriterion, RubricSection } from '@/types';

type RubricInput = RubricSection[] | RubricCriterion[] | null | undefined;

const DEFAULT_GRADING_METHOD: GradingMethod = 'manual';
const DEFAULT_SECTION_NAME = 'General';

function toFiniteNumber(value: unknown, fallback: number): number {
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
        return fallback;
    }
    return value;
}

function toStringValue(value: unknown, fallback: string): string {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function buildStableId(prefix: string, index: number, label: string): string {
    const slug = slugify(label) || `${prefix}-${index + 1}`;
    return `${prefix}-${index + 1}-${slug}`;
}

export function isRubricSectionItem(value: unknown): value is RubricSection {
    if (!value || typeof value !== 'object') return false;
    const maybeSection = value as { criteria?: unknown };
    return Array.isArray(maybeSection.criteria);
}

function normalizeCriterion(
    value: Partial<RubricCriterion>,
    sectionIndex: number,
    criterionIndex: number
): RubricCriterion {
    const name = toStringValue(value.name, `Criterion ${criterionIndex + 1}`);
    const id =
        typeof value.id === 'string' && value.id.trim().length > 0
            ? value.id
            : buildStableId(`criterion-s${sectionIndex + 1}`, criterionIndex, name);
    const gradingMethod =
        value.gradingMethod === 'auto' || value.gradingMethod === 'hybrid' || value.gradingMethod === 'manual'
            ? value.gradingMethod
            : DEFAULT_GRADING_METHOD;

    return {
        id,
        name,
        description: toStringValue(value.description, ''),
        maxPoints: toFiniteNumber(value.maxPoints, 0),
        weight: toFiniteNumber(value.weight, 1),
        gradingMethod,
    };
}

function normalizeSection(
    value: Partial<RubricSection>,
    sectionIndex: number
): RubricSection {
    const name = toStringValue(value.name, `${DEFAULT_SECTION_NAME} ${sectionIndex + 1}`);
    const id =
        typeof value.id === 'string' && value.id.trim().length > 0
            ? value.id
            : buildStableId('section', sectionIndex, name);
    const rawCriteria = Array.isArray(value.criteria) ? value.criteria : [];

    return {
        id,
        name,
        description: toStringValue(value.description, ''),
        weight: toFiniteNumber(value.weight, 100),
        criteria: rawCriteria.map((criterion, criterionIndex) =>
            normalizeCriterion(criterion, sectionIndex, criterionIndex)
        ),
    };
}

export function normalizeRubricToSections(rubric: RubricInput): RubricSection[] {
    if (!Array.isArray(rubric) || rubric.length === 0) return [];

    const sections: RubricSection[] = [];
    const standaloneCriteria: RubricCriterion[] = [];

    rubric.forEach((item) => {
        if (isRubricSectionItem(item)) {
            sections.push(normalizeSection(item, sections.length));
            return;
        }

        if (item && typeof item === 'object') {
            standaloneCriteria.push(normalizeCriterion(item as Partial<RubricCriterion>, 0, standaloneCriteria.length));
            return;
        }
    });

    if (standaloneCriteria.length > 0) {
        sections.push({
            id: buildStableId('section', sections.length, DEFAULT_SECTION_NAME),
            name: DEFAULT_SECTION_NAME,
            description: '',
            weight: 100,
            criteria: standaloneCriteria,
        });
    }

    return sections;
}

export function normalizeRubricToCriteria(rubric: RubricInput): RubricCriterion[] {
    return normalizeRubricToSections(rubric).flatMap((section) => section.criteria);
}
