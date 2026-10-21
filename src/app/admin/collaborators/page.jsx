'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Users, DollarSign, X, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useFetchJson } from '@/lib/hooks/useFetchJson';
import { QUOTE_ROLES, quoteRole } from '@/lib/quoteRoles';

const EMPTY_FORM = { profileId: '', role: '', price: '', isActive: true };

// Collaborators are the people (and prices) offered in the quotation wizard.
export default function CollaboratorsPage() {
  const collabQuery = useFetchJson('/api/admin/collaborators');
  const profilesQuery = useFetchJson('/api/admin/profiles'); // plain array
  const collaborators = collabQuery.data || [];
  const profiles = Array.isArray(profilesQuery.data) ? profilesQuery.data : [];
  const loading = collabQuery.isLoading || profilesQuery.isLoading;
  const loadError = collabQuery.error || profilesQuery.error;

  const [form, setForm] = useState(null); // null when the form is closed
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (loadError) toast.error('Failed to load collaborators');
  }, [loadError]);

  const openForm = (collab = null) => {
    setEditingId(collab?.id || null);
    setForm(collab
      ? { profileId: collab.profileId, role: quoteRole(collab.role) ? collab.role : '', price: String(collab.price), isActive: collab.isActive }
      : { ...EMPTY_FORM });
  };

  const handleSave = async () => {
    if (!form.profileId || !form.role || form.price === '') {
      toast.error('Profile, role, and price are required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      const res = await fetch(editingId ? `/api/admin/collaborators/${editingId}` : '/api/admin/collaborators', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      toast.success(editingId ? 'Collaborator updated' : 'Collaborator added');
      setForm(null);
      collabQuery.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/collaborators/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success(`Removed "${deleteTarget.profile?.name}"`);
      collabQuery.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Group by role; roles not offered in the quote wizard (from older data) get their own group
  const grouped = {};
  const legacy = [];
  for (const c of collaborators) {
    if (!quoteRole(c.role)) legacy.push(c);
    else (grouped[c.role] ||= []).push(c);
  }

  const renderPerson = (person) => (
    <div key={person.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
      <div className="flex items-center gap-4">
        {person.profile?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- small admin avatar from storage
          <img src={person.profile.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {person.profile?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{person.profile?.name}</p>
          <p className="text-sm text-gray-500">
            {!quoteRole(person.role) && <span className="mr-2">{person.role}</span>}
            {!person.isActive && <span className="text-red-500 font-medium">Inactive</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="font-bold text-gray-900 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          Rs {person.price.toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => openForm(person)} aria-label="Edit" className="text-gray-400 hover:text-blue-600 transition p-1.5 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => setDeleteTarget(person)} aria-label="Delete" className="text-gray-400 hover:text-red-600 transition p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collaborators</h1>
          <p className="text-gray-500 mt-1">People and prices offered in the quotation wizard, grouped by role.</p>
        </div>
        <button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition shadow-sm">
          <Plus className="w-5 h-5 mr-2" /> Add Person
        </button>
      </div>

      {form && (
        <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Collaborator' : 'Add New Collaborator'}</h2>
            <button onClick={() => setForm(null)} aria-label="Close" className="text-white/70 hover:text-white transition"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile *</label>
                <select value={form.profileId} onChange={(e) => setForm({ ...form, profileId: e.target.value })} className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">Select a profile…</option>
                  {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">Select role…</option>
                  {QUOTE_ROLES.map((r) => <option key={r.key} value={r.key}>{r.emoji} {r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (LKR) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="15000" min="0" className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Active (offered in the quotation wizard)</span>
              </label>
              <div className="flex items-center gap-3">
                <button onClick={() => setForm(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center transition disabled:opacity-50">
                  <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading…</div>
      ) : collaborators.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No collaborators yet</h3>
          <p className="text-gray-500">Add your first collaborator using the button above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {legacy.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-300 overflow-hidden">
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Not shown in the quotation wizard</h3>
                  <p className="text-sm text-amber-800">These use an old role name. Edit each one and pick a role from the list so customers can select them.</p>
                </div>
              </div>
              <div className="divide-y divide-gray-100">{legacy.map(renderPerson)}</div>
            </div>
          )}

          {QUOTE_ROLES.filter((r) => grouped[r.key]).map((role) => (
            <div key={role.key} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b flex items-center gap-3">
                <span className="text-xl">{role.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900">{role.label}</h3>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {grouped[role.key].length} {grouped[role.key].length === 1 ? 'person' : 'people'}
                </span>
              </div>
              <div className="divide-y divide-gray-100">{grouped[role.key].map(renderPerson)}</div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Collaborator"
        description={deleteTarget ? `Are you sure you want to remove "${deleteTarget.profile?.name}" (${quoteRole(deleteTarget.role)?.label || deleteTarget.role})? This cannot be undone.` : ''}
        confirmText="Remove"
      />
    </div>
  );
}
