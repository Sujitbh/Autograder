'use client';

import { useEffect, useState, useMemo } from 'react';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import api from '@/services/api/client';
import { Search, Filter, Download, SortAsc, SortDesc, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface StudentResultItem {
  assignment_id: number;
  assignment_title: string;
  course_id: number;
  course_name: string | null;
  due_date: string | null;
  status: string;
  submission_id: number | null;
  score: number | null;
  max_score: number | null;
  graded_at: string | null;
}

type SortField = 'assignment' | 'course' | 'status' | 'score' | 'due_date';
type SortOrder = 'asc' | 'desc';

export function StudentResultsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<StudentResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Sort states
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api
      .get<{ results: StudentResultItem[] }>('/student-dashboard/results')
      .then((res) => {
        if (!mounted) return;
        setRows(res.data.results || []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Failed to load results');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Get unique courses for filter
  const courses = useMemo(() => {
    const uniqueCourses = new Map<string, string>();
    rows.forEach(r => {
      if (r.course_name) {
        uniqueCourses.set(String(r.course_id), r.course_name);
      }
    });
    return Array.from(uniqueCourses.entries()).map(([id, name]) => ({ id, name }));
  }, [rows]);

  // Filter and sort data
  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows.filter(r => {
      const matchesSearch = searchTerm === '' || 
        r.assignment_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesCourse = selectedCourse === 'all' || String(r.course_id) === selectedCourse;
      const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
      
      return matchesSearch && matchesCourse && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'assignment':
          comparison = a.assignment_title.localeCompare(b.assignment_title);
          break;
        case 'course':
          comparison = (a.course_name || '').localeCompare(b.course_name || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'score':
          const scoreA = a.score ?? -1;
          const scoreB = b.score ?? -1;
          comparison = scoreA - scoreB;
          break;
        case 'due_date':
          const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
          const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
          comparison = dateA - dateB;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [rows, searchTerm, selectedCourse, selectedStatus, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: string, score: number | null, max_score: number | null) => {
    if (status === 'graded') {
      return (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3" />
            Graded
          </span>
          {score !== null && max_score !== null && (
            <span className="text-sm font-medium">
              {score}/{max_score}
            </span>
          )}
        </div>
      );
    } else if (status === 'pending' || status === 'grading') {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          {status === 'grading' ? 'Grading' : 'Pending'}
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3" />
          Not Submitted
        </span>
      );
    }
  };

  const exportToCSV = () => {
    const headers = ['Course', 'Assignment', 'Status', 'Score', 'Max Score', 'Due Date', 'Graded At'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedRows.map(r => [
        r.course_name || '',
        r.assignment_title,
        r.status,
        r.score ?? '',
        r.max_score ?? '',
        r.due_date ? new Date(r.due_date).toLocaleDateString() : '',
        r.graded_at ? new Date(r.graded_at).toLocaleDateString() : '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <PageLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-dark)' }}>My Results</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
              {filteredAndSortedRows.length} assignment{filteredAndSortedRows.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportToCSV} className="gap-2" disabled={filteredAndSortedRows.length === 0}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => router.push('/student')}>Back to Dashboard</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-mid)' }} />
                <input
                  type="text"
                  placeholder="Search assignments or courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            {/* Course Filter */}
            <div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <option value="all">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <option value="all">All Statuses</option>
                <option value="graded">Graded</option>
                <option value="pending">Pending</option>
                <option value="grading">Grading</option>
                <option value="not_submitted">Not Submitted</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm" style={{ color: 'var(--color-text-mid)' }}>Loading results...</div>
        ) : error ? (
          <div className="p-6 text-sm" style={{ color: 'var(--color-error)' }}>{error}</div>
        ) : filteredAndSortedRows.length === 0 ? (
          <div className="p-6 text-center text-sm" style={{ color: 'var(--color-text-mid)' }}>
            {rows.length === 0 ? 'No assignments yet.' : 'No results match your filters.'}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                <tr>
                  <th 
                    className="text-left p-3 text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={() => handleSort('course')}
                  >
                    <div className="flex items-center gap-1">
                      Course
                      {sortField === 'course' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={() => handleSort('assignment')}
                  >
                    <div className="flex items-center gap-1">
                      Assignment
                      {sortField === 'assignment' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'status' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center gap-1">
                      Score
                      {sortField === 'score' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={() => handleSort('due_date')}
                  >
                    <div className="flex items-center gap-1">
                      Due Date
                      {sortField === 'due_date' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedRows.map((r) => (
                  <tr key={r.assignment_id} className="border-t border-[var(--color-border)] hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm">{r.course_name ?? `Course ${r.course_id}`}</td>
                    <td className="p-3 text-sm font-medium">{r.assignment_title}</td>
                    <td className="p-3 text-sm">{getStatusBadge(r.status, r.score, r.max_score)}</td>
                    <td className="p-3 text-sm">
                      {r.score != null && r.max_score != null ? (
                        <div>
                          <span className="font-medium">{Math.round((r.score / r.max_score) * 100)}%</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="p-3 text-sm">{r.due_date ? new Date(r.due_date).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
