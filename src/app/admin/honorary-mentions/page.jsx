'use client';

import { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function HonoraryMentionsPage() {
  const [mentions, setMentions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    imageUrl: '',
    awardedAt: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchMentions();
  }, []);

  const fetchMentions = async () => {
    try {
      const res = await fetch('/api/honorary-mentions');
      if (res.ok) {
        const data = await res.json();
        setMentions(data);
      }
    } catch (error) {
      toast.error('Failed to load honorary mentions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editingId;
    const url = isEditing ? `/api/honorary-mentions/${editingId}` : '/api/honorary-mentions';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Mention ${isEditing ? 'updated' : 'added'} successfully`);
        setIsModalOpen(false);
        fetchMentions();
      } else {
        toast.error('Failed to save mention');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this mention?')) return;

    try {
      const res = await fetch(`/api/honorary-mentions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Mention deleted');
        fetchMentions();
      } else {
        toast.error('Failed to delete mention');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const openModal = (mention = null) => {
    if (mention) {
      setEditingId(mention.id);
      setFormData({
        name: mention.name || '',
        title: mention.title || '',
        description: mention.description || '',
        imageUrl: mention.imageUrl || '',
        awardedAt: mention.awardedAt ? new Date(mention.awardedAt).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        title: '',
        description: '',
        imageUrl: '',
        awardedAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Honorary Mentions
          </h2>
          <p className="text-white/60 text-sm mt-1">Manage studio awards, recognitions, and special mentions.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#0ea5e9] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#0284c7] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mention</span>
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 text-[#0ea5e9] animate-spin" />
          </div>
        ) : mentions.length === 0 ? (
          <div className="text-center p-12 text-white/50">
            No honorary mentions found. Add one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-xs text-white/50 uppercase bg-black/20 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Title / Award</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mentions.map((mention) => (
                  <tr key={mention.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      {mention.imageUrl ? (
                        <img src={mention.imageUrl} alt={mention.name} className="w-8 h-8 rounded-full object-cover bg-black/40" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9] font-bold">
                          {mention.name.charAt(0)}
                        </div>
                      )}
                      {mention.name}
                    </td>
                    <td className="px-6 py-4">{mention.title}</td>
                    <td className="px-6 py-4">
                      {mention.awardedAt ? new Date(mention.awardedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => openModal(mention)} className="text-white/50 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(mention.id)} className="text-white/50 hover:text-red-400 transition-colors">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Mention' : 'Add Mention'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="E.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Title / Award</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="E.g. Best Producer 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Date Awarded</label>
                <input 
                  type="date" 
                  value={formData.awardedAt}
                  onChange={e => setFormData({...formData, awardedAt: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0ea5e9] [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description (Optional)</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0ea5e9] resize-none"
                  placeholder="Brief description..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-colors font-medium shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                >
                  Save Mention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
