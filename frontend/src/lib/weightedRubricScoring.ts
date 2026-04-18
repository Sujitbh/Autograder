export interface WeightedCriterionInput {
  id?: number | string | null;
  name?: string | null;
  weight?: number | null;
}

export interface WeightedSectionInput<TCriterion extends WeightedCriterionInput = WeightedCriterionInput> {
  id?: number | string | null;
  name?: string | null;
  weight?: number | null;
  criteria?: TCriterion[] | null;
}

export interface WeightedCriterionResolved<TCriterion extends WeightedCriterionInput = WeightedCriterionInput> {
  key: string;
  sectionIndex: number;
  criterionIndex: number;
  sectionWeightPercent: number;
  criterionWeightPercent: number;
  effectiveWeightPercent: number;
  criterion: TCriterion;
}

const EPSILON = 0.0001;

export function toWeightPercent(weight?: number | null, fallback = 0): number {
  if (weight == null || Number.isNaN(weight)) return fallback;
  const n = Number(weight);
  if (!Number.isFinite(n)) return fallback;
  return n <= 1.5 ? n * 100 : n;
}

export function toCriterionKey(
  section: { id?: number | string | null; name?: string | null },
  criterion: { id?: number | string | null; name?: string | null },
  sectionIndex: number,
  criterionIndex: number,
): string {
  const sid = section.id ?? section.name ?? sectionIndex;
  const cid = criterion.id ?? criterion.name ?? criterionIndex;
  return `${String(sid)}::${String(cid)}::${sectionIndex}::${criterionIndex}`;
}

function resolveSectionCriterionWeights(
  sectionWeightPercent: number,
  criterionWeightsPercent: Array<number | null>,
): number[] {
  const n = criterionWeightsPercent.length;
  if (n === 0) return [];

  const sanitizedSectionWeight = Math.max(0, sectionWeightPercent);
  const presentWeights = criterionWeightsPercent.map((w) => (w == null ? 0 : Math.max(0, w)));
  const totalPresent = presentWeights.reduce((sum, w) => sum + w, 0);

  if (totalPresent <= EPSILON) {
    const each = sanitizedSectionWeight > EPSILON ? sanitizedSectionWeight / n : 0;
    return Array.from({ length: n }, () => each);
  }

  const globalTotal = totalPresent;
  const relativeTotal = (totalPresent * sanitizedSectionWeight) / 100;
  const globalDiff = Math.abs(globalTotal - sanitizedSectionWeight);
  const relativeDiff = Math.abs(relativeTotal - sanitizedSectionWeight);
  const useGlobalWeights = globalDiff <= relativeDiff;

  if (useGlobalWeights) return presentWeights;
  return presentWeights.map((w) => (w * sanitizedSectionWeight) / 100);
}

export function buildResolvedWeightedCriteria<TSection extends WeightedSectionInput<TCriterion>, TCriterion extends WeightedCriterionInput>(
  sections: TSection[],
): WeightedCriterionResolved<TCriterion>[] {
  const resolved: WeightedCriterionResolved<TCriterion>[] = [];

  (sections ?? []).forEach((section, sectionIndex) => {
    const criteria = (section.criteria ?? []).filter(Boolean) as TCriterion[];
    if (criteria.length === 0) return;

    const sectionWeightPercent = toWeightPercent(section.weight, 100);
    const criterionWeightsPercent = criteria.map((criterion) => {
      if (criterion.weight == null || Number.isNaN(Number(criterion.weight))) return null;
      return toWeightPercent(Number(criterion.weight), 0);
    });
    const effectiveWeights = resolveSectionCriterionWeights(sectionWeightPercent, criterionWeightsPercent);

    criteria.forEach((criterion, criterionIndex) => {
      resolved.push({
        key: toCriterionKey(section, criterion, sectionIndex, criterionIndex),
        sectionIndex,
        criterionIndex,
        sectionWeightPercent,
        criterionWeightPercent: Math.max(0, criterionWeightsPercent[criterionIndex] ?? 0),
        effectiveWeightPercent: Math.max(0, effectiveWeights[criterionIndex] ?? 0),
        criterion,
      });
    });
  });

  return resolved;
}

export function calculateWeightedCriterionPoints(rating: number, effectiveWeightPercent: number): number {
  const clampedRating = Math.max(0, Math.min(Number(rating) || 0, 5));
  const weight = Math.max(0, Number(effectiveWeightPercent) || 0);
  return (clampedRating / 5) * weight;
}

export function calculateWeightedTotalPoints(entries: Array<{ rating: number; effectiveWeightPercent: number }>): number {
  return entries.reduce(
    (sum, entry) => sum + calculateWeightedCriterionPoints(entry.rating, entry.effectiveWeightPercent),
    0,
  );
}

export function formatPointValue(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < EPSILON) {
    return String(Math.round(rounded));
  }
  return rounded.toFixed(2);
}
