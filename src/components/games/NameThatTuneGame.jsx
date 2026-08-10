'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, Trophy, ArrowRight, XCircle } from 'lucide-react';

export default function NameThatTuneGame() {
  const [clips, setClips] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameState, setGameState] = useState('loading'); // loading, playing, submitting, finished, error
  const [answers, setAnswers] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchClips();
  }, []);

  const fetchClips = async () => {
    try {
      const res = await fetch('/api/games/tune');
      if (!res.ok) {
        if (res.status === 401) throw new Error('unauthorized');
        throw new Error('Failed to load clips');
      }
      const data = await res.json();
      setClips(data);
      setGameState('playing');
      setQuestionStartTime(Date.now());
    } catch (err) {
      setGameState('error');
      setErrorMessage(err.message === 'unauthorized' ? 'Please register or login to play.' : 'Could not load clips.');
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play error", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleAnswer = (optionId) => {
    const timeTakenMs = Date.now() - questionStartTime;
    const currentC = clips[currentIdx];

    setAnswers(prev => [...prev, {
      clipId: currentC.id,
      selectedOptionId: optionId,
      timeTakenMs
    }]);

    // Pause current audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (currentIdx + 1 < clips.length) {
      setCurrentIdx(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      setGameState('submitting');
    }
  };

  useEffect(() => {
    if (gameState === 'submitting') {
      submitScore();
    }
  }, [gameState]);

  const submitScore = async () => {
    try {
      const res = await fetch('/api/games/tune/submit', {
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
        <p>Loading audio clips...</p>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
        <p className="text-red-400 mb-6">{errorMessage}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          Try Again
        </button>
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
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 w-full max-w-md">
          <span className="block text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Your Score</span>
          <span className="block text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee]">
            {scoreData.score}
          </span>
        </div>

        <a href="/games" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors">
          Back to Arcade <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  const currentC = clips[currentIdx];
  if (!currentC) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center min-h-[500px]">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentC.audioUrl} 
        onEnded={handleAudioEnd} 
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
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0ea5e9]/20 to-[#9d2bee]/20 rounded-full mix-blend-overlay" />
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
        {currentC.titleEn}
      </h2>

      {/* Options */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentC.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt.id)}
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
