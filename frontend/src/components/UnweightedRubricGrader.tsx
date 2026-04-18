import React, { useMemo, useState } from 'react';
import { RubricSection, RubricCriterion } from '@/types';

interface UnweightedRubricGraderProps {
  sections: RubricSection[];
  onSave?: (grades: any) => void;
  readOnly?: boolean;
}

export function UnweightedRubricGrader({
  sections,
  onSave,
  readOnly = false,
}: UnweightedRubricGraderProps) {
  const [grades, setGrades] = useState<Map<string, number>>(new Map());
  const [generalComments, setGeneralComments] = useState('');

  // Separate regular criteria from penalties
  const regularSections = useMemo(() => {
    return sections.filter((s) => {
      const hasPenalties = (s.criteria || []).some((c) => (c.maxPoints || 0) < 0);
      return !hasPenalties;
    });
  }, [sections]);

  const penaltiesSection = useMemo(() => {
    return sections.find((s) => (s.criteria || []).some((c) => (c.maxPoints || 0) < 0));
  }, [sections]);

  // Calculate total max points (excluding penalties)
  const totalMaxPoints = useMemo(() => {
    return regularSections.reduce((sum, section) => {
      return sum + (section.criteria || []).reduce((s, c) => s + (c.maxPoints || 0), 0);
    }, 0);
  }, [regularSections]);

  // Calculate totals
  const calculations = useMemo(() => {
    let totalAwarded = 0;
    let totalDeductions = 0;

    // Regular criteria
    regularSections.forEach((section) => {
      (section.criteria || []).forEach((criterion) => {
        const awarded = grades.get(criterion.id || '') || 0;
        totalAwarded += awarded;
      });
    });

    // Penalties/deductions
    if (penaltiesSection) {
      (penaltiesSection.criteria || []).forEach((criterion) => {
        const deduction = Math.abs(grades.get(criterion.id || '') || 0);
        totalDeductions += deduction;
      });
    }

    const finalScore = Math.max(0, totalAwarded - totalDeductions);

    return {
      totalAwarded,
      totalDeductions,
      finalScore,
    };
  }, [grades, regularSections, penaltiesSection]);

  const handlePointsChange = (criterionId: string, value: string) => {
    const numValue = Math.max(0, Number(value) || 0);
    setGrades((prev) => new Map(prev).set(criterionId, numValue));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ grades, generalComments, finalScore: calculations.finalScore });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Grading:</h3>

      {/* Main Rubric Table */}
      <div className="border-2 border-black dark:border-white overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            {/* Total Points Header */}
            <tr className="border-b-2 border-black dark:border-white">
              <td className="border-r-2 border-black dark:border-white p-4 font-bold text-lg bg-gray-100 dark:bg-gray-800">
                Total Points
              </td>
              <td className="p-4 font-bold text-lg text-center bg-gray-100 dark:bg-gray-800 w-40">
                {calculations.finalScore} / {totalMaxPoints} points
              </td>
            </tr>

            {/* Regular Categories and Criteria */}
            {regularSections.map((section) => {
              const sectionAttemptedPoints = (section.criteria || []).reduce((sum, c) => {
                const awarded = grades.get(c.id || '') || 0;
                return sum + awarded;
              }, 0);
              const sectionMaxPoints = (section.criteria || []).reduce((sum, c) => sum + (c.maxPoints || 0), 0);

              return (
                <React.Fragment key={section.id}>
                  {/* Section Header Row */}
                  <tr className="border-b border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                    <td className="border-r-2 border-black dark:border-white p-3 font-bold">
                      {section.name}
                    </td>
                    <td className="p-3 font-bold text-center text-gray-600 dark:text-gray-300 w-40">
                      {sectionMaxPoints} points
                    </td>
                  </tr>

                  {/* Criteria Rows */}
                  {(section.criteria || []).map((criterion) => {
                    const awarded = grades.get(criterion.id || '') || 0;
                    const maxPts = criterion.maxPoints || 0;

                    return (
                      <tr key={criterion.id} className="border-b border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <td className="border-r-2 border-black dark:border-white p-3 pl-8">
                          {criterion.name}
                        </td>
                        <td className="p-3 text-center w-40">
                          <div className="flex items-center justify-center gap-2.5">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max={maxPts}
                              value={awarded}
                              onChange={(e) => handlePointsChange(criterion.id || '', e.target.value)}
                              disabled={readOnly}
                              className="w-16 px-2 py-1 border border-gray-400 rounded text-center font-semibold dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-50"
                            />
                            <span className="text-gray-600 dark:text-gray-300 font-medium">/ {maxPts}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}

            {/* Deductions Section */}
            {penaltiesSection && (
              <>
                <tr className="border-b border-gray-400 dark:border-gray-600 bg-red-100 dark:bg-red-950">
                  <td className="border-r-2 border-black dark:border-white p-3 font-bold text-red-800 dark:text-red-200">
                    {penaltiesSection.name}
                  </td>
                  <td className="p-3 font-bold text-center text-red-800 dark:text-red-200 w-40">
                    Deductions
                  </td>
                </tr>

                {(penaltiesSection.criteria || []).map((criterion) => {
                  const deduction = grades.get(criterion.id || '') || 0;

                  return (
                    <tr key={criterion.id} className="border-b border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
                      <td className="border-r-2 border-black dark:border-white p-3 pl-8 text-red-800 dark:text-red-200">
                        {criterion.name}
                      </td>
                      <td className="p-3 text-center w-40">
                        <div className="flex items-center justify-center gap-2.5">
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={deduction}
                            onChange={(e) => handlePointsChange(criterion.id || '', e.target.value)}
                            disabled={readOnly}
                            className="w-16 px-2 py-1 border border-red-400 rounded text-center font-semibold bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 dark:border-red-600 disabled:opacity-50"
                          />
                          <span className="text-red-700 dark:text-red-200 font-medium">pt</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Score Summary Box */}
      <div className="border-2 border-black dark:border-white p-4 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Earned Points:</p>
            <p className="text-xl font-bold">{calculations.totalAwarded} points</p>
          </div>

          {calculations.totalDeductions > 0 && (
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Deductions:</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">-{calculations.totalDeductions} pts</p>
            </div>
          )}

          <div className="border-l-2 border-black dark:border-white pl-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Final Score:</p>
            <p className="text-2xl font-bold text-[#6B0000]">{calculations.finalScore} points</p>
          </div>
        </div>
      </div>

      {/* Instructor Comments */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Instructor's Comments</label>
        <textarea
          value={generalComments}
          onChange={(e) => setGeneralComments(e.target.value)}
          disabled={readOnly}
          placeholder="Add feedback..."
          className="w-full h-24 border-2 border-gray-400 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white disabled:opacity-50"
        />
      </div>

      {/* Save Button */}
      {!readOnly && (
        <button
          onClick={handleSave}
          className="w-full bg-[#6B0000] text-white py-3 px-4 rounded font-semibold hover:bg-[#8B0000] transition"
        >
          Save Grades
        </button>
      )}
    </div>
  );
}
