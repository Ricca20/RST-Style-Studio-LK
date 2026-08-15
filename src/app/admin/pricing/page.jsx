'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';

export default function PricingConfigPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [formData, setFormData] = useState({ itemKey: '', type: 'SERVICE', price: '', currency: 'LKR' });

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/admin/pricing');
      if (res.ok) {
        setConfigs(await res.json());
      }
    } catch (e) {
      toast.error('Failed to load pricing configs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const openModal = (config = null) => {
    if (config) {
      setEditing(config);
      setFormData({ itemKey: config.itemKey, type: config.type, price: config.price, currency: config.currency });
    } else {
      setEditing(null);
      setFormData({ itemKey: '', type: 'SERVICE', price: '', currency: 'LKR' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/pricing/${editing.id}` : '/api/admin/pricing';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });
      
      if (!res.ok) throw new Error('Failed to save');
      toast.success(editing ? 'Updated successfully' : 'Created successfully');
      setModalOpen(false);
      fetchConfigs();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pricing config?')) return;
    try {
      const res = await fetch(`/api/admin/pricing/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Deleted successfully');
      fetchConfigs();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Configuration</h1>
          <p className="text-gray-500 mt-1">Manage core pricing tiers and dynamic base prices.</p>
        </div>
        <button onClick={() => openModal()} className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Pricing
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 font-bold text-gray-700 text-sm">Item Key</th>
                <th className="px-6 py-4 font-bold text-gray-700 text-sm">Type</th>
                <th className="px-6 py-4 font-bold text-gray-700 text-sm">Price</th>
                <th className="px-6 py-4 font-bold text-gray-700 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {configs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No pricing configs found.</td>
                </tr>
              ) : (
                configs.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{c.itemKey}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.type}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{c.currency} {c.price.toLocaleString()}</td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <button onClick={() => openModal(c)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? 'Edit Pricing' : 'Add Pricing'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Key</label>
                <input required type="text" value={formData.itemKey} onChange={e => setFormData({...formData, itemKey: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. MINIMUM_BUDGET" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="SERVICE">Service</option>
                  <option value="OPTION">Option</option>
                  <option value="GLOBAL">Global</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
