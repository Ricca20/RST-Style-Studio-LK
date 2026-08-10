'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Trophy, HelpCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import AdminTriviaManager from '@/components/admin/games/AdminTriviaManager';
import AdminLeaderboardsManager from '@/components/admin/games/AdminLeaderboardsManager';
import AdminGamesMaintenance from '@/components/admin/games/AdminGamesMaintenance';

export default function ArcadeGamesAdminPage() {
  const [activeTab, setActiveTab] = useState('leaderboards');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-[#0ea5e9]" />
          Arcade Games Administration
        </h1>
        <p className="text-gray-400">
          Manage trivia questions, set monthly prizes, and approve leaderboard winners.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('leaderboards')}
          className={`pb-4 px-2 font-medium transition-all whitespace-nowrap ${
            activeTab === 'leaderboards'
              ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9]'
              : 'text-gray-400 hover:text-gray-200'
          } flex items-center gap-2`}
        >
          <Trophy className="w-4 h-4" />
          Leaderboards & Prizes
        </button>
        <button
          onClick={() => setActiveTab('trivia')}
          className={`pb-4 px-2 font-medium transition-all whitespace-nowrap ${
            activeTab === 'trivia'
              ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9]'
              : 'text-gray-400 hover:text-gray-200'
          } flex items-center gap-2`}
        >
          <HelpCircle className="w-4 h-4" />
          Trivia Manager
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-4 px-2 font-medium transition-all whitespace-nowrap ${
            activeTab === 'maintenance'
              ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9]'
              : 'text-gray-400 hover:text-gray-200'
          } flex items-center gap-2`}
        >
          <AlertTriangle className="w-4 h-4" />
          Maintenance
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'leaderboards' && <AdminLeaderboardsManager />}
        {activeTab === 'trivia' && <AdminTriviaManager />}
        {activeTab === 'maintenance' && <AdminGamesMaintenance />}
      </div>
    </div>
  );
}
