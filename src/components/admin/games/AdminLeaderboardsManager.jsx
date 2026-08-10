'use client';

import { useState, useEffect } from 'react';
import { Trophy, Gift, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLeaderboardsManager() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [prizeForm, setPrizeForm] = useState({
    gameType: 'TRIVIA',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    prizeDetails: ''
  });

  const fetchLeaderboards = async () => {
    try {
      const res = await fetch('/api/admin/games/leaderboards');
      if (res.ok) {
        const data = await res.json();
        setLeaderboards(data);
      }
    } catch (error) {
      toast.error('Failed to load leaderboards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const handleSetPrize = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/games/leaderboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SET_PRIZE',
          ...prizeForm
        })
      });

      if (res.ok) {
        toast.success('Prize updated successfully');
        fetchLeaderboards();
        setPrizeForm({ ...prizeForm, prizeDetails: '' });
      } else {
        toast.error('Failed to update prize');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleApproveWinner = async (leaderboardId, winnerId) => {
    if (!confirm('Are you sure you want to approve this winner? They will receive an email notification.')) return;
    try {
      const res = await fetch('/api/admin/games/leaderboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_WINNER',
          leaderboardId,
          winnerId
        })
      });

      if (res.ok) {
        toast.success('Winner approved and notified');
        fetchLeaderboards();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to approve winner');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading leaderboards...</div>;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* Set Prize Section */}
      <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-6 h-6 text-[#9d2bee]" />
          <h3 className="text-lg font-bold text-white">Configure Monthly Prize</h3>
        </div>
        <form onSubmit={handleSetPrize} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Game</label>
            <select
              value={prizeForm.gameType}
              onChange={(e) => setPrizeForm({...prizeForm, gameType: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#9d2bee] focus:outline-none"
            >
              <option value="TRIVIA">SL Music IQ (Trivia)</option>
              <option value="PITCH_MATCH">Pitch Match</option>
              <option value="THEORY">Theory Master</option>
              <option value="RHYTHM_TAP">Rhythm Tap</option>
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm text-gray-400 mb-1">Month</label>
            <input
              type="number"
              min="1" max="12"
              value={prizeForm.month}
              onChange={(e) => setPrizeForm({...prizeForm, month: parseInt(e.target.value)})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#9d2bee] focus:outline-none"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm text-gray-400 mb-1">Year</label>
            <input
              type="number"
              value={prizeForm.year}
              onChange={(e) => setPrizeForm({...prizeForm, year: parseInt(e.target.value)})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#9d2bee] focus:outline-none"
            />
          </div>
          <div className="flex-2 w-full md:w-1/3">
            <label className="block text-sm text-gray-400 mb-1">Prize Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Free 2-hour Studio Session"
              value={prizeForm.prizeDetails}
              onChange={(e) => setPrizeForm({...prizeForm, prizeDetails: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#9d2bee] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-[#9d2bee] text-white font-medium rounded-lg hover:bg-[#9d2bee]/90 transition-colors whitespace-nowrap"
          >
            Save Prize
          </button>
        </form>
      </div>

      {/* Leaderboards List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" /> Recent Leaderboards
        </h3>
        
        {leaderboards.length === 0 ? (
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-xl text-center text-gray-500">
            No leaderboards found.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {leaderboards.map((board) => (
              <div key={board.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-bold text-lg">{board.gameType.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-400">{board.month}/{board.year}</p>
                  </div>
                  {board.prizeDetails ? (
                    <span className="bg-[#9d2bee]/10 text-[#9d2bee] border border-[#9d2bee]/30 px-3 py-1 rounded-full text-xs font-bold">
                      Prize: {board.prizeDetails}
                    </span>
                  ) : (
                    <span className="bg-gray-800 text-gray-500 border border-gray-700 px-3 py-1 rounded-full text-xs">
                      No Prize Set
                    </span>
                  )}
                </div>

                <div className="bg-gray-950 rounded-lg p-4 border border-gray-800">
                  <h5 className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">Current Top Players</h5>
                  
                  {board.topScores && board.topScores.length > 0 ? (
                    <div className="space-y-2">
                      {board.topScores.map((score, index) => (
                        <div key={score.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              index === 1 ? 'bg-gray-300/20 text-gray-300' :
                              index === 2 ? 'bg-amber-700/20 text-amber-600' :
                              'bg-gray-800 text-gray-500'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="text-gray-300">{score.player.username}</span>
                          </div>
                          <span className="font-mono text-emerald-400 font-bold">{score.score} pts</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 italic">No scores recorded yet.</p>
                  )}
                </div>

                {/* Winner Approval Actions */}
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <div>
                    {board.adminApproved ? (
                      <span className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                        <CheckCircle className="w-4 h-4" /> Winner Approved & Notified
                      </span>
                    ) : board.month < currentMonth || board.year < currentYear ? (
                      <span className="text-sm text-yellow-500 font-medium">Month Ended - Pending Approval</span>
                    ) : (
                      <span className="text-sm text-gray-500">Month still active</span>
                    )}
                  </div>
                  
                  {!board.adminApproved && (board.month < currentMonth || board.year < currentYear) && board.topScores?.length > 0 && (
                    <button
                      onClick={() => handleApproveWinner(board.id, board.topScores[0].player.id)}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Winner
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
