'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Video, Globe, Music, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFetchJson } from '@/lib/hooks/useFetchJson';

const PLATFORM_META = {
  YOUTUBE: { Icon: Video, color: 'text-red-600 bg-red-50', unit: 'videos', envHint: 'YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID' },
  FACEBOOK: { Icon: Globe, color: 'text-blue-600 bg-blue-50', unit: 'posts', envHint: 'FACEBOOK_PAGE_ID, FACEBOOK_ACCESS_TOKEN' },
  SPOTIFY: { Icon: Music, color: 'text-green-600 bg-green-50', unit: 'tracks', envHint: 'SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_ARTIST_ID' },
};

const RESULT_MESSAGES = {
  synced: (r) => `${r.platform}: synced ${r.count} items`,
  not_configured: (r) => `${r.platform}: API keys not configured`,
  failed: (r) => `${r.platform}: ${r.error}`,
};

export default function SocialSyncPage() {
  const { data, isLoading, error, reload: loadStatus } = useFetchJson('/api/admin/social-sync');
  const platforms = data || [];
  const [syncing, setSyncing] = useState(null); // platform key, 'ALL', or null

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  const runSync = async (platform) => {
    setSyncing(platform || 'ALL');
    try {
      const res = await fetch('/api/admin/social-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(platform ? { platform } : {}),
      });
      const results = await res.json();
      if (!res.ok) throw new Error(results.error || 'Sync failed');

      for (const result of results) {
        const message = RESULT_MESSAGES[result.status](result);
        if (result.status === 'synced') toast.success(message);
        else if (result.status === 'failed') toast.error(message);
        else toast.info(message);
      }
      loadStatus();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Sync</h1>
          <p className="text-gray-500 mt-1">
            Content is pulled automatically every day (YouTube, Facebook) and weekly (Spotify). Use Sync Now to refresh immediately.
          </p>
        </div>
        <button
          onClick={() => runSync()}
          disabled={syncing !== null}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-sm text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing === 'ALL' ? 'animate-spin' : ''}`} />
          {syncing === 'ALL' ? 'Syncing…' : 'Sync All Now'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((p) => {
            const meta = PLATFORM_META[p.platform];
            const { Icon } = meta;
            return (
              <div key={p.platform} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${meta.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {p.configured ? (
                    <span className="flex items-center text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Configured
                    </span>
                  ) : (
                    <span className="flex items-center text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3 mr-1" /> Not configured
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{p.label}</h3>
                <div className="space-y-2 text-sm text-gray-600 flex-1">
                  <div className="flex justify-between">
                    <span>Last sync</span>
                    <span className="font-medium text-gray-900">{p.lastSync ? new Date(p.lastSync).toLocaleString() : 'Never'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cached {meta.unit}</span>
                    <span className="font-medium text-gray-900">{p.itemCount}</span>
                  </div>
                  {!p.configured && (
                    <p className="text-xs text-gray-400 pt-2">Set {meta.envHint} in the environment to enable.</p>
                  )}
                </div>
                <button
                  onClick={() => runSync(p.platform)}
                  disabled={syncing !== null || !p.configured}
                  className="mt-4 w-full border rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing === p.platform ? 'animate-spin' : ''}`} />
                  Sync {p.label}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
