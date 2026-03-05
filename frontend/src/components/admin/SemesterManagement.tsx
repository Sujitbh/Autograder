'use client';

import { useState } from 'react';
import { Calendar, Plus, Loader2, Trash2, Edit2 } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { useAdminSemesters, useCreateSemester, useUpdateSemester, useDeleteSemester } from '@/hooks/queries/useAdmin';

export function SemesterManagement() {
  const { data: semesters, isLoading } = useAdminSemesters();
  const createMutation = useCreateSemester();
  const updateMutation = useUpdateSemester();
  const deleteMutation = useDeleteSemester();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', start_date: '', end_date: '', is_current: false });

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', start_date: '', end_date: '', is_current: false });
    setDialogOpen(true);
  };

  const openEdit = (s: { id: number; name: string; start_date: string; end_date: string; is_current: boolean }) => {
    setEditingId(s.id);
    setForm({ name: s.name, start_date: s.start_date, end_date: s.end_date, is_current: s.is_current });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMutation.mutate(form, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <AdminLayout activeItem="semesters" breadcrumbs={[{ label: 'Semesters' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>Semester Management</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>Configure academic terms</p>
        </div>
        <Button onClick={openCreate} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
          <Plus className="w-4 h-4 mr-2" /> Create Semester
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin" /> <span>Loading...</span>
        </div>
      ) : !semesters || semesters.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>No Semesters Yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Create your first semester to get started</p>
          <Button onClick={openCreate} className="mt-4 text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Plus className="w-4 h-4 mr-2" /> Create Semester
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {semesters.map((s) => (
            <div key={s.id} className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold" style={{ fontSize: '17px', color: 'var(--color-text-dark)' }}>{s.name}</h3>
                {s.is_current && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: '#2D6A2D' }}>Current</span>
                )}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                {new Date(s.start_date).toLocaleDateString()} — {new Date(s.end_date).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => openEdit(s)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => deleteMutation.mutate(s.id)}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent style={{ maxWidth: '440px' }}>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Semester' : 'Create Semester'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Fall 2026" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>Start Date</label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>End Date</label>
              <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="mt-1" />
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-dark)' }}>
              <input type="checkbox" checked={form.is_current} onChange={(e) => setForm({ ...form, is_current: e.target.checked })} />
              Set as current semester
            </label>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              {editingId ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
