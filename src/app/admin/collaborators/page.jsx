'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Users, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

const ROLES = [
  'VOCALIST', 'MUSIC_PRODUCER', 'MELODY_COMPOSER', 'LYRICIST', 
  'MIXING_ENGINEER', 'MASTERING_ENGINEER', 'DIRECTOR', 'INSTRUMENTALIST'
];

export default function CollaboratorManagementPage() {
  const [collaborators, setCollaborators] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ profileId: '', role: 'VOCALIST', price: '', isActive: true });
  
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [collabRes, profRes] = await Promise.all([
        fetch('/api/admin/collaborators'),
        fetch('/api/admin/profiles')
      ]);
      
      if (collabRes.ok) setCollaborators(await collabRes.json());
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfiles(profData.data || []);
      }
    } catch (e) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (collab = null) => {
    if (collab) {
      setEditingId(collab.id);
      setFormData({
        profileId: collab.profileId,
        role: collab.role,
        price: collab.price,
        isActive: collab.isActive
      });
    } else {
      setEditingId(null);
      setFormData({ profileId: '', role: 'VOCALIST', price: '', isActive: true });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profileId) {
      toast.error('Please select a profile');
      return;
    }

    try {
      const url = editingId ? `/api/admin/collaborators/${editingId}` : '/api/admin/collaborators';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      
      toast.success(editingId ? 'Collaborator updated' : 'Collaborator added');
      setModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/collaborators/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Collaborator removed');
      setDeleteId(null);
      fetchData();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Collaborator Pricing
          </h1>
          <p className="text-gray-500 mt-2">Manage profiles available for quote generation and set their rates.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Add Collaborator
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {collaborators.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No collaborators found. Add one to start generating quotes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Profile</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Base Price (LKR)</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {collaborators.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      {c.profile?.imageUrl ? (
                        <img src={c.profile.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                          {c.profile?.name?.[0] || '?'}
                        </div>
                      )}
                      {c.profile?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs">
                        {c.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {c.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      {c.isActive ? (
                        <span className="text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-medium border border-green-200">Active</span>
                      ) : (
                        <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openModal(c)} 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteId(c.id)} 
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Collaborator' : 'Add Collaborator'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Profile</label>
                <select 
                  required 
                  value={formData.profileId} 
                  onChange={e => setFormData({...formData, profileId: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Select a profile --</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role in Quotes</label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (LKR)</label>
                <input 
                  required 
                  type="number" 
                  min="0"
                  step="1" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 50000"
                />
              </div>

              <div className="flex items-center mt-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={formData.isActive} 
                  onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Available for public quotes</label>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? 'Update' : 'Add to Quotes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Collaborator"
        description="Are you sure you want to remove this profile from the quote wizard? Their profile will not be deleted, but they won't appear as an option for this role."
        confirmText="Remove"
        isLoading={isDeleting}
      />
    </div>
  );
}
