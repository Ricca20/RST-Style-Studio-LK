'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useFetchJson } from '@/lib/hooks/useFetchJson';

const LANGS = [
  { key: 'En', label: 'English', required: true },
  { key: 'Si', label: 'Sinhala' },
  { key: 'It', label: 'Italian' },
];

const emptyOptions = () => ['1', '2', '3', '4'].map((id) => ({ id, textEn: '', textSi: '', textIt: '' }));

const inputClass = 'w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none';

/**
 * Shared admin CRUD for multiple-choice game content (trivia questions, tune clips).
 * @param {string} endpoint - Admin API base, e.g. /api/admin/games/trivia
 * @param {string} promptField - Base name of the localized prompt field ('question' → questionEn/Si/It)
 * @param {object} extraDefaults - Initial values for game-specific fields
 * @param {Function} renderExtraFields - (formData, update) => JSX for game-specific inputs
 * @param {Function} renderExtraCell - (item) => JSX for a game-specific table column
 */
export default function ChoiceContentManager({
  title,
  itemLabel,
  endpoint,
  promptField,
  promptLabel,
  extraDefaults = {},
  renderExtraFields,
  extraColumnLabel,
  renderExtraCell,
}) {
  const { data, isLoading, error: loadError, reload: load } = useFetchJson(endpoint);
  const items = data || [];
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null); // null when the form is closed

  useEffect(() => {
    if (loadError) toast.error(`Failed to load ${itemLabel.toLowerCase()}s`);
  }, [loadError, itemLabel]);

  const update = (patch) => setFormData((prev) => ({ ...prev, ...patch }));

  const updateOption = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt)),
    }));
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({
      [`${promptField}En`]: '', [`${promptField}Si`]: '', [`${promptField}It`]: '',
      options: emptyOptions(),
      correctOption: '1',
      isActive: true,
      ...extraDefaults,
    });
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      ...item,
      [`${promptField}Si`]: item[`${promptField}Si`] || '',
      [`${promptField}It`]: item[`${promptField}It`] || '',
      options: (item.options || []).map((o) => ({ textSi: '', textIt: '', ...o })),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.options.some((o) => !o.textEn.trim())) {
      toast.error('Every option needs English text.');
      return;
    }

    setIsSaving(true);
    try {
      const { id: _id, createdAt: _createdAt, ...payload } = formData;
      const res = await fetch(editingId ? `${endpoint}/${editingId}` : endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed to save ${itemLabel.toLowerCase()}`);

      toast.success(editingId ? `${itemLabel} updated` : `${itemLabel} created`);
      setFormData(null);
      load();
    } catch (error) {
      toast.error(error.message);
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
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {itemLabel}
        </button>
      </div>

      {formData && (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? `Edit ${itemLabel}` : `New ${itemLabel}`}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderExtraFields?.(formData, update)}
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer md:mt-6">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => update({ isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                />
                Active (Playable)
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LANGS.map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{promptLabel} ({label}){required && ' *'}</label>
                  <textarea
                    required={required}
                    rows="2"
                    value={formData[`${promptField}${key}`]}
                    onChange={(e) => update({ [`${promptField}${key}`]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Options &amp; Correct Answer</label>
              <div className="space-y-3">
                {formData.options.map((opt, index) => (
                  <div key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border ${formData.correctOption === opt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="correctOption"
                      aria-label={`Option ${index + 1} is correct`}
                      checked={formData.correctOption === opt.id}
                      onChange={() => update({ correctOption: opt.id })}
                      className="w-5 h-5 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                      {LANGS.map(({ key, label }) => (
                        <input
                          key={key}
                          type="text"
                          placeholder={`Option ${index + 1} (${label})`}
                          value={opt[`text${key}`] || ''}
                          onChange={(e) => updateOption(index, `text${key}`, e.target.value)}
                          className={inputClass}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={() => setFormData(null)} className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isSaving ? 'Saving…' : `Save ${itemLabel}`}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">{promptLabel}</th>
              {extraColumnLabel && <th className="px-6 py-4 font-medium">{extraColumnLabel}</th>}
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={extraColumnLabel ? 4 : 3} className="px-6 py-8 text-center text-gray-500">
                  No {itemLabel.toLowerCase()}s yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item[`${promptField}En`]}</div>
                    {item[`${promptField}Si`] && <div className="text-xs text-gray-500 mt-1">{item[`${promptField}Si`]}</div>}
                  </td>
                  {extraColumnLabel && <td className="px-6 py-4">{renderExtraCell?.(item)}</td>}
                  <td className="px-6 py-4">
                    {item.isActive ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} aria-label="Edit" className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} aria-label="Delete" className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
