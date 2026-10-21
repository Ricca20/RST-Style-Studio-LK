'use client';

import { useState } from 'react';
import { Trophy, ArrowRight, XCircle, LogIn } from 'lucide-react';
import { Link } from '@/i18n/routing';
import GameRegistrationModal from './GameRegistrationModal';

/** Error thrown by game API calls; keeps the HTTP status so 401 can prompt registration. */
export class GameApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/** POST/GET JSON helper for game endpoints. Throws GameApiError on non-2xx. */
export async function gameFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', ...options.headers } : options.headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new GameApiError(data.error || 'Something went wrong. Please try again.', res.status);
  return data;
}

/** Current time in ms. Wrapped so components only read the clock from event handlers/effects. */
export function nowMs() {
  return Date.now();
}

/** Picks the Sinhala/Italian variant of a field when available, falling back to English. */
export function localized(obj, base, locale) {
  const suffix = locale === 'si' ? 'Si' : locale === 'it' ? 'It' : 'En';
  return obj?.[`${base}${suffix}`] || obj?.[`${base}En`] || '';
}

export function GameLoading({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-white/50">
      <div className="w-8 h-8 border-2 border-white/20 border-t-[#0ea5e9] rounded-full animate-spin mb-4" />
      <p>{label}</p>
    </div>
  );
}

export function GameError({ error }) {
  const needsRegistration = error?.status === 401;
  const [showModal, setShowModal] = useState(needsRegistration);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">{needsRegistration ? 'Register to play' : 'Oops!'}</h2>
      <p className="text-red-400 mb-6">{error?.message}</p>

      {needsRegistration ? (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#0ea5e9] to-rst-accent hover:scale-105 rounded-xl font-bold text-white transition-transform flex items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Register Now
          </button>
          <GameRegistrationModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
      ) : (
        <Link href="/games" className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
          Back to Arcade
        </Link>
      )}
    </div>
  );
}

export function GameFinished({ title = 'Game Over!', subtitle, score, gradient = 'from-[#0ea5e9] to-rst-accent' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 animate-in fade-in zoom-in duration-500">
      <div className={`w-24 h-24 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(14,165,233,0.5)]`}>
        <Trophy className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      {subtitle && <p className="text-white/70 mb-8">{subtitle}</p>}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 w-full max-w-md">
        <span className="block text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Your Final Score</span>
        <span className={`block text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
          {score}
        </span>
        <span className="block text-xs text-white/40 mt-4">Leaderboard updated automatically</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/games/leaderboards" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors">
          <Trophy className="w-4 h-4 text-yellow-400" /> Leaderboards
        </Link>
        <Link href="/games" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors">
          Back to Arcade <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
