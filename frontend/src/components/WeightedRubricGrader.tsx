import React, { useState, useMemo } from 'react';
import { RubricSection, RubricCriterion } from '@/types';

interface RubricGradeEntry {
  criterionId: string;
  grade: number; // 0-5
  percentWeight: number; // 1-100
  points: number;
  comment: string;
}

interface SectionGrades {
  sectionId: string;
  sectionName: string;
  grades: RubricGradeEntry[];
}

interface WeightedRubricGraderProps {
  sections: RubricSection[];
  maxPoints?: number;
  onSave?: (grades: SectionGrades[]) => void;
  readOnly?: boolean;
}

export function WeightedRubricGrader({ sections, maxPoints = 100, onSave, readOnly = false }: WeightedRubricGraderProps) {
  const [sectionGrades, setSectionGrades] = useState<SectionGrades[]>(
    sections.map((section) => ({
      sectionId: section.id || '',
      sectionName: section.name,
      grades: (section.criteria || []).map((criterion) => ({
        criterionId: criterion.id || '',
        grade: 0,
        percentWeight: criterion.weight || 0,
        points: 0,
        comment: '',
      })),
    }))
  );

  const [lateDeduction, setLateDeduction] = useState(0);
  const [creditAdjustment, setCreditAdjustment] = useState(0);
  const [deliverableDeduction, setDeliverableDeduction] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [generalComments, setGeneralComments] = useState('');

  // Calculate totals
  const calculations = useMemo(() => {
    let totalWeightPercent = 0;
    let totalPoints = 0;
    let totalWeightedPoints = 0;

    sectionGrades.forEach((section) => {
      section.grades.forEach((grade) => {
        totalWeightPercent += grade.percentWeight;
        totalPoints += grade.points;
        totalWeightedPoints += (grade.points / 100) * grade.percentWeight;
      });
    });

    const finalGradeBeforeDeductions = totalWeightedPoints;
    const finalGradeAfterDeductions = Math.max(
      0,
      finalGradeBeforeDeductions - lateDeduction - deliverableDeduction + creditAdjustment + bonus
    );

    return {
      totalWeightPercent,
      totalPoints,
      totalWeightedPoints,
      finalGradeBeforeDeductions,
      finalGradeAfterDeductions,
      isWeightValid: Math.abs(totalWeightPercent - 100) < 0.01,
    };
  }, [sectionGrades, lateDeduction, creditAdjustment, deliverableDeduction, bonus]);

  const handleGradeChange = (sectionIdx: number, gradeIdx: number, field: keyof RubricGradeEntry, value: any) => {
    setSectionGrades((prev) => {
      const updated = [...prev];
      const grade = { ...updated[sectionIdx].grades[gradeIdx] };

      if (field === 'grade') {
        grade.grade = Math.max(0, Math.min(5, Number(value)));
      } else if (field === 'percentWeight') {
        const newWeight = Math.max(0, Number(value));
        
        // Calculate total weight WITHOUT this criterion's current weight
        let totalWithoutThis = 0;
        sectionGrades.forEach((section, sIdx) => {
          section.grades.forEach((g, gIdx) => {
            if (sIdx !== sectionIdx || gIdx !== gradeIdx) {
              totalWithoutThis += g.percentWeight;
            }
          });
        });
        
        // Cap the new weight so total doesn't exceed 100
        grade.percentWeight = Math.min(newWeight, Math.max(0, 100 - totalWithoutThis));
      } else if (field === 'points') {
        grade.points = Math.max(0, Math.min(100, Number(value)));
      } else if (field === 'comment') {
        grade.comment = value;
      }

      updated[sectionIdx].grades[gradeIdx] = grade;
      return updated;
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(sectionGrades);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Rubric Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border p-2 text-left font-semibold">Criteria</th>
              <th className="border p-2 text-center font-semibold">Grade (0-5)</th>
              <th className="border p-2 text-center font-semibold">% Weight (1-100)</th>
              <th className="border p-2 text-center font-semibold">Pts</th>
              <th className="border p-2 text-left font-semibold">Instructor Comments</th>
            </tr>
          </thead>
          <tbody>
            {sectionGrades.map((section, sectionIdx) => (
              <React.Fragment key={section.sectionId}>
                {/* Section Header */}
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td colSpan={5} className="border p-2 font-bold">
                    {section.sectionName}
                  </td>
                </tr>

                {/* Section Criteria */}
                {section.grades.map((grade, gradeIdx) => (
                  <tr
                    key={`${sectionIdx}-${gradeIdx}`}
                    className={gradeIdx % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}
                  >
                    <td className="border p-2">
                      {sections[sectionIdx]?.criteria?.[gradeIdx]?.name || `Criterion ${gradeIdx + 1}`}
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={grade.grade}
                        onChange={(e) => handleGradeChange(sectionIdx, gradeIdx, 'grade', e.target.value)}
                        disabled={readOnly}
                        className="w-12 text-center border rounded px-1 py-1 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.percentWeight}
                        onChange={(e) => handleGradeChange(sectionIdx, gradeIdx, 'percentWeight', e.target.value)}
                        disabled={readOnly}
                        className="w-16 text-center border rounded px-1 py-1 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                      />
                    </td>
                    <td className="border p-2 text-center font-semibold">
                      <span>{grade.points}</span>
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={grade.comment}
                        onChange={(e) => handleGradeChange(sectionIdx, gradeIdx, 'comment', e.target.value)}
                        disabled={readOnly}
                        placeholder="Add instructor comment..."
                        className="w-full border rounded px-2 py-1 text-xs dark:bg-gray-800 dark:text-white disabled:opacity-50"
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}

            {/* Totals Row */}
            <tr className="bg-gray-200 dark:bg-gray-700 font-bold border-t-2 border-gray-400">
              <td className="border p-2">Totals</td>
              <td className="border p-2 text-center">-</td>
              <td className="border p-2 text-center">
                <span style={{ color: calculations.isWeightValid ? '#166534' : '#991B1B' }}>
                  {calculations.totalWeightPercent.toFixed(1)}%
                </span>
              </td>
              <td className="border p-2 text-center">{calculations.totalPoints}</td>
              <td className="border p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Deductions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded bg-gray-50 dark:bg-gray-900">
        <div>
          <label className="block text-sm font-semibold mb-2">Late Deduction (10% per day)</label>
          <input
            type="number"
            min="0"
            value={lateDeduction}
            onChange={(e) => setLateDeduction(Math.max(0, Number(e.target.value)))}
            disabled={readOnly}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Credit Adjustment (less than A credit)</label>
          <input
            type="number"
            min="0"
            value={creditAdjustment}
            onChange={(e) => setCreditAdjustment(Math.max(0, Number(e.target.value)))}
            disabled={readOnly}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Part 1 Deliverables Deduction</label>
          <input
            type="number"
            min="0"
            value={deliverableDeduction}
            onChange={(e) => setDeliverableDeduction(Math.max(0, Number(e.target.value)))}
            disabled={readOnly}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Bonus</label>
          <input
            type="number"
            min="0"
            value={bonus}
            onChange={(e) => setBonus(Math.max(0, Number(e.target.value)))}
            disabled={readOnly}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          />
        </div>
      </div>

      {/* Final Grade Section */}
      <div className="border-t-2 border-gray-400 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Final Grade:</span>
          <span className="text-2xl font-bold text-[#6B0000]">
            {calculations.finalGradeAfterDeductions.toFixed(0)} / {maxPoints}
          </span>
        </div>
      </div>

      {/* Instructor Comments */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Instructor's Comments</label>
        <textarea
          value={generalComments}
          onChange={(e) => setGeneralComments(e.target.value)}
          disabled={readOnly}
          placeholder="Add overall comments..."
          className="w-full h-24 border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white disabled:opacity-50"
        />
      </div>

      {/* Save Button */}
      {!readOnly && (
        <button
          onClick={handleSave}
          className="w-full bg-[#6B0000] text-white py-2 px-4 rounded font-semibold hover:bg-[#8B0000] transition"
        >
          Save Rubric Grades
        </button>
      )}
    </div>
  );
}
