'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Play, Trophy, ArrowRight, Settings } from 'lucide-react';

const TARGET_PITCHES = [
  { name: 'C4', freq: 261.63 },
  { name: 'E4', freq: 329.63 },
  { name: 'G4', freq: 392.00 },
  { name: 'A4', freq: 440.00 },
  { name: 'C5', freq: 523.25 }
];

export default function PitchMatchGame() {
  const [gameState, setGameState] = useState('intro'); // intro, playing, finished, submitting, error
  const [round, setRound] = useState(0);
  const [useMic, setUseMic] = useState(true);
  const [scoreData, setScoreData] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  
  // Game state
  const [targetFreq, setTargetFreq] = useState(0);
  const [currentFreq, setCurrentFreq] = useState(0);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Audio Context refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const oscillatorRef = useRef(null);
  const sourceRef = useRef(null);
  const rafIdRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch (e) {}
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const initAudio = async () => {
    stopAudio();
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      if (useMic) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        sourceRef.current = audioCtxRef.current.createMediaStreamSource(streamRef.current);
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        sourceRef.current.connect(analyserRef.current);
        detectPitch();
      }
      return true;
    } catch (err) {
      console.error('Audio init error:', err);
      setUseMic(false); // Fallback to slider
      return false;
    }
  };

  const playTargetPitch = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch (e) {}
      oscillatorRef.current.disconnect();
    }

    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(targetFreq, audioCtxRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtxRef.current.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 2.0);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 2.0);
    
    oscillatorRef.current = osc;
    setIsPlayingTarget(true);
    
    setTimeout(() => {
      setIsPlayingTarget(false);
    }, 2000);
  };

  // Simple AutoCorrelation Pitch Detection (YIN/McLeod simplified)
  const detectPitch = () => {
    if (!analyserRef.current || !useMic || gameState !== 'playing') return;
    
    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    const pitch = autoCorrelate(buffer, audioCtxRef.current.sampleRate);
    if (pitch !== -1) {
      setCurrentFreq(Math.round(pitch));
      updateFeedback(pitch);
    }
    
    rafIdRef.current = requestAnimationFrame(detectPitch);
  };

  const autoCorrelate = (buffer, sampleRate) => {
    let size = buffer.length;
    let maxSamples = Math.floor(size / 2);
    let bestOffset = -1;
    let bestCorr = 0;
    let rms = 0;
    let foundGoodCorrelation = false;
    let correlations = new Array(maxSamples);

    for (let i = 0; i < size; i++) {
      let val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // Not enough signal

    let lastCorrelation = 1;
    for (let offset = 0; offset < maxSamples; offset++) {
      let correlation = 0;
      for (let i = 0; i < maxSamples; i++) {
        correlation += Math.abs((buffer[i]) - (buffer[i + offset]));
      }
      correlation = 1 - (correlation / maxSamples);
      correlations[offset] = correlation;
      
      if ((correlation > 0.9) && (correlation > lastCorrelation)) {
        foundGoodCorrelation = true;
        if (correlation > bestCorr) {
          bestCorr = correlation;
          bestOffset = offset;
        }
      } else if (foundGoodCorrelation) {
        let shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];  
        return sampleRate / (bestOffset + (8 * shift));
      }
      lastCorrelation = correlation;
    }
    if (bestCorr > 0.01) return sampleRate / bestOffset;
    return -1;
  };

  const updateFeedback = (freq) => {
    if (!targetFreq || freq === -1) {
      setFeedback('Sing a note...');
      return;
    }
    const diff = freq - targetFreq;
    if (Math.abs(diff) <= 5) setFeedback('Perfect Match! 🔥');
    else if (diff > 5 && diff < 30) setFeedback('A bit too high');
    else if (diff < -5 && diff > -30) setFeedback('A bit too low');
    else setFeedback('Keep trying!');
  };

  const startRound = (roundIdx) => {
    if (roundIdx >= TARGET_PITCHES.length) {
      submitScore();
      return;
    }
    
    setRound(roundIdx);
    setTargetFreq(TARGET_PITCHES[roundIdx].freq);
    setCurrentFreq(0);
    setFeedback(useMic ? 'Sing to match!' : 'Move the slider to match');
  };

  const startGame = async () => {
    const success = await initAudio();
    setGameState('playing');
    setTotalScore(0);
    startRound(0);
  };

  const lockInAnswer = () => {
    // Calculate score based on proximity
    const diff = Math.abs(currentFreq - targetFreq);
    let roundScore = 0;
    
    if (diff <= 2) roundScore = 100;
    else if (diff <= 10) roundScore = 80;
    else if (diff <= 30) roundScore = 50;
    else if (diff <= 50) roundScore = 20;

    setTotalScore(prev => prev + roundScore);
    
    setTimeout(() => {
      startRound(round + 1);
    }, 1500);
  };

  const submitScore = async () => {
    setGameState('submitting');
    stopAudio();
    try {
      const res = await fetch('/api/games/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType: 'PITCH_MATCH', score: totalScore })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit score');
      
      setScoreData(data);
      setGameState('finished');
    } catch (err) {
      setGameState('error');
      setFeedback(err.message);
    }
  };

  // Renders
  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl w-full max-w-2xl mx-auto text-center">
        <Mic className="w-16 h-16 text-[#0ea5e9] mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">Pitch Match</h2>
        <p className="text-white/70 mb-8 max-w-md">
          Listen to the target pitch and try to match it using your voice. Don't have a mic? Use the manual slider fallback!
        </p>
        
        <div className="flex items-center gap-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
          <button 
            onClick={() => setUseMic(!useMic)}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            {useMic ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-white/40" />}
            {useMic ? 'Microphone Enabled' : 'Microphone Disabled (Slider Mode)'}
          </button>
        </div>

        <button 
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee] hover:scale-105 transition-transform rounded-xl font-bold text-white shadow-lg shadow-[#0ea5e9]/20"
        >
          Start Playing
        </button>
      </div>
    );
  }

  if (gameState === 'finished' && scoreData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl w-full max-w-2xl mx-auto text-center">
        <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Well Done!</h2>
        <p className="text-white/70 mb-8">You've completed the Pitch Match challenge.</p>
        
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee] mb-8">
          {totalScore}
        </div>

        <a href="/games" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
          Back to Arcade <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8 bg-white/5 p-4 rounded-xl">
        <div>
          <span className="text-xs text-white/50 uppercase block mb-1">Round</span>
          <span className="text-xl font-bold text-white">{round + 1} / 5</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/50 uppercase block mb-1">Score</span>
          <span className="text-xl font-bold text-[#0ea5e9]">{totalScore}</span>
        </div>
      </div>

      <div className="mb-12 flex flex-col items-center">
        <button 
          onClick={playTargetPitch}
          disabled={isPlayingTarget}
          className={`w-32 h-32 rounded-full flex items-center justify-center border-4 mb-4 transition-all ${
            isPlayingTarget ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] scale-110 shadow-[0_0_30px_rgba(14,165,233,0.5)]' : 'bg-white/5 border-white/20 hover:border-[#0ea5e9]/50 hover:bg-white/10'
          }`}
        >
          <Play className={`w-12 h-12 ${isPlayingTarget ? 'text-[#0ea5e9]' : 'text-white/80'}`} />
        </button>
        <span className="text-white/50">Play Target Pitch</span>
      </div>

      {/* Visualizer / Pitch Display */}
      <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
        
        {/* Target Line */}
        <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-white/30 z-0" />
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-4xl font-mono font-bold text-white mb-2">
            {currentFreq > 0 ? `${currentFreq} Hz` : '-- Hz'}
          </span>
          <span className={`text-lg font-bold px-4 py-1 rounded-full ${feedback.includes('Perfect') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/70'}`}>
            {feedback}
          </span>
        </div>

        {/* Pitch Bar (Visual diff) */}
        {currentFreq > 0 && targetFreq > 0 && (
          <div className="w-full mt-8 h-4 bg-white/10 rounded-full relative overflow-hidden">
            <div 
              className="absolute h-full w-2 bg-[#0ea5e9] rounded-full transition-all duration-100 ease-out"
              style={{
                left: `${Math.max(0, Math.min(100, 50 + ((currentFreq - targetFreq) / targetFreq) * 100))}%`
              }}
            />
            {/* Center target marker */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50 -translate-x-1/2" />
          </div>
        )}
      </div>

      {!useMic && (
        <div className="w-full mb-8">
          <label className="text-white/50 text-sm mb-2 block">Manual Pitch Control</label>
          <input 
            type="range" 
            min="100" 
            max="1000" 
            value={currentFreq} 
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setCurrentFreq(val);
              updateFeedback(val);
            }}
            className="w-full accent-[#0ea5e9]"
          />
        </div>
      )}

      <button 
        onClick={lockInAnswer}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors text-lg"
      >
        Lock In Answer
      </button>

    </div>
  );
}
