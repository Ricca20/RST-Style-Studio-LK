'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Users, DollarSign, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';

const ROLE_OPTIONS = [
  { value: 'LYRICS', label: 'Lyrics', emoji: '✍️' },
  { value: 'MELODY', label: 'Melody', emoji: '🎵' },
  { value: 'MUSIC', label: 'Music Arrangement', emoji: '🎹' },
  { value: 'MIX_MASTER', label: 'Mix & Master', emoji: '🎛️' },
  { value: 'LEAD_GUITAR', label: 'Lead Guitar', emoji: '🎸' },
  { value: 'RHYTHM_GUITAR', label: 'Rhythm Guitar', emoji: '🎸' },
  { value: 'BASS_GUITAR', label: 'Bass Guitar', emoji: '🎸' },
  { value: 'FLUTE', label: 'Flute', emoji: '🪈' },
  { value: 'SITAR', label: 'Sitar', emoji: '🪕' },
  { value: 'VIOLIN', label: 'Violin', emoji: '🎻' },
  { value: 'DRUMS', label: 'Drums', emoji: '🥁' },
  { value: 'KEYBOARD', label: 'Keyboard', emoji: '🎹' },
  { value: 'TABLA', label: 'Tabla', emoji: '🪘' },
  { value: 'SINGING', label: 'Singing / Vocals', emoji: '🎤' },
];

const getRoleLabel = (value) => ROLE_OPTIONS.find(r => r.value === value)?.label || value;
const getRoleEmoji = (value) => ROLE_OPTIONS.find(r => r.value === value)?.emoji || '🎵';

export default function CollaboratorsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCollaborators = async () => {
    try {
      const res = await fetch('/api/admin/collaborators');
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data);
      }
    } catch (err) {
      toast.error('Failed to load collaborators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollaborators(); }, []);

  const resetForm = () => {
    setFormName('');
    setFormRole('');
    setFormPrice('');
    setFormImage('');
    setFormActive(true);
    setEditingId(null);
    setShowForm(false);
  };

  const openEditForm = (collab) => {
    setFormName(collab.name);
    setFormRole(collab.role);
    setFormPrice(String(collab.price));
    setFormImage(collab.imageUrl || '');
    setFormActive(collab.isActive);
    setEditingId(collab.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formRole || !formPrice) {
      toast.error('Name, role, and price are required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { name: formName, role: formRole, price: parseFloat(formPrice), imageUrl: formImage, isActive: formActive };
      const url = editingId ? `/api/admin/collaborators/${editingId}` : '/api/admin/collaborators';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save');

      toast.success(editingId ? 'Collaborator updated' : 'Collaborator added');
      resetForm();
      startTransition(() => { fetchCollaborators(); });
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
      toast.success(`Removed "${deleteTarget.name}"`);
      setDeleteTarget(null);
      startTransition(() => { fetchCollaborators(); });
    } catch (err) {
      toast.error(err.message);
      setDeleteTarget(null);
    }
  };

  // Group collaborators by role
  const grouped = {};
  for (const c of collaborators) {
    if (!grouped[c.role]) grouped[c.role] = [];
    grouped[c.role].push(c);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Collaborators</h1>
          <p className="text-gray-500 mt-1">Add and manage people available for song production roles</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Person
        </button>
      </div>

      {/* Add/Edit Form Panel */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Collaborator' : 'Add New Collaborator'}</h2>
            <button onClick={resetForm} className="text-white/70 hover:text-white transition"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Kasun Perera" className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
                <select value={formRole} onChange={e => setFormRole(e.target.value)} className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">Select Role...</option>
                  {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.emoji} {r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (LKR) *</label>
                <input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="15000" min="0" className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo (Optional)</label>
                {formImage ? (
                  <div className="flex items-center gap-2">
                    <img src={formImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <button onClick={() => setFormImage('')} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                  </div>
                ) : (
                  <ImageUpload onUpload={url => setFormImage(url)} compact className="h-10" label="Upload" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formActive} onChange={e => setFormActive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Active (visible to public)</span>
              </label>
              <div className="flex items-center gap-3">
                <button onClick={resetForm} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center transition disabled:opacity-50">
                  <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collaborators grouped by role */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No collaborators yet</h3>
          <p className="text-gray-500">Add your first collaborator using the button above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {ROLE_OPTIONS.filter(r => grouped[r.value]).map(roleOpt => (
            <div key={roleOpt.value} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b flex items-center gap-3">
                <span className="text-xl">{roleOpt.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900">{roleOpt.label}</h3>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">{grouped[roleOpt.value].length} {grouped[roleOpt.value].length === 1 ? 'person' : 'people'}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {grouped[roleOpt.value].map(person => (
                  <div key={person.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      {person.imageUrl ? (
                        <img src={person.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{person.name}</p>
                        <p className="text-sm text-gray-500">
                          {!person.isActive && <span className="text-red-500 font-medium mr-2">Inactive</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Rs {person.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditForm(person)} className="text-gray-400 hover:text-blue-600 transition p-1.5 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(person)} className="text-gray-400 hover:text-red-600 transition p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Collaborator"
        description={deleteTarget ? `Are you sure you want to remove "${deleteTarget.name}" (${getRoleLabel(deleteTarget.role)})? This cannot be undone.` : ''}
        confirmText="Remove"
      />
    </div>
  );
}
