import { useState, useMemo, Fragment, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Search, Download, Printer, ChevronUp, ChevronDown, ChevronLeft,
  Eye, ArrowUpDown, CheckCircle2, XCircle, Clock, AlertTriangle,
  ChevronRight, FileText, MessageSquare, Users,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { ReportsTable } from './ReportsTable';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  getStudentsForCourse, ASSIGNMENTS, TOTAL_MAX, SECTION_MAP,
  hashStr, gradeColor, pctColor, letterGrade, ordinal,
  RUBRIC_CRITERIA, FEEDBACK_POOL,
  type SharedStudent, type AssignmentDef,
} from '../utils/studentData';

/* ═══════════════════════════════════════════════════════════════════
   TYPES (local aliases)
   ═══════════════════════════════════════════════════════════════════ */

type StudentRecord = SharedStudent;

function lookupCourseCode(id: string) {
  try {
    const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
    const f = s.find((c: any) => c.id === id);
    if (f) return f.code;
  } catch { /* ignore */ }
  return id;
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export function ReportsDashboard() {
  const { courseId } = useParams() as { courseId: string };
  const courseCode = lookupCourseCode(courseId ?? '');
  const section = SECTION_MAP[courseId ?? ''] || 'Spring 2026 - 64251';

  const [view, setView] = useState<'gradebook' | 'student'>('gradebook');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [sortField, setSortField] = useState('lastName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const students = useMemo(() => getStudentsForCourse(courseId ?? 'cs-1001'), [courseId]);

  const studentStats = useMemo(() => {
    const map = new Map<string, { earned: number; possible: number; pct: number; submitted: number; total: number }>();
    students.forEach(s => {
      let earned = 0;
      let submitted = 0;
      ASSIGNMENTS.forEach(a => {
        if (s.grades[a.id] !== null && s.grades[a.id] !== undefined) {
          earned += s.grades[a.id]!;
          submitted++;
        }
      });
      map.set(s.id, {
        earned,
        possible: TOTAL_MAX,
        pct: TOTAL_MAX > 0 ? (earned / TOTAL_MAX) * 100 : 0,
        submitted,
        total: ASSIGNMENTS.length,
      });
    });
    return map;
  }, [students]);

  const filtered = useMemo(() => {
    let list = [...students];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        `${s.lastName}, ${s.firstName}`.toLowerCase().includes(q) ||
        s.id.includes(q) ||
        s.sisUserId.includes(q) ||
        s.sisLoginId.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'lastName') cmp = a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
      else if (sortField === 'id') cmp = parseInt(a.id) - parseInt(b.id);
      else if (sortField === 'sisUserId') cmp = parseInt(a.sisUserId) - parseInt(b.sisUserId);
      else if (sortField === 'sisLoginId') cmp = a.sisLoginId.localeCompare(b.sisLoginId);
      else if (sortField === 'total') cmp = (studentStats.get(a.id)?.earned ?? 0) - (studentStats.get(b.id)?.earned ?? 0);
      else if (sortField === 'pct') cmp = (studentStats.get(a.id)?.pct ?? 0) - (studentStats.get(b.id)?.pct ?? 0);
      else if (sortField.startsWith('assign:')) {
        const aId = sortField.replace('assign:', '');
        cmp = (a.grades[aId] ?? -1) - (b.grades[aId] ?? -1);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [students, searchQuery, sortField, sortDir, studentStats]);

  const handleSort = useCallback((field: string) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        return prev;
      }
      setSortDir('asc');
      return field;
    });
  }, []);

  const openStudentReport = useCallback((s: StudentRecord) => {
    setSelectedStudent(s);
    setView('student');
    setExpandedRows(new Set());
  }, []);

  const toggleExpand = useCallback((assignId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(assignId) ? next.delete(assignId) : next.add(assignId);
      return next;
    });
  }, []);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40 flex-shrink-0" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 ml-1 flex-shrink-0" />
      : <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />;
  };

  const hoverBg = 'var(--color-primary-bg)';
  const summaryBg = '#F9F9F9';
  const rowBgFor = (isEven: boolean) => isEven ? '#FAFAFA' : 'var(--color-surface)';

  const onRowEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.querySelectorAll('td').forEach(el => {
      (el as HTMLElement).style.backgroundColor = hoverBg;
    });
  };
  const onRowLeave = (e: React.MouseEvent<HTMLTableRowElement>, isEven: boolean) => {
    const bg = rowBgFor(isEven);
    e.currentTarget.querySelectorAll('td').forEach(el => {
      (el as HTMLElement).style.backgroundColor = el.dataset.summary ? summaryBg : bg;
    });
  };

  /* ══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */

  return (
    <PageLayout>
      <TopNav breadcrumbs={[
        { label: 'Courses', href: '/courses' },
        { label: courseCode, href: `/courses/${courseId}` },
        { label: 'Reports' },
      ]} />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar activeItem="reports" />

        <main className="flex-1 overflow-auto p-8" style={{ backgroundColor: 'var(--color-background)' }}>

          {/* ════════════════ GRADEBOOK VIEW ════════════════ */}
          {view === 'gradebook' && (
            <>
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-dark)' }}>Gradebook</h1>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
                    All student grades at a glance — {section}
                  </p>
                </div>
              </div>

              <ReportsTable
                assignments={ASSIGNMENTS.map(a => ({
                  id: a.id,
                  shortName: a.shortName,
                  fullName: a.fullName,
                  maxPoints: a.maxPoints,
                }))}
                students={students.map(s => ({
                  id: s.id,
                  name: `${s.lastName}, ${s.firstName}`,
                  studentId: s.studentId,
                  sisUserId: s.sisUserId,
                  sisLoginId: s.sisLoginId,
                  section: s.section,
                }))}
                grades={students.reduce((acc, s) => {
                  acc[s.id] = { ...s.grades };
                  return acc;
                }, {} as Record<string, Record<string, number | null>>)}
                lateFlags={students.reduce((acc, s) => {
                  acc[s.id] = { ...s.lateFlags };
                  return acc;
                }, {} as Record<string, Record<string, boolean>>)}
                onViewStudentReport={(studentId) => {
                  const s = students.find(st => st.id === studentId);
                  if (s) openStudentReport(s);
                }}
                onExport={(format) => {
                  console.log(`Exporting gradebook as ${format}`);
                  // In production, call exportGrades API
                }}
              />
            </>
          )}

          {/* ════════════════ STUDENT DETAIL VIEW ════════════════ */}
          {view === 'student' && selectedStudent && (() => {
            const s = selectedStudent;
            const stats = studentStats.get(s.id)!;
            const pct = stats.pct;
            const grade = letterGrade(pct);

            const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0, missing: 0 };
            let onTime = 0;
            let lateCount = 0;
            ASSIGNMENTS.forEach(a => {
              const g = s.grades[a.id];
              if (g === null || g === undefined) {
                gradeCounts.missing++;
              } else {
                const aPct = (g / a.maxPoints) * 100;
                if (aPct >= 90) gradeCounts.A++;
                else if (aPct >= 80) gradeCounts.B++;
                else if (aPct >= 70) gradeCounts.C++;
                else if (aPct >= 60) gradeCounts.D++;
                else gradeCounts.F++;
                if (s.lateFlags[a.id]) lateCount++;
                else onTime++;
              }
            });

            const allPcts = Array.from(studentStats.values()).map(v => v.pct).sort((a, b) => b - a);
            const rank = allPcts.indexOf(pct) + 1;

            return (
              <>
                <button
                  onClick={() => { setView('gradebook'); setSelectedStudent(null); }}
                  className="flex items-center gap-1 mb-5 hover:underline transition-colors"
                  style={{ fontSize: '13px', color: '#6B0000' }}
                >
                  <ChevronLeft className="w-5 h-5" /> Back to All Students
                </button>

                {/* Student Header */}
                <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-5">
                      <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: '#6B0000', fontSize: '22px', fontWeight: 700 }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>{s.firstName} {s.lastName}</h1>
                        <div className="mt-2 space-y-1" style={{ fontSize: '14px', color: '#595959' }}>
                          <p>Student ID: <strong>{s.id}</strong> &nbsp;·&nbsp; CWID: <strong>{s.sisUserId}</strong></p>
                          <p>Username: <strong>{s.sisLoginId}</strong> &nbsp;·&nbsp; Section: <strong>{s.section}</strong></p>
                          <p>Email: <strong>{s.email}</strong></p>
                          <p>Enrolled: <strong>{new Date(s.enrollmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-[var(--color-border)]"><Printer className="w-4 h-4 mr-2" /> Print Report</Button>
                      <Button variant="outline" className="border-[var(--color-border)]"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
                    </div>
                  </div>
                </div>

                {/* Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Current Grade</p>
                    <p style={{ fontSize: '32px', fontWeight: 700, color: pctColor(pct) }}>{pct.toFixed(1)}%</p>
                    <p style={{ fontSize: '14px', color: '#595959', marginTop: '6px' }}>{grade} · Rank: {ordinal(rank)}/{students.length}</p>
                  </div>
                  <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Total Points</p>
                    <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-dark)' }}>{stats.earned} <span style={{ fontSize: '18px', fontWeight: 400, color: '#8A8A8A' }}>/ {stats.possible}</span></p>
                    <p style={{ fontSize: '14px', color: '#595959', marginTop: '6px' }}>Missing: {stats.possible - stats.earned} pts</p>
                  </div>
                  <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Submissions</p>
                    <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-dark)' }}>{stats.submitted}<span style={{ fontSize: '18px', fontWeight: 400, color: '#8A8A8A' }}>/{stats.total}</span></p>
                    <p style={{ fontSize: '14px', color: '#595959', marginTop: '6px' }}>On time: {onTime} · Late: {lateCount}</p>
                  </div>
                  <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Grade Breakdown</p>
                    <div className="space-y-0.5" style={{ fontSize: '14px' }}>
                      {gradeCounts.A > 0 && <p><span style={{ color: '#2D6A2D', fontWeight: 600 }}>A:</span> {gradeCounts.A} assignments</p>}
                      {gradeCounts.B > 0 && <p><span style={{ color: '#6B0000', fontWeight: 600 }}>B:</span> {gradeCounts.B} assignments</p>}
                      {gradeCounts.C > 0 && <p><span style={{ color: '#8A5700', fontWeight: 600 }}>C:</span> {gradeCounts.C} assignments</p>}
                      {gradeCounts.D > 0 && <p><span style={{ color: '#8B0000', fontWeight: 600 }}>D:</span> {gradeCounts.D} assignments</p>}
                      {gradeCounts.F > 0 && <p><span style={{ color: '#8B0000', fontWeight: 600 }}>F:</span> {gradeCounts.F} assignments</p>}
                      {gradeCounts.missing > 0 && <p><span style={{ color: '#8A8A8A', fontWeight: 600 }}>Missing:</span> {gradeCounts.missing}</p>}
                    </div>
                  </div>
                </div>

                {/* Assignment Breakdown Table */}
                <div className="rounded-lg overflow-hidden mb-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>Assignment-by-Assignment Breakdown</h2>
                  </div>
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#FAFAFA' }}>
                      <tr style={{ borderBottom: '2px solid #D9D9D9' }}>
                        <th style={{ width: 40 }} />
                        <th className="text-left px-4 py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Assignment</th>
                        <th className="text-left px-4 py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Category</th>
                        <th className="text-center px-4 py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Max Pts</th>
                        <th className="text-left px-4 py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Submitted</th>
                        <th className="text-left px-4 py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Status</th>
                        <th className="text-center px-4 py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Earned</th>
                        <th className="text-center px-4 py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ASSIGNMENTS.map((a, aIdx) => {
                        const earned = s.grades[a.id];
                        const isNull = earned === null || earned === undefined;
                        const aPct = isNull ? 0 : (earned / a.maxPoints) * 100;
                        const isLate = s.lateFlags[a.id] && !isNull;
                        const expanded = expandedRows.has(a.id);

                        const rubricScores = RUBRIC_CRITERIA.map(r => {
                          const max = Math.round(a.maxPoints * r.weight / 100);
                          if (isNull) return { ...r, earned: 0, max };
                          const h = hashStr(s.id + ':' + a.id + ':' + r.name);
                          const variation = (h % 11) - 5;
                          const rPct = Math.min(100, Math.max(25, aPct + variation));
                          return { ...r, earned: Math.round(max * rPct / 100), max };
                        });

                        const dueDate = new Date(a.dueDate);
                        const dayOffset = hashStr(s.id + a.id + 'sub') % 5 + 1;
                        const submitDate = isNull ? null : new Date(dueDate.getTime() + (isLate ? 86400000 : -86400000 * dayOffset));
                        const feedbackIdx = hashStr(s.id + ':' + a.id + ':fb') % FEEDBACK_POOL.length;
                        const altBg = aIdx % 2 ? '#FAFAF8' : '#fff';

                        return (
                          <Fragment key={a.id}>
                            <tr
                              className="cursor-pointer transition-colors"
                              style={{ borderBottom: expanded ? 'none' : '1px solid #E8E8E8', backgroundColor: altBg }}
                              onClick={() => !isNull && toggleExpand(a.id)}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary-bg)'; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = altBg; }}
                            >
                              <td className="text-center px-2 py-3">
                                {!isNull && (expanded
                                  ? <ChevronDown className="w-4 h-4 mx-auto" style={{ color: '#6B0000' }} />
                                  : <ChevronRight className="w-4 h-4 mx-auto" style={{ color: '#8A8A8A' }} />
                                )}
                              </td>
                              <td className="px-4 py-3" style={{ fontSize: '14px', fontWeight: 500, color: '#2D2D2D' }}>
                                <span className="flex items-center gap-1.5">
                                  {a.fullName}
                                  {a.isGroup && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: '#F5EDED', color: '#6B0000', border: '1px solid #E8D5D5' }}>
                                      <Users className="w-3 h-3" /> Group
                                    </span>
                                  )}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded text-xs" style={{
                                  backgroundColor: a.category === 'Homework' ? '#E3F2FD' : a.category === 'Quiz' ? '#FFF8E1' : '#F3E8FF',
                                  color: a.category === 'Homework' ? '#1565C0' : a.category === 'Quiz' ? '#8A5700' : '#6B21A8',
                                  fontWeight: 600,
                                }}>
                                  {a.category}
                                </span>
                              </td>
                              <td className="text-center px-4 py-3" style={{ color: '#595959' }}>{a.maxPoints}</td>
                              <td className="px-4 py-3" style={{ fontSize: '13px', color: '#595959' }}>
                                {isNull ? '—' : (
                                  <>
                                    {submitDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    <span style={{ fontSize: '11px', color: '#8A8A8A', display: 'block' }}>
                                      {submitDate?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                  </>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isNull ? (
                                  <span className="flex items-center gap-1 text-xs" style={{ color: '#8B0000', fontWeight: 600 }}>
                                    <XCircle className="w-3.5 h-3.5" /> Missing
                                  </span>
                                ) : isLate ? (
                                  <span className="flex items-center gap-1 text-xs" style={{ color: '#8A5700', fontWeight: 600 }}>
                                    <Clock className="w-3.5 h-3.5" /> Late
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs" style={{ color: '#2D6A2D', fontWeight: 600 }}>
                                    <CheckCircle2 className="w-3.5 h-3.5" /> On Time
                                  </span>
                                )}
                              </td>
                              <td className="text-center px-4 py-3" style={{ fontWeight: 600, color: isNull ? '#8A8A8A' : gradeColor(earned!, a.maxPoints) }}>
                                {isNull ? '0' : earned}
                              </td>
                              <td className="text-center px-4 py-3" style={{ fontWeight: 600, color: isNull ? '#8A8A8A' : gradeColor(earned!, a.maxPoints) }}>
                                {isNull ? '0%' : `${aPct.toFixed(0)}%`}
                                {!isNull && aPct >= 90 && <span style={{ marginLeft: 4 }}>✓</span>}
                                {isNull && <span style={{ marginLeft: 4 }}>✗</span>}
                                {!isNull && aPct < 70 && <span style={{ marginLeft: 4 }}>⚠</span>}
                              </td>
                            </tr>

                            {expanded && !isNull && (
                              <tr style={{ borderBottom: '1px solid #E8E8E8' }}>
                                <td colSpan={8} className="px-6 py-5" style={{ backgroundColor: '#FAFAFA' }}>
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="flex items-center gap-2 mb-3" style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <FileText className="w-4 h-4" style={{ color: '#6B0000' }} /> Rubric Breakdown
                                      </h4>
                                      <div className="space-y-2">
                                        {rubricScores.map(r => (
                                          <div key={r.name}>
                                            <div className="flex items-center gap-3 mb-1">
                                              {r.max > 0 && r.earned >= r.max * 0.7
                                                ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#2D6A2D' }} />
                                                : <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#8A5700' }} />
                                              }
                                              <span style={{ fontSize: '13px', color: '#2D2D2D', minWidth: 140 }}>{r.name}:</span>
                                              <span style={{ fontSize: '13px', fontWeight: 600, color: gradeColor(r.earned, r.max) }}>{r.earned} / {r.max}</span>
                                              <span style={{ fontSize: '12px', color: '#8A8A8A' }}>({r.max > 0 ? Math.round((r.earned / r.max) * 100) : 0}%)</span>
                                            </div>
                                            <div className="ml-7 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E8E8', maxWidth: 200 }}>
                                              <div className="h-full rounded-full" style={{ width: `${r.max > 0 ? Math.round((r.earned / r.max) * 100) : 0}%`, backgroundColor: gradeColor(r.earned, r.max), transition: 'width 0.3s ease' }} />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="flex items-center gap-2 mb-3" style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <MessageSquare className="w-4 h-4" style={{ color: '#6B0000' }} /> Details &amp; Feedback
                                      </h4>
                                      <div className="space-y-2" style={{ fontSize: '13px', color: '#595959' }}>
                                        <p><strong>Submitted:</strong> {submitDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {submitDate?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                                        <p><strong>Due:</strong> {dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at 11:59 PM</p>
                                        <p><strong>Status:</strong> {isLate ? 'Late (submitted after deadline)' : `On time (submitted ${dayOffset} day${dayOffset > 1 ? 's' : ''} early)`}</p>
                                        <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#fff', border: '1px solid #E8E8E8' }}>
                                          <p style={{ fontWeight: 600, marginBottom: '4px', color: '#2D2D2D', fontSize: '13px' }}>Instructor Feedback:</p>
                                          <p style={{ fontStyle: 'italic', lineHeight: '1.6' }}>"{FEEDBACK_POOL[feedbackIdx]}"</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer Summary */}
                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                  <h3 className="mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>Summary Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ fontSize: '14px', color: '#595959', lineHeight: '1.8' }}>
                    <div>
                      <p><strong>Total Earned:</strong> {stats.earned} / {stats.possible} points ({pct.toFixed(1)}%)</p>
                      <p><strong>Assignments Completed:</strong> {stats.submitted} / {stats.total} ({((stats.submitted / stats.total) * 100).toFixed(1)}%)</p>
                      <p><strong>Average Assignment Score:</strong> {pct.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p><strong>Current Course Grade:</strong> {grade} ({pct.toFixed(1)}%)</p>
                      <p><strong>Class Rank:</strong> {ordinal(rank)} out of {students.length} students</p>
                      <p><strong>On-Time Submissions:</strong> {onTime} / {stats.submitted} ({stats.submitted > 0 ? ((onTime / stats.submitted) * 100).toFixed(0) : 0}%)</p>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

        </main>
      </div>
    </PageLayout>
  );
}
