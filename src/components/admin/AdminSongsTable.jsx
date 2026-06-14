'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import * as XLSX from 'xlsx';

export default function AdminSongsTable({ songs }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(songs.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const res = await fetch('/api/admin/songs/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      if (!res.ok) throw new Error('Failed to delete songs');
      toast.success('Selected songs deleted');
      setSelectedIds(new Set());
      setConfirmModal(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleExport = (format) => {
    const selectedSongs = songs.filter(s => selectedIds.has(s.id));
    const dataToExport = selectedSongs.map(s => ({
      'Title (EN)': s.titleEn,
      'Title (SI)': s.titleSi,
      'Status': s.isDraft ? 'DRAFT' : 'PUBLISHED',
      'Genres': s.genres?.join(', ') || '',
      'Release Year': s.releaseYear || '',
      'Featured': s.isFeatured ? 'YES' : 'NO',
      'Created At': new Date(s.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Songs');

    if (format === 'csv') {
      XLSX.writeFile(workbook, 'songs_export.csv');
    } else {
      XLSX.writeFile(workbook, 'songs_export.xlsx');
    }
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div>
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-t-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">{selectedIds.size} songs selected</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium transition"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('xls')}
              className="text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium transition"
            >
              Export XLS
            </button>
            <button
              onClick={() => setConfirmModal(true)}
              className="text-sm bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Bulk Delete
            </button>
          </div>
        </div>
      )}
      
      <div className={`overflow-x-auto ${selectedIds.size === 0 ? 'rounded-t-xl' : ''}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={songs.length > 0 && selectedIds.size === songs.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold">Title (EN)</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Genre</th>
              <th className="p-4 font-semibold">Year</th>
              <th className="p-4 font-semibold">Featured</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {songs.length > 0 ? songs.map(song => (
              <tr key={song.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedIds.has(song.id)}
                    onChange={() => handleSelect(song.id)}
                  />
                </td>
                <td className="p-4 font-medium text-gray-900">{song.titleEn}</td>
                <td className="p-4">
                  {song.isDraft ? <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">DRAFT</span> : <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">PUBLISHED</span>}
                </td>
                <td className="p-4 text-gray-600">{song.genres && song.genres.length > 0 ? song.genres.join(', ') : '-'}</td>
                <td className="p-4 text-gray-600">{song.releaseYear || '-'}</td>
                <td className="p-4">
                  {song.isFeatured ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">YES</span> : <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">NO</span>}
                </td>
                <td className="p-4 flex justify-end space-x-3 items-center">
                  <Link href={`/admin/songs/${song.id}/edit`} className="text-gray-400 hover:text-black transition"><Edit className="w-5 h-5" /></Link>
                  <DeleteButton id={song.id} title={song.titleEn} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">No songs found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handleBulkDelete}
        title="Bulk Delete"
        description={`Are you sure you want to delete ${selectedIds.size} songs? They will be moved to the Trash Bin.`}
        confirmText="Bulk Delete"
        isLoading={isBulkDeleting}
      />
    </div>
  );
}
