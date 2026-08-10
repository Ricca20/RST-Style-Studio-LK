'use client';
import { useState, useEffect, useCallback } from 'react';
import { Timer, CheckCircle, XCircle, Trophy, ArrowRight, LogIn } from 'lucide-react';
import GameRegistrationModal from './GameRegistrationModal';

export default function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // { questionId, selectedOptionId, timeTakenMs }
  const [gameState, setGameState] = useState('loading'); // loading, playing, submitting, finished, error
  const [scoreData, setScoreData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/games/trivia');
      if (!res.ok) {
        if (res.status === 401) throw new Error('unauthorized');
        throw new Error('Failed to load questions');
      }
      const data = await res.json();
      setQuestions(data);
      setGameState('playing');
      setQuestionStartTime(Date.now());
    } catch (err) {
      setGameState('error');
      setErrorMessage(err.message === 'unauthorized' ? 'Please register or login to play.' : 'Could not load questions. Try again later.');
    }
  };

  // Timer logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      handleAnswerSelect(null); // Time's up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleAnswerSelect = useCallback((optionId) => {
    const timeTakenMs = Date.now() - questionStartTime;
    const currentQ = questions[currentIdx];

    setAnswers(prev => [...prev, {
      questionId: currentQ.id,
      selectedOptionId: optionId, // null if timed out
      timeTakenMs
    }]);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(15);
      setQuestionStartTime(Date.now());
    } else {
      setGameState('submitting');
    }
  }, [currentIdx, questions, questionStartTime]);

  useEffect(() => {
    if (gameState === 'submitting') {
      submitScore();
    }
  }, [gameState]);

  const submitScore = async () => {
    try {
      const res = await fetch('/api/games/trivia/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit score');
      
      setScoreData(data);
      setGameState('finished');
    } catch (err) {
      setGameState('error');
      setErrorMessage(err.message);
    }
  };

  if (gameState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white/50">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#0ea5e9] rounded-full animate-spin mb-4" />
        <p>Loading questions...</p>
      </div>
    );
  }

  if (gameState === 'error') {
    const isAuthError = errorMessage === 'Please register or login to play.';
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
        <p className="text-red-400 mb-6">{errorMessage}</p>
        
        {isAuthError ? (
          <>
            <button 
              onClick={() => document.getElementById('register-trigger').click()}
              className="px-6 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee] hover:scale-105 rounded-xl font-bold text-white transition-transform flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Register Now
            </button>
            {/* Hidden trigger to simplify state management, or we can just use a state */}
            <GameRegistrationModal isOpen={true} onClose={() => window.location.href = '/games'} />
          </>
        ) : (
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (gameState === 'finished' && scoreData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-[#0ea5e9] to-[#9d2bee] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(14,165,233,0.5)]">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
        <p className="text-white/70 mb-8">You successfully completed the SL Music IQ challenge.</p>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 w-full max-w-md">
          <span className="block text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Your Final Score</span>
          <span className="block text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee]">
            {scoreData.score}
          </span>
          <span className="block text-xs text-white/40 mt-4">Leaderboard updated automatically</span>
        </div>

        <a 
          href="/games"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors"
        >
          Back to Arcade <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
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
        {currentQ.questionEn}
      </h2>

      {/* Options */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQ.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswerSelect(opt.id)}
            className="w-full p-4 md:p-6 text-left bg-white/5 hover:bg-[#0ea5e9]/20 border border-white/10 hover:border-[#0ea5e9]/50 rounded-xl text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between">
              <span>{opt.textEn}</span>
              <div className="w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-[#0ea5e9] transition-colors" />
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
