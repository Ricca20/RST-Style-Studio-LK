'use client';
import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Play, Pause, Disc } from 'lucide-react';
import { GameError, GameFinished, GameLoading, gameFetch, localized, nowMs } from './GameStatus';

export default function NameThatTuneGame() {
  const locale = useLocale();
  const [phase, setPhase] = useState('loading'); // loading, playing, submitting, finished, error
  const [clips, setClips] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const tokenRef = useRef(null);
  const answersRef = useRef([]);
  const questionStartRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    gameFetch('/api/games/tune')
      .then(({ clips: served, token }) => {
        if (cancelled) return;
        tokenRef.current = token;
        questionStartRef.current = nowMs();
        setClips(served);
        setPhase('playing');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setPhase('error');
      });
    return () => { cancelled = true; };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error('Audio play error', e));
    }
  };

  const submit = async (answers) => {
    setPhase('submitting');
    try {
      const data = await gameFetch('/api/games/tune/submit', {
        method: 'POST',
        body: JSON.stringify({ token: tokenRef.current, answers }),
      });
      setScore(data.score);
      setPhase('finished');
    } catch (err) {
      setError(err);
      setPhase('error');
    }
  };

  const answer = (optionId) => {
    const clip = clips[currentIdx];
    const timeTakenMs = Math.min(nowMs() - questionStartRef.current, 60_000);
    answersRef.current = [...answersRef.current, { clipId: clip.id, selectedOptionId: optionId, timeTakenMs }];

    audioRef.current?.pause();
    setIsPlaying(false);

    if (currentIdx + 1 < clips.length) {
      questionStartRef.current = nowMs();
      setCurrentIdx(currentIdx + 1);
    } else {
      submit(answersRef.current);
    }
  };

  if (phase === 'loading') return <GameLoading label="Loading audio clips…" />;
  if (phase === 'submitting') return <GameLoading label="Calculating your score…" />;
  if (phase === 'error') return <GameError error={error} />;
  if (phase === 'finished') return <GameFinished score={score} subtitle="You completed Name That Tune." />;

  const currentC = clips[currentIdx];
  if (!currentC) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center min-h-[500px]">

      {/* key resets the element so each clip starts from the beginning */}
      <audio
        key={currentC.id}
        ref={audioRef}
        src={currentC.audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-8 bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex flex-col">
          <span className="text-xs text-white/50 uppercase font-bold tracking-wider mb-1">Track</span>
          <span className="text-xl font-bold text-white">{currentIdx + 1} <span className="text-white/30">/ {clips.length}</span></span>
        </div>
      </div>

      {/* Player UI */}
      <div className="flex flex-col items-center mb-12">
        <div className={`relative mb-6 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
          <Disc className="w-32 h-32 text-white/10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-lime/20 to-rst-accent/20 rounded-full mix-blend-overlay" />
        </div>

        <button
          onClick={togglePlay}
          className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-bold transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause className="w-6 h-6 text-red-400" /> : <Play className="w-6 h-6 text-emerald-400" />}
          {isPlaying ? 'Pause Clip' : 'Play Clip'}
        </button>
      </div>

      <h2 className="text-xl font-medium text-center text-white/80 mb-6">
        {localized(currentC, 'title', locale)}
      </h2>

      {/* Options */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentC.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => answer(opt.id)}
            className="w-full p-4 md:p-6 text-left bg-white/5 hover:bg-lime/20 border border-white/10 hover:border-lime/50 rounded-xl text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between">
              <span>{localized(opt, 'text', locale)}</span>
              <div className="w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-lime transition-colors" />
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
