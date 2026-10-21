'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';
import { useFetchJson } from '@/lib/hooks/useFetchJson';

const inputClass = 'w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900';

/**
 * Config-driven admin list + modal form for simple content types.
 * @param {Array} fields - { name, label, type: 'text'|'textarea'|'date'|'image'|'checkbox'|'select', required?, placeholder?, options? }
 * @param {Array} columns - { label, render: (item) => JSX }
 * @param {Function} toForm - item -> form values (for editing)
 */
export default function SimpleCrudPage({ title, description, Icon, itemLabel, endpoint, fields, columns, emptyItem, toForm = (item) => item }) {
  const { data, isLoading, error, reload } = useFetchJson(endpoint);
  const items = data || [];
  const [form, setForm] = useState(null); // null when the modal is closed
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (error) toast.error(`Failed to load ${itemLabel.toLowerCase()}s`);
  }, [error, itemLabel]);

  const openModal = (item = null) => {
    setEditingId(item?.id || null);
    setForm(item ? toForm(item) : { ...emptyItem });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(editingId ? `${endpoint}/${editingId}` : endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || `Failed to save ${itemLabel.toLowerCase()}`);
      toast.success(`${itemLabel} ${editingId ? 'updated' : 'added'}`);
      setForm(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Delete this ${itemLabel.toLowerCase()}?`)) return;
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success(`${itemLabel} deleted`);
      reload();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const renderField = (field) => {
    const value = form[field.name];
    const set = (v) => setForm((prev) => ({ ...prev, [field.name]: v }));

    switch (field.type) {
      case 'textarea':
        return <textarea rows="3" required={field.required} value={value || ''} onChange={(e) => set(e.target.value)} placeholder={field.placeholder} className={`${inputClass} resize-y`} />;
      case 'date':
        return <input type="date" required={field.required} value={value || ''} onChange={(e) => set(e.target.value)} className={inputClass} />;
      case 'select':
        return (
          <select value={value ?? ''} onChange={(e) => set(e.target.value)} className={`${inputClass} bg-white`}>
            {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <input type="checkbox" checked={Boolean(value)} onChange={(e) => set(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-blue-600" />
            {field.checkboxLabel}
          </label>
        );
      case 'image':
        return value ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded file */}
            <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover border" />
            <button type="button" onClick={() => set('')} className="text-sm text-red-600 hover:underline">Remove</button>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-xl p-4 flex justify-center bg-gray-50">
            <ImageUpload compact label="Upload image" onUpload={(url) => set(url)} />
          </div>
        );
      default:
        return <input type="text" required={field.required} value={value || ''} onChange={(e) => set(e.target.value)} placeholder={field.placeholder} className={inputClass} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {Icon && <Icon className="w-8 h-8 text-blue-600" />}
            {title}
          </h1>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
        <button onClick={() => openModal()} className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-sm text-sm">
          <Plus className="w-4 h-4" /> Add {itemLabel}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-gray-400 animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center p-12 text-gray-400">No {itemLabel.toLowerCase()}s yet. Add one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {columns.map((c) => <th key={c.label} className="px-6 py-4 font-bold text-gray-700 text-sm">{c.label}</th>)}
                  <th className="px-6 py-4 font-bold text-gray-700 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    {columns.map((c) => <td key={c.label} className="px-6 py-4 text-sm text-gray-700">{c.render(item)}</td>)}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(item)} aria-label="Edit" className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} aria-label="Delete" className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setForm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? `Edit ${itemLabel}` : `Add ${itemLabel}`}</h2>
              <button onClick={() => setForm(null)} aria-label="Close" className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  {field.type !== 'checkbox' && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}{field.required && ' *'}</label>
                  )}
                  {renderField(field)}
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setForm(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50">
                  {isSaving ? 'Saving…' : `Save ${itemLabel}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
