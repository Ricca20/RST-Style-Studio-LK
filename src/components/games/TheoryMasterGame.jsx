'use client';
import { useState, useRef, useEffect } from 'react';
import { BookOpen, Trophy, ArrowRight, Play, CheckCircle, XCircle } from 'lucide-react';

export default function TheoryMasterGame() {
  const [gameState, setGameState] = useState('select_track'); // select_track, playing, submitting, finished, error
  const [track, setTrack] = useState(null); // 'western' or 'eastern'
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Audio Context for playing notes
  const audioCtxRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const selectTrack = async (selectedTrack) => {
    setTrack(selectedTrack);
    try {
      const res = await fetch(`/api/games/theory?track=${selectedTrack}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error('unauthorized');
        throw new Error('Failed to load questions');
      }
      const data = await res.json();
      setQuestions(data);
      setGameState('playing');
    } catch (err) {
      setGameState('error');
      setErrorMessage(err.message === 'unauthorized' ? 'Please register or login to play.' : 'Could not load questions.');
    }
  };

  const playNotes = (freqs) => {
    if (!freqs || freqs.length === 0) return;
    
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const startTime = audioCtxRef.current.currentTime;
    
    // Play an arpeggio
    freqs.forEach((freq, idx) => {
      const osc = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + (idx * 0.3));
      
      gainNode.gain.setValueAtTime(0, startTime + (idx * 0.3));
      gainNode.gain.linearRampToValueAtTime(0.5, startTime + (idx * 0.3) + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + (idx * 0.3) + 0.8);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      
      osc.start(startTime + (idx * 0.3));
      osc.stop(startTime + (idx * 0.3) + 0.8);
    });
  };

  const handleAnswer = (optionId) => {
    const currentQ = questions[currentIdx];
    setAnswers(prev => [...prev, { questionId: currentQ.id, selectedOptionId: optionId }]);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
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
      const res = await fetch('/api/games/theory/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track, answers })
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

  if (gameState === 'select_track') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <BookOpen className="w-16 h-16 text-purple-400 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-8">Choose Your Syllabus</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button 
            onClick={() => selectTrack('eastern')}
            className="flex flex-col items-center p-8 bg-white/5 border border-white/10 hover:border-orange-400/50 hover:bg-orange-400/10 rounded-2xl transition-all group"
          >
            <div className="text-2xl font-bold text-white group-hover:text-orange-400 mb-2">Eastern Music</div>
            <p className="text-white/50 text-sm text-center">Raagas, Thaatas, Taals, and Shruti knowledge.</p>
          </button>

          <button 
            onClick={() => selectTrack('western')}
            className="flex flex-col items-center p-8 bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-blue-400/10 rounded-2xl transition-all group"
          >
            <div className="text-2xl font-bold text-white group-hover:text-blue-400 mb-2">Western Music</div>
            <p className="text-white/50 text-sm text-center">Scales, Chords, Time Signatures, and Harmony.</p>
          </button>
        </div>
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
        <h2 className="text-3xl font-bold text-white mb-2">Exam Completed!</h2>
        <p className="text-white/70 mb-8">You successfully completed the Theory Master exam.</p>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 w-full max-w-md">
          <span className="block text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Your Score</span>
          <span className="block text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee]">
            {scoreData.score}
          </span>
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
        
        <div className="flex flex-col text-right">
          <span className="text-xs text-white/50 uppercase font-bold tracking-wider mb-1">Track</span>
          <span className="text-sm font-bold text-purple-400 capitalize">
            {track} Music
          </span>
        </div>
      </div>

      {/* Audio Playback Button (if applicable) */}
      {currentQ.audioNotes && (
        <button 
          onClick={() => playNotes(currentQ.audioNotes)}
          className="mb-8 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors"
        >
          <Play className="w-5 h-5 text-[#0ea5e9]" /> Listen to Example
        </button>
      )}

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10 leading-tight">
        {currentQ.questionEn}
      </h2>

      {/* Options */}
      <div className="w-full flex flex-col gap-4">
        {currentQ.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt.id)}
            className="w-full p-5 text-left bg-white/5 hover:bg-[#0ea5e9]/20 border border-white/10 hover:border-[#0ea5e9]/50 rounded-xl text-white font-medium transition-all group"
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
