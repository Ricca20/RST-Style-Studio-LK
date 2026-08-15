'use client';

import { useState } from 'react';
import { RefreshCw, Camera, Video, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SocialSyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleString());

  const handleManualSync = async () => {
    setIsSyncing(true);
    
    // Placeholder for actual API call
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleString());
      toast.success('Social metrics synced successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Social Sync Management</h2>
          <p className="text-white/60 text-sm mt-1">Manage and sync metrics from connected social platforms.</p>
        </div>
        <button 
          onClick={handleManualSync}
          disabled={isSyncing}
          className="bg-[#0ea5e9] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#0284c7] disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* YouTube Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Video className="w-6 h-6 text-red-500" />
            </div>
            <span className="flex items-center text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Connected
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">YouTube</h3>
          <p className="text-white/60 text-sm mb-4">Channel stats and latest videos</p>
          <div className="space-y-2 text-sm text-white/80">
            <div className="flex justify-between"><span>Subscribers</span><span className="font-medium text-white">12.4K</span></div>
            <div className="flex justify-between"><span>Total Views</span><span className="font-medium text-white">1.2M</span></div>
          </div>
        </div>

        {/* Instagram Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-500/20 rounded-lg">
              <Camera className="w-6 h-6 text-pink-500" />
            </div>
            <span className="flex items-center text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Connected
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Instagram</h3>
          <p className="text-white/60 text-sm mb-4">Profile stats and recent posts</p>
          <div className="space-y-2 text-sm text-white/80">
            <div className="flex justify-between"><span>Followers</span><span className="font-medium text-white">8.2K</span></div>
            <div className="flex justify-between"><span>Posts</span><span className="font-medium text-white">342</span></div>
          </div>
        </div>

        {/* Facebook Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 opacity-50">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <span className="flex items-center text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Configured
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Facebook</h3>
          <p className="text-white/60 text-sm mb-4">Page insights and engagement</p>
          <button className="w-full py-2 text-sm text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            Configure Connection
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center text-sm">
        <span className="text-white/60">Last automatic sync: {lastSync}</span>
        <span className="text-white/60">Next scheduled sync: in 3 hours</span>
      </div>
    </div>
  );
}
