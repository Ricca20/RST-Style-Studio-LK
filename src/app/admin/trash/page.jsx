'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, RefreshCw, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function AdminTrashPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [confirmModal, setConfirmModal] = useState(null); // { action, item }

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/trash');
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (err) {
      toast.error('Failed to load trash items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleAction = async () => {
    if (!confirmModal) return;
    const { action, item } = confirmModal;

    try {
      const res = await fetch('/api/admin/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, type: item.type, id: item.id })
      });

      if (!res.ok) throw new Error('Action failed');

      toast.success(action === 'RESTORE' ? 'Item restored' : 'Item permanently deleted');
      setConfirmModal(null);
      startTransition(() => {
        fetchTrash();
        router.refresh();
      });
    } catch (err) {
      toast.error(err.message);
      setConfirmModal(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-rose-600" />
            Trash Bin
          </h1>
          <p className="text-gray-500 mt-2">Restore deleted items or permanently remove them to free up space.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm text-gray-500">
                <th className="py-4 px-6 font-medium">Item Name</th>
                <th className="py-4 px-6 font-medium">Type</th>
                <th className="py-4 px-6 font-medium">Deleted At</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-400">Loading trash...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Trash2 className="w-12 h-12 text-gray-200 mb-3" />
                      <p>Trash is empty.</p>
                    </div>
                  </td>
                </tr>
              ) : items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{item.name}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500">
                    {new Date(item.deletedAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 flex justify-end gap-3">
                    <button
                      onClick={() => setConfirmModal({ action: 'RESTORE', item })}
                      className="text-blue-600 hover:text-blue-800 transition p-1.5 hover:bg-blue-50 rounded-lg text-sm flex items-center font-medium"
                    >
                      <RefreshCw className="w-4 h-4 mr-1.5" /> Restore
                    </button>
                    <button
                      onClick={() => setConfirmModal({ action: 'DELETE_PERMANENT', item })}
                      className="text-rose-600 hover:text-rose-800 transition p-1.5 hover:bg-rose-50 rounded-lg text-sm flex items-center font-medium"
                    >
                      <X className="w-4 h-4 mr-1.5" /> Delete Forever
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={handleAction}
        title={confirmModal?.action === 'RESTORE' ? 'Restore Item' : 'Permanently Delete'}
        description={
          confirmModal?.action === 'RESTORE'
            ? `Are you sure you want to restore "${confirmModal?.item?.name}"?`
            : `Are you sure you want to permanently delete "${confirmModal?.item?.name}"? This action cannot be undone and will delete all associated media files and data.`
        }
        confirmText={confirmModal?.action === 'RESTORE' ? 'Restore' : 'Delete Forever'}
        isLoading={isPending}
      />
    </div>
  );
}
