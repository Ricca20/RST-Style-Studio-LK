'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminGamesMaintenance() {
  const [isPruning, setIsPruning] = useState(false);

  const handlePrune = async () => {
    if (!confirm('WARNING: This will permanently delete all game scores older than 3 months. Are you sure you want to continue?')) return;
    
    setIsPruning(true);
    try {
      const res = await fetch('/api/admin/games/prune', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Successfully deleted ${data.count} old scores.`);
      } else {
        toast.error('Failed to prune scores');
      }
    } catch (error) {
      toast.error('An error occurred during pruning');
    }
    setIsPruning(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Prune Old Data</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              To keep the database lightweight and fast, the arcade system is designed to only retain the last 3 months of player scores. 
              Running this maintenance task will permanently delete all `GameScore` records older than 3 months. Monthly Leaderboard records (and winners) are preserved.
            </p>
            <button
              onClick={handlePrune}
              disabled={isPruning}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isPruning ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              {isPruning ? 'Pruning Database...' : 'Delete Old Scores'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
