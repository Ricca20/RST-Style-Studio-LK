'use client';
import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const GAMES = [
  { id: 'TRIVIA', name: 'SL Music IQ' },
  { id: 'PITCH_MATCH', name: 'Pitch Match' },
  { id: 'THEORY', name: 'Theory Master' },
  { id: 'NAME_THAT_TUNE', name: 'Name That Tune' },
  { id: 'RHYTHM_TAP', name: 'Rhythm Tap' }
];

export default function LeaderboardPage() {
  const [activeGame, setActiveGame] = useState('TRIVIA');
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchLeaderboard(activeGame);
  }, [activeGame]);

  const fetchLeaderboard = async (gameType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/games/leaderboard?gameType=${gameType}`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboardData(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Arcade
        </Link>

        <div className="text-center mb-12 flex flex-col items-center">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-white">
            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Fame</span>
          </h1>
          <p className="text-white/60">
            Top scores for {currentMonth} {currentYear}. Compete to win exclusive studio prizes!
          </p>
        </div>

        {/* Game Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {GAMES.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeGame === g.id 
                  ? 'bg-white text-black shadow-lg shadow-white/20' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Prize Box */}
        {!loading && leaderboardData && (
          <div className="w-full bg-gradient-to-r from-yellow-500/10 to-amber-600/10 border border-yellow-500/20 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <span className="text-xs font-bold text-yellow-500/70 uppercase tracking-widest block mb-1">This Month's Prize</span>
                <span className="text-xl font-bold text-white">{leaderboardData.prizeDetails}</span>
              </div>
            </div>
            
            {leaderboardData.winner ? (
              <div className="bg-yellow-500/20 px-6 py-3 rounded-xl border border-yellow-500/30">
                <span className="text-xs text-yellow-500 uppercase font-bold block mb-1">Last Month Winner</span>
                <span className="font-bold text-white">@{leaderboardData.winner}</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-yellow-500 rounded-full animate-spin" />
            </div>
          ) : leaderboardData?.leaderboard?.length > 0 ? (
            <div className="flex flex-col">
              {leaderboardData.leaderboard.map((entry, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-6 ${idx !== leaderboardData.leaderboard.length - 1 ? 'border-b border-white/5' : ''} ${idx === 0 ? 'bg-yellow-500/5' : idx === 1 ? 'bg-slate-300/5' : idx === 2 ? 'bg-amber-700/5' : ''}`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-8 flex justify-center">
                      {idx === 0 ? <Medal className="w-8 h-8 text-yellow-500" /> :
                       idx === 1 ? <Medal className="w-8 h-8 text-slate-300" /> :
                       idx === 2 ? <Medal className="w-8 h-8 text-amber-700" /> :
                       <span className="text-xl font-bold text-white/30">#{idx + 1}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg text-white">@{entry.username}</span>
                      <span className="text-xs text-white/40">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                    {entry.score}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-white/50">
              No scores for this game this month yet. Be the first!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
