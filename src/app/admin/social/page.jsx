'use client';
import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SocialSyncPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/social/sync', { method: 'POST' });
      const data = await res.json();
      setResult({ success: res.ok, message: data.message || data.error });
    } catch (e) {
      setResult({ success: false, message: e.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Social Media Integration</h1>
      
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Manual Sync Trigger</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The studio&apos;s latest YouTube videos and Facebook page posts are fetched and cached in the database. 
          Use this to manually trigger a fresh synchronization pull from exactly the current live platform APIs.
        </p>

        {result && (
          <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${result.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {result.success ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
            <div>
              <p className="font-bold">{result.success ? 'Sync Successful' : 'Sync Failed'}</p>
              <p className="text-sm opacity-90">{result.message}</p>
            </div>
          </div>
        )}

        <button 
          onClick={handleSync} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Synchronizing with APIs...' : 'Trigger Full Sync'}
        </button>
      </div>
    </div>
  );
}
  
