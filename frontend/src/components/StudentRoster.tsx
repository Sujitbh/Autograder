import { useState } from 'react';
import { Plus, Upload, Users, Search, Edit, Eye, Trash2, X, Copy, ArrowUpDown, Download, Mail, TrendingUp, TrendingDown } from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { useParams } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { getStudentsForCourse } from '../utils/studentData';

function lookupCourseCode(id: string) {
  try { const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]'); const f = s.find((c: any) => c.id === id); if (f) return f.code; } catch { } return id;
}

export function StudentRoster() {
  const { courseId } = useParams() as { courseId: string };
  const courseCode = lookupCourseCode(courseId ?? '');
  const students = getStudentsForCourse(courseId ?? 'cs-1001');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'submissions'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredStudents = students
    .filter(student => {
      const query = searchQuery.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`);
      else if (sortBy === 'grade') cmp = a.avgGrade - b.avgGrade;
      else if (sortBy === 'submissions') cmp = a.submissions - b.submissions;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  const handleSort = (field: 'name' | 'grade' | 'submissions') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleStudentSelect = (id: string) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const classAvg = Math.round(students.reduce((s, st) => s + st.avgGrade, 0) / students.length);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <PageLayout>
      <TopNav breadcrumbs={[
        { label: 'Courses', href: '/courses' },
        { label: courseCode, href: `/courses/${courseId}` },
        { label: 'Students' }
      ]} />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar activeItem="students" />

        <main className="flex-1 overflow-auto p-8">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                Students
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                {students.length} students enrolled · Class average: {classAvg}%
              </p>
            </div>
            <div className="flex gap-3">
              {selectedStudents.length > 0 ? (
                <>
                  <span className="flex items-center" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                    {selectedStudents.length} selected
                  </span>
                  <Button variant="outline" className="border-[var(--color-border)]">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Selected
                  </Button>
                  <Button variant="outline" className="border-[var(--color-error)] text-[var(--color-error)]">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-[var(--color-border)] text-[var(--color-text-mid)]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import from Canvas
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddModal(true);
                      generatePassword();
                    }}
                    className="text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[var(--color-border)]"
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th className="text-left px-4 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                  </th>
                  <th className="text-left px-4 py-4">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      Name
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                    Student ID
                  </th>
                  <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                    Email
                  </th>
                  <th className="text-left px-4 py-4">
                    <button onClick={() => handleSort('submissions')} className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      Submissions
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-4">
                    <button onClick={() => handleSort('grade')} className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      Avg Grade
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                    Trend
                  </th>
                  <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                    Last Active
                  </th>
                  <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b hover:bg-[var(--color-primary-bg)]/50 transition-colors"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelect(student.id)}
                        className="rounded"
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          <span style={{ fontSize: '14px', fontWeight: 600 }}>
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                      {student.studentId}
                    </td>
                    <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                      {student.email}
                    </td>
                    <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                      {student.submissions} / 4
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: student.avgGrade >= 90 ? 'var(--color-success)' :
                            student.avgGrade >= 80 ? 'var(--color-info)' :
                              student.avgGrade >= 70 ? 'var(--color-warning)' : 'var(--color-error)'
                        }}>
                          {student.avgGrade}%
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded text-white"
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: student.avgGrade >= 90 ? 'var(--color-success)' :
                              student.avgGrade >= 80 ? 'var(--color-info)' :
                                student.avgGrade >= 70 ? 'var(--color-warning)' : 'var(--color-error)'
                          }}
                        >
                          {student.avgGrade >= 90 ? 'A' : student.avgGrade >= 80 ? 'B' : student.avgGrade >= 70 ? 'C' : student.avgGrade >= 60 ? 'D' : 'F'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {student.trend === 'up' && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                          <span style={{ fontSize: '12px', color: 'var(--color-success)' }}>Up</span>
                        </div>
                      )}
                      {student.trend === 'down' && (
                        <div className="flex items-center gap-1">
                          <TrendingDown className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                          <span style={{ fontSize: '12px', color: 'var(--color-error)' }}>Down</span>
                        </div>
                      )}
                      {student.trend === 'stable' && (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>— Stable</span>
                      )}
                    </td>
                    <td className="px-4 py-4" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                      {new Date(student.lastActive).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-2 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
                          aria-label="View student"
                        >
                          <Eye className="w-4 h-4 text-[var(--color-text-mid)]" />
                        </button>
                        <button
                          className="p-2 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
                          aria-label="Edit student"
                        >
                          <Edit className="w-4 h-4 text-[var(--color-text-mid)]" />
                        </button>
                        <button
                          className="p-2 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
                          aria-label="Remove student"
                        >
                          <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                No students found matching your search.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Add Student Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl" style={{ boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
              Add New Student
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                  First Name *
                </label>
                <Input
                  placeholder="Enter first name"
                  className="border-[var(--color-border)]"
                />
              </div>
              <div>
                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                  Last Name *
                </label>
                <Input
                  placeholder="Enter last name"
                  className="border-[var(--color-border)]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                Student ID *
              </label>
              <Input
                placeholder="e.g., S20230006"
                className="border-[var(--color-border)]"
              />
            </div>

            <div>
              <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="student@warhawks.ulm.edu"
                className="border-[var(--color-border)]"
              />
              <p className="mt-1 text-[var(--color-text-light)]" style={{ fontSize: '12px' }}>
                Must be a @warhawks.ulm.edu email address
              </p>
            </div>

            <div>
              <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                Auto-Generated Password
              </label>
              <div className="flex gap-2">
                <Input
                  value={generatedPassword}
                  readOnly
                  className="border-[var(--color-border)] font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedPassword)}
                  className="border-[var(--color-border)]"
                  style={{ minWidth: '100px' }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                  className="border-[var(--color-border)]"
                >
                  Regenerate
                </Button>
              </div>
              <p className="mt-1 text-[var(--color-text-light)]" style={{ fontSize: '12px' }}>
                Student will be required to change password on first login
              </p>
            </div>
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="border-[var(--color-border)] text-[var(--color-text-mid)]"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}