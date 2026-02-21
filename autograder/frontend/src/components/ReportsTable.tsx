'use client';

/* ═══════════════════════════════════════════════════════════════════
   ReportsTable — Spreadsheet-style grade report for faculty
   Features: sticky columns, color-coded cells, sortable, exportable
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useMemo, useCallback } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getGradeColor, getLetterGrade, calculatePercentage } from '@/utils/helpers';

// ── Types ───────────────────────────────────────────────────────────

interface ReportsTableAssignment {
  id: string;
  shortName: string;
  fullName: string;
  maxPoints: number;
}

interface ReportsTableStudent {
  id: string;
  name: string;
  studentId: string;
  sisUserId: string;
  sisLoginId: string;
  section: string;
}

interface ReportsTableProps {
  assignments: ReportsTableAssignment[];
  students: ReportsTableStudent[];
  /** studentId → assignmentId → earned points (null = not submitted). */
  grades: Record<string, Record<string, number | null>>;
  /** studentId → assignmentId → true if late. */
  lateFlags?: Record<string, Record<string, boolean>>;
  onViewStudentReport?: (studentId: string) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf' | 'canvas') => void;
}

type SortField = 'name' | 'studentId' | 'total' | string; // string = assignmentId
type SortDir = 'asc' | 'desc';

type FilterPerformance = 'all' | 'high' | 'mid' | 'low' | 'failing';

// ── Helper: grade cell styling ──────────────────────────────────────

function gradeCellClass(earned: number | null, max: number, isLate: boolean): string {
  if (earned === null) return 'text-gray-300';
  const pct = max > 0 ? (earned / max) * 100 : 0;
  const color = getGradeColor(pct);
  return `${color} ${isLate ? 'italic' : ''}`;
}

// ── Component ───────────────────────────────────────────────────────

