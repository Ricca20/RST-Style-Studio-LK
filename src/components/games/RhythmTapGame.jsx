'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, ArrowRight, XCircle } from 'lucide-react';

// Configuration for beats
const BEAT_SPEED = 3000; // ms to drop from top to bottom
const HIT_ZONE_TOP = 80; // %
const HIT_ZONE_BOTTOM = 90; // %
const PERFECT_TOLERANCE = 2; // %

// Level definitions
const LEVELS = [
  { bpm: 60, totalBeats: 10 },
  { bpm: 90, totalBeats: 15 },
  { bpm: 120, totalBeats: 20 }
];

export default function RhythmTapGame() {
  const [gameState, setGameState] = useState('intro'); // intro, playing, submitting, finished, error
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Game loop state
  const [activeBeats, setActiveBeats] = useState([]);
  const beatIdCounter = useRef(0);
  const lastSpawnTime = useRef(0);
  const activeBeatsRef = useRef([]); // for synchronous access during tap
  const gameLoopRef = useRef(null);
  
  const [scoreData, setScoreData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    startLevel(0);
  };

  const startLevel = (levelIdx) => {
    if (levelIdx >= LEVELS.length) {
      submitScore();
      return;
    }
    
    setCurrentLevel(levelIdx);
    setActiveBeats([]);
    activeBeatsRef.current = [];
    beatIdCounter.current = 0;
    lastSpawnTime.current = performance.now();
    
    // Start game loop
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = useCallback((timestamp) => {
    if (gameState !== 'playing') return;

    const level = LEVELS[currentLevel];
    const msPerBeat = 60000 / level.bpm;

    // Spawn new beats
    if (timestamp - lastSpawnTime.current > msPerBeat && beatIdCounter.current < level.totalBeats) {
      const newBeat = {
        id: beatIdCounter.current++,
        spawnTime: timestamp,
        yPercent: 0,
        hit: false
      };
      activeBeatsRef.current = [...activeBeatsRef.current, newBeat];
      lastSpawnTime.current = timestamp;
    }

    // Update positions
    let activeCount = 0;
    activeBeatsRef.current = activeBeatsRef.current.map(beat => {
      if (beat.hit) return beat;
      
      const elapsed = timestamp - beat.spawnTime;
      const progress = (elapsed / BEAT_SPEED) * 100;
      
      if (progress > 100) {
        // Missed
        beat.hit = true;
        setFeedback('Miss!');
        return beat;
      }
      
      activeCount++;
      return { ...beat, yPercent: progress };
    });

    setActiveBeats(activeBeatsRef.current);

    // Check if level complete (all spawned and finished)
    if (beatIdCounter.current >= level.totalBeats && activeCount === 0) {
      // Small delay before next level
      setTimeout(() => {
        startLevel(currentLevel + 1);
      }, 2000);
      return;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [currentLevel, gameState]);

  // Handle Input
  const handleTap = useCallback(() => {
    if (gameState !== 'playing') return;
    
    // Find the lowest active beat
    const beats = activeBeatsRef.current.filter(b => !b.hit).sort((a, b) => b.yPercent - a.yPercent);
    if (beats.length === 0) return;

    const targetBeat = beats[0];
    
    // Evaluate hit
    let points = 0;
    let text = '';
    
    const centerZone = (HIT_ZONE_TOP + HIT_ZONE_BOTTOM) / 2;
    const diff = Math.abs(targetBeat.yPercent - centerZone);

    if (targetBeat.yPercent >= HIT_ZONE_TOP && targetBeat.yPercent <= HIT_ZONE_BOTTOM) {
      if (diff <= PERFECT_TOLERANCE) {
        points = 20;
        text = 'Perfect! 🔥';
      } else {
        points = 10;
        text = 'Good!';
      }
    } else {
      text = 'Miss!';
    }

    // Mark as hit
    activeBeatsRef.current = activeBeatsRef.current.map(b => 
      b.id === targetBeat.id ? { ...b, hit: true } : b
    );
    
    setScore(prev => prev + points);
    setFeedback(text);
    
    // Visual pop for feedback
    setTimeout(() => setFeedback(''), 1000);

  }, [gameState]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTap]);


  const submitScore = async () => {
    setGameState('submitting');
    try {
      const res = await fetch('/api/games/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType: 'RHYTHM_TAP', score })
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

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl w-full max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
          <div className="w-6 h-6 rounded-full bg-white animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Rhythm Tap</h2>
        <p className="text-white/70 mb-8 max-w-md">
          Hit the spacebar or tap the button when the glowing notes enter the target zone at the bottom.
        </p>
        <button 
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform rounded-xl font-bold text-white"
        >
          Start Tapping
        </button>
      </div>
    );
  }

  if (gameState === 'finished' && scoreData) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Stage Clear!</h2>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 w-full max-w-md">
          <span className="block text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Final Score</span>
          <span className="block text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            {scoreData.score}
          </span>
        </div>

        <a href="/games" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors">
          Back to Arcade <ArrowRight className="w-4 h-4" />
        </a>
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
          <span className="text-xl font-bold text-pink-400">{score}</span>
        </div>
      </div>

      {/* Game Track Area */}
      <div className="w-full h-[500px] bg-black/40 border-2 border-white/10 rounded-xl relative overflow-hidden mb-6">
        
        {/* Track Lines */}
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/5" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white/5" />

        {/* Hit Zone */}
        <div 
          className="absolute w-full border-t border-b border-pink-500/50 bg-pink-500/10 z-0 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
          style={{ top: `${HIT_ZONE_TOP}%`, bottom: `${100 - HIT_ZONE_BOTTOM}%` }}
        />

        {/* Falling Beats */}
        {activeBeats.map(beat => {
          if (beat.hit) return null;
          return (
            <div 
              key={beat.id}
              className="absolute left-1/2 -ml-6 w-12 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
              style={{ top: `${beat.yPercent}%` }}
            />
          );
        })}

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
        className="w-full py-8 bg-pink-500 hover:bg-pink-400 active:bg-white text-white active:text-pink-600 font-black text-2xl uppercase tracking-widest rounded-2xl shadow-[0_10px_0_rgba(190,24,93,1)] active:shadow-none active:translate-y-[10px] transition-all select-none touch-manipulation"
      >
        TAP / SPACE
      </button>

    </div>
  );
}
