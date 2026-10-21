'use client';
import { useState, useRef, useEffect } from 'react';
import { BookOpen, Play } from 'lucide-react';
import { GameError, GameFinished, GameLoading, gameFetch } from './GameStatus';

export default function TheoryMasterGame() {
  const [gameState, setGameState] = useState('select_track'); // select_track, loading, playing, submitting, finished, error
  const [track, setTrack] = useState(null); // 'western' or 'eastern'
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  const tokenRef = useRef(null);
  const answersRef = useRef([]);

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
    setGameState('loading');
    try {
      const data = await gameFetch(`/api/games/theory?track=${selectedTrack}`);
      tokenRef.current = data.token;
      setQuestions(data.questions);
      setGameState('playing');
    } catch (err) {
      setError(err);
      setGameState('error');
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

  const submitScore = async (answers) => {
    setGameState('submitting');
    try {
      const data = await gameFetch('/api/games/theory/submit', {
        method: 'POST',
        body: JSON.stringify({ token: tokenRef.current, answers }),
      });
      setScore(data.score);
      setGameState('finished');
    } catch (err) {
      setError(err);
      setGameState('error');
    }
  };

  const handleAnswer = (optionId) => {
    const currentQ = questions[currentIdx];
    answersRef.current = [...answersRef.current, { questionId: currentQ.id, selectedOptionId: optionId }];

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      submitScore(answersRef.current);
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

  if (gameState === 'loading') return <GameLoading label="Loading questions…" />;
  if (gameState === 'submitting') return <GameLoading label="Marking your exam…" />;
  if (gameState === 'error') return <GameError error={error} />;
  if (gameState === 'finished') {
    return <GameFinished title="Exam Completed!" subtitle="You completed the Theory Master exam." score={score} />;
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
