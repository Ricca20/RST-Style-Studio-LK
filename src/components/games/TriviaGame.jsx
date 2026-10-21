'use client';
import { useState, useEffect, useRef, useEffectEvent } from 'react';
import { useLocale } from 'next-intl';
import { Timer } from 'lucide-react';
import { GameError, GameFinished, GameLoading, gameFetch, localized, nowMs } from './GameStatus';

const SECONDS_PER_QUESTION = 15; // the server allows the same per-question limit

export default function TriviaGame() {
  const locale = useLocale();
  const [phase, setPhase] = useState('loading'); // loading, playing, submitting, finished, error
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  // Mutable game data that must not trigger re-renders or go stale in timers
  const tokenRef = useRef(null);
  const answersRef = useRef([]);
  const questionStartRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    gameFetch('/api/games/trivia')
      .then(({ questions: served, token }) => {
        if (cancelled) return;
        tokenRef.current = token;
        questionStartRef.current = nowMs();
        setQuestions(served);
        setPhase('playing');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setPhase('error');
      });
    return () => { cancelled = true; };
  }, []);

  const submit = async (answers) => {
    setPhase('submitting');
    try {
      const data = await gameFetch('/api/games/trivia/submit', {
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

  // optionId is null when the timer runs out
  const answer = (optionId) => {
    const question = questions[currentIdx];
    const timeTakenMs = Math.min(nowMs() - questionStartRef.current, SECONDS_PER_QUESTION * 1000);
    answersRef.current = [...answersRef.current, { questionId: question.id, selectedOptionId: optionId, timeTakenMs }];

    if (currentIdx + 1 < questions.length) {
      questionStartRef.current = nowMs();
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(SECONDS_PER_QUESTION);
    } else {
      submit(answersRef.current);
    }
  };

  const onTick = useEffectEvent(() => {
    const remaining = SECONDS_PER_QUESTION - Math.floor((nowMs() - questionStartRef.current) / 1000);
    if (remaining <= 0) answer(null);
    else setTimeLeft(remaining);
  });

  // Restart the countdown for each question
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(onTick, 250);
    return () => clearInterval(timer);
  }, [phase, currentIdx]);

  if (phase === 'loading') return <GameLoading label="Loading questions…" />;
  if (phase === 'submitting') return <GameLoading label="Calculating your score…" />;
  if (phase === 'error') return <GameError error={error} />;
  if (phase === 'finished') {
    return <GameFinished subtitle="You completed the SL Music IQ challenge." score={score} />;
  }

  const currentQ = questions[currentIdx];
  if (!currentQ) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center min-h-[500px]">

      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-8 bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex flex-col">
          <span className="text-xs text-white/50 uppercase font-bold tracking-wider mb-1">Question</span>
          <span className="text-xl font-bold text-white">{currentIdx + 1} <span className="text-white/30">/ {questions.length}</span></span>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold ${timeLeft <= 5 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'}`}>
          <Timer className="w-5 h-5" />
          {timeLeft}s
        </div>

        <div className="flex flex-col text-right">
          <span className="text-xs text-white/50 uppercase font-bold tracking-wider mb-1">Difficulty</span>
          <span className={`text-sm font-bold ${currentQ.difficulty === 'HARD' ? 'text-purple-400' : currentQ.difficulty === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {currentQ.difficulty}
          </span>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10 leading-tight">
        {localized(currentQ, 'question', locale)}
      </h2>

      {/* Options */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQ.options.map((opt) => (
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