export function ReportsTable({
  assignments,
  students,
  grades,
  lateFlags,
  onViewStudentReport,
  onExport,
}: ReportsTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [perfFilter, setPerfFilter] = useState<FilterPerformance>('all');

  // Total possible points
  const totalMaxPoints = useMemo(
    () => assignments.reduce((s, a) => s + a.maxPoints, 0),
    [assignments]
  );

  // Compute per-student totals
  const studentTotals = useMemo(() => {
    const map: Record<string, { earned: number; percentage: number }> = {};
    students.forEach((s) => {
      let earned = 0;
      assignments.forEach((a) => {
        const g = grades[s.id]?.[a.id];
        if (g != null) earned += g;
      });
      map[s.id] = {
        earned,
        percentage: calculatePercentage(earned, totalMaxPoints),
      };
    });
    return map;
  }, [students, assignments, grades, totalMaxPoints]);

  // Filter + sort
  const filteredStudents = useMemo(() => {
    let list = [...students];

    // Text search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.sisLoginId.toLowerCase().includes(q)
      );
    }

    // Performance filter
    if (perfFilter !== 'all') {
      list = list.filter((s) => {
        const pct = studentTotals[s.id]?.percentage ?? 0;
        switch (perfFilter) {
          case 'high': return pct >= 90;
          case 'mid': return pct >= 70 && pct < 90;
          case 'low': return pct >= 60 && pct < 70;
          case 'failing': return pct < 60;
        }
      });
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortField === 'studentId') {
        cmp = a.studentId.localeCompare(b.studentId);
      } else if (sortField === 'total') {
        cmp = (studentTotals[a.id]?.percentage ?? 0) - (studentTotals[b.id]?.percentage ?? 0);
      } else {
        // Sort by assignment grade
        const ga = grades[a.id]?.[sortField] ?? -1;
        const gb = grades[b.id]?.[sortField] ?? -1;
        cmp = ga - gb;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [students, search, perfFilter, sortField, sortDir, grades, studentTotals]);

  // Toggle sort
  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDir('asc');
      }
    },
    [sortField]
  );

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="pl-9"
          />
        </div>

        <Select value={perfFilter} onValueChange={(v) => setPerfFilter(v as FilterPerformance)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All students" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="high">High Performers (≥90%)</SelectItem>
            <SelectItem value="mid">Mid Range (70-89%)</SelectItem>
            <SelectItem value="low">Low Range (60-69%)</SelectItem>
            <SelectItem value="failing">Failing (&lt;60%)</SelectItem>
          </SelectContent>
        </Select>

        {onExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExport('csv')}>
                <FileText className="mr-2 h-4 w-4" /> CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('excel')}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('pdf')}>
                <FileDown className="mr-2 h-4 w-4" /> PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('canvas')}>
                <FileDown className="mr-2 h-4 w-4" /> Canvas Gradebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <span className="text-xs text-gray-400">
          {filteredStudents.length} of {students.length} students
        </span>
      </div>

      {/* Table container with horizontal scroll */}
      <div className="relative overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              {/* Sticky columns */}
              <th
                className="sticky left-0 z-20 cursor-pointer bg-gray-50 px-4 py-3 text-left dark:bg-gray-800"
                onClick={() => toggleSort('name')}
              >
                <span className="flex items-center gap-1">
                  Student Name <SortIcon field="name" />
                </span>
              </th>
              <th className="hidden px-3 py-3 text-left md:table-cell">CWID</th>
              <th className="hidden px-3 py-3 text-left md:table-cell">Username</th>
              <th className="hidden px-3 py-3 text-left lg:table-cell">Section</th>

              {/* Assignment columns */}
              {assignments.map((a) => (
                <th
                  key={a.id}
                  className="cursor-pointer whitespace-nowrap px-3 py-3 text-center"
                  onClick={() => toggleSort(a.id)}
                  title={a.fullName}
                >
                  <span className="flex items-center justify-center gap-1">
                    {a.shortName} <SortIcon field={a.id} />
                  </span>
                </th>
              ))}

              {/* Totals */}
              <th
                className="cursor-pointer px-3 py-3 text-center"
                onClick={() => toggleSort('total')}
              >
                <span className="flex items-center justify-center gap-1">
                  Total <SortIcon field="total" />
                </span>
              </th>
              <th className="px-3 py-3 text-center">%</th>
              <th className="px-3 py-3 text-center">Grade</th>
              {onViewStudentReport && <th className="px-3 py-3 text-center">Action</th>}
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-gray-700">
            {/* Points Possible row */}
            <tr className="bg-gray-100 font-medium text-gray-500 dark:bg-gray-800/60">
              <td className="sticky left-0 z-10 bg-gray-100 px-4 py-2 dark:bg-gray-800/60">
                Points Possible
              </td>
              <td className="hidden px-3 py-2 md:table-cell" />
              <td className="hidden px-3 py-2 md:table-cell" />
              <td className="hidden px-3 py-2 lg:table-cell" />
              {assignments.map((a) => (
                <td key={a.id} className="px-3 py-2 text-center font-semibold">
                  {a.maxPoints}
                </td>
              ))}
              <td className="px-3 py-2 text-center font-semibold">{totalMaxPoints}</td>
              <td className="px-3 py-2 text-center">100%</td>
              <td className="px-3 py-2 text-center" />
              {onViewStudentReport && <td className="px-3 py-2" />}
            </tr>

            {/* Student rows */}
            {filteredStudents.map((student) => {
              const totals = studentTotals[student.id];
              const pct = totals?.percentage ?? 0;
              const earned = totals?.earned ?? 0;

              return (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >
                  <td className="sticky left-0 z-10 bg-white px-4 py-2.5 font-medium text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                    {onViewStudentReport ? (
                      <button
                        className="text-left hover:text-[#6B0000] hover:underline"
                        onClick={() => onViewStudentReport(student.id)}
                      >
                        {student.name}
                      </button>
                    ) : (
                      student.name
                    )}
                  </td>
                  <td className="hidden px-3 py-2.5 text-gray-400 md:table-cell">
                    {student.sisUserId}
                  </td>
                  <td className="hidden px-3 py-2.5 text-gray-400 md:table-cell">
                    {student.sisLoginId}
                  </td>
                  <td className="hidden px-3 py-2.5 text-gray-400 lg:table-cell">
                    {student.section}
                  </td>

                  {/* Grade cells */}
                  {assignments.map((a) => {
                    const g = grades[student.id]?.[a.id] ?? null;
                    const isLate = lateFlags?.[student.id]?.[a.id] ?? false;
                    return (
                      <td
                        key={a.id}
                        className={`px-3 py-2.5 text-center font-medium ${gradeCellClass(g, a.maxPoints, isLate)}`}
                      >
                        {g === null ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          <>
                            {g}
                            {isLate && <span className="text-orange-500">*</span>}
                          </>
                        )}
                      </td>
                    );
                  })}

                  {/* Total */}
                  <td className="px-3 py-2.5 text-center font-semibold text-gray-900 dark:text-gray-100">
                    {earned}/{totalMaxPoints}
                  </td>
                  <td className={`px-3 py-2.5 text-center font-semibold ${getGradeColor(pct)}`}>
                    {pct.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        pct >= 90
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : pct >= 80
                            ? 'bg-red-50 text-[#6B0000]'
                            : pct >= 70
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {getLetterGrade(pct)}
                    </span>
                  </td>
                  {onViewStudentReport && (
                    <td className="px-3 py-2.5 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onViewStudentReport(student.id)}
                        aria-label={`View report for ${student.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}

            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan={6 + assignments.length + (onViewStudentReport ? 4 : 3)}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  No students match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <span>
          <span className="text-orange-500">*</span> Late submission
        </span>
        <span>
          <span className="text-gray-300">—</span> Not submitted
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500" /> ≥90%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#6B0000]" /> 80-89%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500" /> 70-79%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" /> &lt;70%
        </span>
      </div>
    </div>
  );
}
