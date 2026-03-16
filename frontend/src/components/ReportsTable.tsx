'use client';

/* ═══════════════════════════════════════════════════════════════════
   ReportsTable — Clean professional gradebook for faculty
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { getLetterGrade, calculatePercentage } from '@/utils/helpers';

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
  /** studentId → assignmentId → explicit report status. */
  gradeStatuses?: Record<string, Record<string, 'graded' | 'ungraded' | 'missing' | 'not_submitted'>>;
  /** studentId → assignmentId → true if late. */
  lateFlags?: Record<string, Record<string, boolean>>;
  onViewStudentReport?: (studentId: string) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf' | 'canvas') => void;
}

type SortField = 'name' | 'studentId' | 'total' | string;
type SortDir = 'asc' | 'desc';
type FilterPerformance = 'all' | 'high' | 'mid' | 'low' | 'failing';

// ── Component ───────────────────────────────────────────────────────

export function ReportsTable({
  assignments,
  students,
  grades,
  gradeStatuses,
  lateFlags,
  onViewStudentReport,
  onExport,
}: ReportsTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [perfFilter, setPerfFilter] = useState<FilterPerformance>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const getStatus = useCallback((studentId: string, assignmentId: string) => {
    return gradeStatuses?.[studentId]?.[assignmentId] ?? (grades[studentId]?.[assignmentId] != null ? 'graded' : 'not_submitted');
  }, [gradeStatuses, grades]);

  const totalMaxPoints = useMemo(
    () => assignments.reduce((s, a) => s + a.maxPoints, 0),
    [assignments]
  );

  const studentTotals = useMemo(() => {
    const map: Record<string, { earned: number; possible: number; percentage: number }> = {};
    students.forEach((s) => {
      let earned = 0;
      let possible = 0;
      assignments.forEach((a) => {
        const g = grades[s.id]?.[a.id];
        const status = getStatus(s.id, a.id);
        if (status === 'graded' && g != null) {
          earned += g;
          possible += a.maxPoints;
        } else if (status === 'missing') {
          possible += a.maxPoints;
        }
      });
      map[s.id] = {
        earned,
        possible,
        percentage: calculatePercentage(earned, possible),
      };
    });
    return map;
  }, [students, assignments, grades, getStatus]);

  const filteredStudents = useMemo(() => {
    let list = [...students];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.sisLoginId.toLowerCase().includes(q)
      );
    }

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

    if (showSelectedOnly) {
      list = list.filter((s) => selectedStudentIds.has(s.id));
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortField === 'studentId') {
        cmp = a.studentId.localeCompare(b.studentId);
      } else if (sortField === 'total') {
        cmp = (studentTotals[a.id]?.percentage ?? 0) - (studentTotals[b.id]?.percentage ?? 0);
      } else {
        const ga = grades[a.id]?.[sortField] ?? -1;
        const gb = grades[b.id]?.[sortField] ?? -1;
        cmp = ga - gb;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [students, search, perfFilter, showSelectedOnly, selectedStudentIds, sortField, sortDir, grades, studentTotals]);

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
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-25 inline-block ml-1" />;
    return sortDir === 'asc'
      ? <ArrowUp className="h-3 w-3 inline-block ml-1" />
      : <ArrowDown className="h-3 w-3 inline-block ml-1" />;
  }

  const allVisibleSelected = filteredStudents.length > 0 && filteredStudents.every((student) => selectedStudentIds.has(student.id));

  const toggleStudentSelection = useCallback((studentId: string) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }, []);

  const toggleSelectVisible = useCallback(() => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (filteredStudents.length > 0 && filteredStudents.every((student) => next.has(student.id))) {
        filteredStudents.forEach((student) => next.delete(student.id));
      } else {
        filteredStudents.forEach((student) => next.add(student.id));
      }
      return next;
    });
  }, [filteredStudents]);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--color-text-light)' }} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="pl-9 border-[var(--color-border)]"
          />
        </div>

        <Select value={perfFilter} onValueChange={(v) => setPerfFilter(v as FilterPerformance)}>
          <SelectTrigger className="w-[180px] border-[var(--color-border)]">
            <SelectValue placeholder="All Students" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="high">High Performers (≥90%)</SelectItem>
            <SelectItem value="mid">Mid Range (70–89%)</SelectItem>
            <SelectItem value="low">Low Range (60–69%)</SelectItem>
            <SelectItem value="failing">Failing (&lt;60%)</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="border-[var(--color-border)]" onClick={toggleSelectVisible}>
          {allVisibleSelected ? 'Clear Visible' : 'Select Visible'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-[var(--color-border)]"
          onClick={() => setShowSelectedOnly((value) => !value)}
          disabled={selectedStudentIds.size === 0}
        >
          {showSelectedOnly ? 'Show All' : `Show Selected (${selectedStudentIds.size})`}
        </Button>

        {onExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-[var(--color-border)]">
                <Download className="mr-1.5 h-4 w-4" /> Export
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

        <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
          {filteredStudents.length} of {students.length} students
        </span>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg border"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <th className="px-3 py-3 text-center" style={{ width: 44 }}>
                <Checkbox checked={allVisibleSelected} onCheckedChange={() => toggleSelectVisible()} aria-label="Select visible students" />
              </th>
              <th
                className="sticky left-0 z-20 cursor-pointer px-4 py-3 text-left"
                style={{ backgroundColor: 'var(--color-surface)', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '0.04em', textTransform: 'uppercase', minWidth: 180 }}
                onClick={() => toggleSort('name')}
              >
                Student Name <SortIcon field="name" />
              </th>
              <th className="hidden px-3 py-3 text-left md:table-cell" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                CWID
              </th>
              <th className="hidden px-3 py-3 text-left md:table-cell" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Username
              </th>

              {assignments.map((a) => (
                <th
                  key={a.id}
                  className="cursor-pointer whitespace-nowrap px-3 py-3 text-center"
                  style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '0.04em', textTransform: 'uppercase' }}
                  onClick={() => toggleSort(a.id)}
                  title={a.fullName}
                >
                  {a.shortName} <SortIcon field={a.id} />
                </th>
              ))}

              <th
                className="cursor-pointer px-3 py-3 text-center"
                style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                onClick={() => toggleSort('total')}
              >
                Total <SortIcon field="total" />
              </th>
              <th className="px-3 py-3 text-center" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>%</th>
              <th className="px-3 py-3 text-center" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Grade</th>
              {onViewStudentReport && (
                <th className="px-3 py-3 text-center" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {/* Points Possible row */}
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#F9F9F9' }}>
              <td className="px-3 py-2.5" />
              <td
                className="sticky left-0 z-10 px-4 py-2.5"
                style={{ backgroundColor: '#F9F9F9', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-mid)' }}
              >
                Points Possible
              </td>
              <td className="hidden px-3 py-2.5 md:table-cell" />
              <td className="hidden px-3 py-2.5 md:table-cell" />
              {assignments.map((a) => (
                <td key={a.id} className="px-3 py-2.5 text-center" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-mid)' }}>
                  {a.maxPoints}
                </td>
              ))}
              <td className="px-3 py-2.5 text-center" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-mid)' }}>{totalMaxPoints}</td>
              <td className="px-3 py-2.5 text-center" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>100%</td>
              <td className="px-3 py-2.5 text-center" />
              {onViewStudentReport && <td className="px-3 py-2.5" />}
            </tr>

            {/* Student rows */}
            {filteredStudents.map((student) => {
              const totals = studentTotals[student.id];
              const pct = totals?.percentage ?? 0;
              const earned = totals?.earned ?? 0;
              const possible = totals?.possible ?? 0;
              const letter = getLetterGrade(pct);

              return (
                <tr
                  key={student.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary-bg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedStudentIds.has(student.id)}
                      onCheckedChange={() => toggleStudentSelection(student.id)}
                      aria-label={`Select ${student.name}`}
                    />
                  </td>
                  <td
                    className="sticky left-0 z-10 px-4 py-3"
                    style={{ backgroundColor: 'var(--color-surface)', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}
                  >
                    {onViewStudentReport ? (
                      <button
                        className="text-left hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                        onClick={() => onViewStudentReport(student.id)}
                      >
                        {student.name}
                      </button>
                    ) : (
                      student.name
                    )}
                  </td>
                  <td className="hidden px-3 py-3 md:table-cell" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                    {student.sisUserId || '—'}
                  </td>
                  <td className="hidden px-3 py-3 md:table-cell" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                    {student.sisLoginId}
                  </td>

                  {/* Grade cells — neutral, no color coding */}
                  {assignments.map((a) => {
                    const g = grades[student.id]?.[a.id] ?? null;
                    const isLate = lateFlags?.[student.id]?.[a.id] ?? false;
                    const status = getStatus(student.id, a.id);
                    return (
                      <td key={a.id} className="px-3 py-3 text-center" style={{ fontSize: '14px' }}>
                        {status === 'graded' && g !== null ? (
                          <span style={{ fontWeight: 500, color: 'var(--color-text-dark)' }}>
                            {g}{isLate && <sup style={{ color: 'var(--color-text-light)', fontSize: '10px' }}>L</sup>}
                          </span>
                        ) : status === 'ungraded' ? (
                          <span style={{ color: '#8A5700', fontWeight: 600, fontSize: '12px' }}>Ungraded</span>
                        ) : status === 'missing' ? (
                          <span style={{ color: '#8B0000', fontWeight: 600, fontSize: '12px' }}>Missing</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-light)', fontSize: '12px' }}>Not Submitted</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="px-3 py-3 text-center" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                    {earned}/{possible || totalMaxPoints}
                  </td>
                  <td className="px-3 py-3 text-center" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-mid)' }}>
                    {possible > 0 ? `${pct.toFixed(1)}%` : '—'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-dark)',
                        backgroundColor: 'var(--color-surface)',
                        minWidth: '32px',
                        textAlign: 'center',
                      }}
                    >
                      {possible > 0 ? letter : '—'}
                    </span>
                  </td>
                  {onViewStudentReport && (
                    <td className="px-3 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onViewStudentReport(student.id)}
                        aria-label={`View report for ${student.name}`}
                      >
                        <Eye className="h-4 w-4" style={{ color: 'var(--color-text-mid)' }} />
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}

            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan={6 + assignments.length + (onViewStudentReport ? 1 : 0)}
                  className="px-4 py-12 text-center"
                  style={{ fontSize: '14px', color: 'var(--color-text-light)' }}
                >
                  No students match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Minimal legend */}
      <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
        <sup>L</sup> Late submission &nbsp;·&nbsp; Cells may show Graded, Ungraded, Missing, or Not Submitted
      </div>
    </div>
  );
}
