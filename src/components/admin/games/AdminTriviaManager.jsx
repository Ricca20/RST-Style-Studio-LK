'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTriviaManager() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    difficulty: 'EASY',
    questionEn: '',
    questionSi: '',
    options: [
      { id: '1', textEn: '', textSi: '' },
      { id: '2', textEn: '', textSi: '' },
      { id: '3', textEn: '', textSi: '' },
      { id: '4', textEn: '', textSi: '' },
    ],
    correctOption: '1',
    isActive: true
  });

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/admin/games/trivia');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (error) {
      toast.error('Failed to load trivia questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openNewForm = () => {
    setEditingId(null);
    setFormData({
      difficulty: 'EASY',
      questionEn: '',
      questionSi: '',
      options: [
        { id: '1', textEn: '', textSi: '' },
        { id: '2', textEn: '', textSi: '' },
        { id: '3', textEn: '', textSi: '' },
        { id: '4', textEn: '', textSi: '' },
      ],
      correctOption: '1',
      isActive: true
    });
    setIsFormOpen(true);
  };

  const openEditForm = (q) => {
    setEditingId(q.id);
    setFormData({
      difficulty: q.difficulty,
      questionEn: q.questionEn,
      questionSi: q.questionSi || '',
      options: q.options,
      correctOption: q.correctOption,
      isActive: q.isActive
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate options
    const isValid = formData.options.every(o => o.textEn.trim() !== '');
    if (!isValid) {
      toast.error('All 4 options must have at least English text.');
      return;
    }

    try {
      const url = editingId 
        ? `/api/admin/games/trivia/${editingId}`
        : `/api/admin/games/trivia`;
        
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingId ? 'Question updated' : 'Question created');
        setIsFormOpen(false);
        fetchQuestions();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save question');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/admin/games/trivia/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Question deleted');
        fetchQuestions();
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting question');
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading trivia...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Trivia Database</h2>
        <button 
          onClick={openNewForm}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Question' : 'New Question'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                  />
                  Active (Playable)
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question (English) *</label>
                <textarea
                  required
                  rows="2"
                  value={formData.questionEn}
                  onChange={(e) => setFormData({...formData, questionEn: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question (Sinhala)</label>
                <textarea
                  rows="2"
                  value={formData.questionSi}
                  onChange={(e) => setFormData({...formData, questionSi: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Options & Correct Answer</label>
              <div className="space-y-3">
                {formData.options.map((opt, index) => (
                  <div key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border ${formData.correctOption === opt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="correctOption"
                      checked={formData.correctOption === opt.id}
                      onChange={() => setFormData({...formData, correctOption: opt.id})}
                      className="w-5 h-5 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                      <input
                        type="text"
                        placeholder={`Option ${index + 1} (English)`}
                        value={opt.textEn}
                        onChange={(e) => {
                          const newOpts = [...formData.options];
                          newOpts[index].textEn = e.target.value;
                          setFormData({...formData, options: newOpts});
                        }}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${index + 1} (Sinhala)`}
                        value={opt.textSi}
                        onChange={(e) => {
                          const newOpts = [...formData.options];
                          newOpts[index].textSi = e.target.value;
                          setFormData({...formData, options: newOpts});
                        }}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Question</th>
              <th className="px-6 py-4 font-medium">Difficulty</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No trivia questions found.
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{q.questionEn}</div>
                    {q.questionSi && <div className="text-xs text-gray-500 mt-1">{q.questionSi}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${
                      q.difficulty === 'EASY' ? 'border-green-200 text-green-700 bg-green-50' :
                      q.difficulty === 'MEDIUM' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                      'border-red-200 text-red-700 bg-red-50'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {q.isActive ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditForm(q)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
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
