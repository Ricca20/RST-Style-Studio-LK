'use client';
import { useState } from 'react';
import { Trophy, Medal, Star, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useFetchJson } from '@/lib/hooks/useFetchJson';
import SectionLabel from '@/components/music/SectionLabel';
import Equalizer from '@/components/music/Equalizer';

const GAMES = [
  { id: 'TRIVIA', name: 'SL Music IQ' },
  { id: 'PITCH_MATCH', name: 'Pitch Match' },
  { id: 'THEORY', name: 'Theory Master' },
  { id: 'NAME_THAT_TUNE', name: 'Name That Tune' },
  { id: 'RHYTHM_TAP', name: 'Rhythm Tap' }
];

export default function LeaderboardPage() {
  const [activeGame, setActiveGame] = useState('TRIVIA');
  const { data: leaderboardData, isLoading: loading } = useFetchJson(`/api/games/leaderboard?gameType=${activeGame}`);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const entries = leaderboardData?.leaderboard || [];

  return (
    <section className="px-5 md:px-10 pt-32 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <Link href="/games" className="inline-flex items-center gap-2 text-sm font-semibold text-smoke hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </Link>

        <div className="mt-8">
          <SectionLabel>Charts · {currentMonth} {currentYear}</SectionLabel>
          <h1 className="display text-[clamp(3rem,9vw,7rem)] mt-5">The top ten.</h1>
          <p className="mt-5 max-w-xl text-lg text-smoke">This month&apos;s best scores in each game. Top spot wins the prize.</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-10">
          {GAMES.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGame(g.id)}
              aria-pressed={activeGame === g.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${activeGame === g.id ? 'bg-ink text-paper border-ink' : 'border-ink/15 hover:border-ink/50'}`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {!loading && leaderboardData && (
          <div className="mt-8 rounded-[2rem] bg-lime text-ink p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Star className="w-7 h-7 fill-current" />
              <div>
                <span className="eyebrow block opacity-60">This month&apos;s prize</span>
                <span className="font-display font-bold text-2xl">{leaderboardData.prizeDetails}</span>
              </div>
            </div>
            {leaderboardData.winner && (
              <div className="rounded-2xl bg-ink text-paper px-5 py-3">
                <span className="eyebrow block text-paper/50 text-[0.6rem]">Winner</span>
                <span className="font-bold">@{leaderboardData.winner}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 rounded-[2rem] bg-ink text-paper p-4 md:p-8">
          {loading ? (
            <div className="py-16 flex justify-center"><Equalizer bars={7} className="h-10 text-lime" /></div>
          ) : entries.length > 0 ? (
            <ol>
              {entries.map((entry, idx) => (
                <li key={idx} className={`flex items-center gap-5 py-4 px-3 ${idx !== entries.length - 1 ? 'border-b border-paper/10' : ''}`}>
                  <span className={`w-10 text-center font-display font-bold text-2xl tabular-nums ${idx === 0 ? 'text-lime' : 'text-paper/40'}`}>
                    {idx < 3 ? <Medal className={`w-7 h-7 mx-auto ${idx === 0 ? 'text-lime' : idx === 1 ? 'text-paper/70' : 'text-amber-600'}`} /> : idx + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-lg truncate">@{entry.username}</span>
                    <span className="block text-xs text-paper/40">{new Date(entry.date).toLocaleDateString()}</span>
                  </span>
                  <span className="display text-3xl tabular-nums">{entry.score}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="py-16 text-center">
              <Trophy className="w-10 h-10 mx-auto text-paper/30" />
              <p className="font-display font-bold text-2xl mt-4">No scores yet this month.</p>
              <p className="text-paper/50 mt-2">Be the first on the chart.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
