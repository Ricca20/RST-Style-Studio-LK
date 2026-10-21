'use client';
import { useState, useEffect, useRef, useEffectEvent } from 'react';
import { GameError, GameFinished, GameLoading, gameFetch } from './GameStatus';

const BEAT_SPEED = 3000; // ms to drop from top to bottom
const HIT_ZONE_TOP = 80; // %
const HIT_ZONE_BOTTOM = 90; // %
const PERFECT_TOLERANCE = 2; // %
const LEVEL_PAUSE_MS = 2000;

// The server's max score (45 beats × 20) and minimum duration assume these levels
const LEVELS = [
  { bpm: 60, totalBeats: 10 },
  { bpm: 90, totalBeats: 15 },
  { bpm: 120, totalBeats: 20 }
];

// Same clock as requestAnimationFrame timestamps. Module-level so components
// only read it from handlers and frames, never during render.
const perfNow = () => performance.now();

export default function RhythmTapGame() {
  const [phase, setPhase] = useState('intro'); // intro, starting, playing, submitting, finished, error
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [activeBeats, setActiveBeats] = useState([]);
  const [error, setError] = useState(null);

  // Everything the animation loop touches lives in refs so it never reads stale state
  const levelRef = useRef(0);
  const beatsRef = useRef([]);
  const spawnedRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const scoreRef = useRef(0);
  const runningRef = useRef(false);
  const rafRef = useRef(null);
  const tokenRef = useRef(null);
  const timeoutsRef = useRef([]);
  const feedbackTimeoutRef = useRef(null);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timeouts.forEach(clearTimeout);
      clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const showFeedback = (text) => {
    setFeedback(text);
    clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setFeedback(''), 1000);
  };

  const submitScore = async (finalScore) => {
    setPhase('submitting');
    try {
      await gameFetch('/api/games/scores', {
        method: 'POST',
        body: JSON.stringify({ gameType: 'RHYTHM_TAP', score: finalScore, token: tokenRef.current }),
      });
      setPhase('finished');
    } catch (err) {
      setError(err);
      setPhase('error');
    }
  };

  const gameLoop = (timestamp) => {
    if (!runningRef.current) return;

    const level = LEVELS[levelRef.current];
    const msPerBeat = 60000 / level.bpm;

    if (spawnedRef.current < level.totalBeats && timestamp - lastSpawnRef.current > msPerBeat) {
      beatsRef.current = [...beatsRef.current, { id: spawnedRef.current++, spawnTime: timestamp, yPercent: 0, hit: false }];
      lastSpawnRef.current = timestamp;
    }

    let activeCount = 0;
    beatsRef.current = beatsRef.current.map((beat) => {
      if (beat.hit) return beat;
      const progress = ((timestamp - beat.spawnTime) / BEAT_SPEED) * 100;
      if (progress > 100) {
        showFeedback('Miss!');
        return { ...beat, hit: true };
      }
      activeCount++;
      return { ...beat, yPercent: progress };
    });
    setActiveBeats(beatsRef.current);

    if (spawnedRef.current >= level.totalBeats && activeCount === 0) {
      runningRef.current = false;
      timeoutsRef.current.push(setTimeout(() => startLevel(levelRef.current + 1), LEVEL_PAUSE_MS));
      return;
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  };

  const startLevel = (levelIdx) => {
    if (levelIdx >= LEVELS.length) {
      submitScore(scoreRef.current);
      return;
    }

    levelRef.current = levelIdx;
    beatsRef.current = [];
    spawnedRef.current = 0;
    lastSpawnRef.current = perfNow();
    runningRef.current = true;
    setCurrentLevel(levelIdx);
    setActiveBeats([]);
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  const startGame = async () => {
    setPhase('starting');
    try {
      const { token } = await gameFetch('/api/games/start', {
        method: 'POST',
        body: JSON.stringify({ gameType: 'RHYTHM_TAP' }),
      });
      tokenRef.current = token;
    } catch (err) {
      setError(err);
      setPhase('error');
      return;
    }

    scoreRef.current = 0;
    setScore(0);
    setPhase('playing');
    startLevel(0);
  };

  const handleTap = () => {
    if (!runningRef.current) return;

    // The lowest beat still falling
    const target = beatsRef.current.filter((b) => !b.hit).sort((a, b) => b.yPercent - a.yPercent)[0];
    if (!target) return;

    let points = 0;
    const centerZone = (HIT_ZONE_TOP + HIT_ZONE_BOTTOM) / 2;
    if (target.yPercent >= HIT_ZONE_TOP && target.yPercent <= HIT_ZONE_BOTTOM) {
      points = Math.abs(target.yPercent - centerZone) <= PERFECT_TOLERANCE ? 20 : 10;
    }
    showFeedback(points === 20 ? 'Perfect! 🔥' : points === 10 ? 'Good!' : 'Miss!');

    beatsRef.current = beatsRef.current.map((b) => (b.id === target.id ? { ...b, hit: true } : b));
    scoreRef.current += points;
    setScore(scoreRef.current);
  };

  const onKeyDown = useEffectEvent((e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      handleTap();
    }
  });

  useEffect(() => {
    if (phase !== 'playing') return;
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase]);

  if (phase === 'starting') return <GameLoading label="Starting game…" />;
  if (phase === 'submitting') return <GameLoading label="Saving your score…" />;
  if (phase === 'error') return <GameError error={error} />;
  if (phase === 'finished') {
    return <GameFinished title="Stage Clear!" score={score} />;
  }

  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl w-full max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-lime flex items-center justify-center mb-6 ">
          <div className="w-6 h-6 rounded-full bg-white animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Rhythm Tap</h2>
        <p className="text-white/70 mb-8 max-w-md">
          Hit the spacebar or tap the button when the glowing notes enter the target zone at the bottom.
        </p>
        <button
          onClick={startGame}
          className="px-8 py-4 bg-lime hover:scale-105 transition-transform rounded-xl font-bold text-ink"
        >
          Start Tapping
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">

      {/* Top HUD */}
      <div className="w-full flex justify-between items-center mb-4">
        <div>
          <span className="text-xs text-white/50 block">Level</span>
          <span className="text-xl font-bold text-white">{currentLevel + 1} / {LEVELS.length}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/50 block">Score</span>
          <span className="text-xl font-bold text-lime">{score}</span>
        </div>
      </div>

      {/* Game Track Area */}
      <div className="w-full h-[500px] bg-black/40 border-2 border-white/10 rounded-xl relative overflow-hidden mb-6">
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/5" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white/5" />

        {/* Hit Zone */}
        <div
          className="absolute w-full border-t border-b border-lime/60 bg-lime/10 z-0 "
          style={{ top: `${HIT_ZONE_TOP}%`, bottom: `${100 - HIT_ZONE_BOTTOM}%` }}
        />

        {/* Falling Beats */}
        {activeBeats.map((beat) => !beat.hit && (
          <div
            key={beat.id}
            className="absolute left-1/2 -ml-6 w-12 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
            style={{ top: `${beat.yPercent}%` }}
          />
        ))}

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span className={`text-4xl font-black italic tracking-widest uppercase animate-bounce ${feedback.includes('Perfect') ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]' : feedback.includes('Good') ? 'text-emerald-400' : 'text-red-500'}`}>
              {feedback}
            </span>
          </div>
        )}
      </div>

      {/* Mobile Tap Button */}
      <button
        onClick={handleTap}
        className="w-full py-8 bg-lime hover:brightness-95 active:bg-paper text-ink font-black text-2xl uppercase tracking-widest rounded-2xl shadow-[0_10px_0_rgba(0,0,0,0.45)] active:shadow-none active:translate-y-[10px] transition-all select-none touch-manipulation"
      >
        TAP / SPACE
      </button>
    </div>
  );
}
