'use client';

import { useState } from 'react';
import { Code, Plus, Loader2, Trash2, Edit2 } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { useAdminLanguages, useCreateLanguage, useUpdateLanguage, useDeleteLanguage } from '@/hooks/queries/useAdmin';

export function LanguageManagement() {
  const { data: languages, isLoading } = useAdminLanguages();
  const createMutation = useCreateLanguage();
  const updateMutation = useUpdateLanguage();
  const deleteMutation = useDeleteLanguage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', file_extension: '', docker_image: '' });

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', file_extension: '', docker_image: '' });
    setDialogOpen(true);
  };

  const openEdit = (l: { id: number; name: string; file_extension: string | null; docker_image: string | null }) => {
    setEditingId(l.id);
    setForm({ name: l.name, file_extension: l.file_extension ?? '', docker_image: l.docker_image ?? '' });
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
    <AdminLayout activeItem="languages" breadcrumbs={[{ label: 'Languages' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>Programming Languages</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>Manage supported languages and configurations</p>
        </div>
        <Button onClick={openCreate} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
          <Plus className="w-4 h-4 mr-2" /> Add Language
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin" /> <span>Loading...</span>
        </div>
      ) : !languages || languages.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Code className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>No Languages Yet</p>
          <Button onClick={openCreate} className="mt-4 text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Plus className="w-4 h-4 mr-2" /> Add Language
          </Button>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Language</th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>File Extension</th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Docker Image</th>
                <th className="text-right px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((l) => (
                <tr key={l.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-5 py-4 font-medium" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>{l.name}</td>
                  <td className="px-5 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>{l.file_extension || '—'}</td>
                  <td className="px-5 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)', fontFamily: 'monospace' }}>{l.docker_image || '—'}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(l)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => deleteMutation.mutate(l.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent style={{ maxWidth: '440px' }}>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Language' : 'Add Language'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>Language Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Python" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>File Extension</label>
              <Input value={form.file_extension} onChange={(e) => setForm({ ...form, file_extension: e.target.value })} placeholder="e.g. .py" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>Docker Image</label>
              <Input value={form.docker_image} onChange={(e) => setForm({ ...form, docker_image: e.target.value })} placeholder="e.g. python:3.11" className="mt-1" />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              {editingId ? 'Save Changes' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
