'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play } from 'lucide-react';
import { GameError, GameFinished, GameLoading, gameFetch } from './GameStatus';

const TARGET_PITCHES = [
  { name: 'C4', freq: 261.63 },
  { name: 'E4', freq: 329.63 },
  { name: 'G4', freq: 392.00 },
  { name: 'A4', freq: 440.00 },
  { name: 'C5', freq: 523.25 }
];
const NEXT_ROUND_DELAY_MS = 1500; // the server's minimum game duration assumes this pause

// Simple autocorrelation pitch detection. Returns Hz, or -1 if there's no clear tone.
function autoCorrelate(buffer, sampleRate) {
  const size = buffer.length;
  const maxSamples = Math.floor(size / 2);
  let bestOffset = -1;
  let bestCorr = 0;
  let rms = 0;
  let foundGoodCorrelation = false;
  const correlations = new Array(maxSamples);

  for (let i = 0; i < size; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1; // Not enough signal

  let lastCorrelation = 1;
  for (let offset = 0; offset < maxSamples; offset++) {
    let correlation = 0;
    for (let i = 0; i < maxSamples; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - (correlation / maxSamples);
    correlations[offset] = correlation;

    if (correlation > 0.9 && correlation > lastCorrelation) {
      foundGoodCorrelation = true;
      if (correlation > bestCorr) {
        bestCorr = correlation;
        bestOffset = offset;
      }
    } else if (foundGoodCorrelation) {
      const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
      return sampleRate / (bestOffset + (8 * shift));
    }
    lastCorrelation = correlation;
  }
  if (bestCorr > 0.01) return sampleRate / bestOffset;
  return -1;
}

function feedbackFor(freq, target, useMic) {
  if (!freq) return useMic ? 'Sing to match!' : 'Move the slider to match';
  const diff = freq - target;
  if (Math.abs(diff) <= 5) return 'Perfect Match! 🔥';
  if (diff > 5 && diff < 30) return 'A bit too high';
  if (diff < -5 && diff > -30) return 'A bit too low';
  return 'Keep trying!';
}

function scoreFor(freq, target) {
  const diff = Math.abs(freq - target);
  if (diff <= 2) return 100;
  if (diff <= 10) return 80;
  if (diff <= 30) return 50;
  if (diff <= 50) return 20;
  return 0;
}

export default function PitchMatchGame() {
  const [phase, setPhase] = useState('intro'); // intro, starting, playing, submitting, finished, error
  const [useMic, setUseMic] = useState(true);
  const [micNotice, setMicNotice] = useState('');
  const [round, setRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [currentFreq, setCurrentFreq] = useState(0);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState(null);

  // Audio graph and game values read inside animation frames and timeouts
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const oscillatorRef = useRef(null);
  const rafIdRef = useRef(null);
  const currentFreqRef = useRef(0);
  const scoreRef = useRef(0);
  const tokenRef = useRef(null);
  const timeoutsRef = useRef([]);

  const targetFreq = TARGET_PITCHES[round]?.freq ?? 0;

  const stopAudio = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch { /* already stopped */ }
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
    audioCtxRef.current = null;
  };

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
      stopAudio();
    };
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const detectPitch = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);
    const pitch = autoCorrelate(buffer, audioCtxRef.current.sampleRate);
    if (pitch !== -1) {
      currentFreqRef.current = Math.round(pitch);
      setCurrentFreq(currentFreqRef.current);
    }
    rafIdRef.current = requestAnimationFrame(detectPitch);
  };

  // Returns false if the mic is unavailable; the game then uses the slider.
  const startMic = async () => {
    try {
      const ctx = getAudioContext();
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      sourceRef.current = ctx.createMediaStreamSource(streamRef.current);
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 2048;
      sourceRef.current.connect(analyserRef.current);
      rafIdRef.current = requestAnimationFrame(detectPitch);
      return true;
    } catch (err) {
      console.error('Microphone unavailable:', err);
      return false;
    }
  };

  const startGame = async () => {
    setPhase('starting');
    try {
      const { token } = await gameFetch('/api/games/start', {
        method: 'POST',
        body: JSON.stringify({ gameType: 'PITCH_MATCH' }),
      });
      tokenRef.current = token;
    } catch (err) {
      setError(err);
      setPhase('error');
      return;
    }

    if (useMic && !(await startMic())) {
      setUseMic(false);
      setMicNotice('Microphone access was blocked, so the manual slider is enabled.');
    }

    scoreRef.current = 0;
    currentFreqRef.current = 0;
    setTotalScore(0);
    setCurrentFreq(0);
    setRound(0);
    setPhase('playing');
  };

  const playTargetPitch = () => {
    const ctx = getAudioContext();
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch { /* already stopped */ }
      oscillatorRef.current.disconnect();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.0);
    oscillatorRef.current = osc;

    setIsPlayingTarget(true);
    timeoutsRef.current.push(setTimeout(() => setIsPlayingTarget(false), 2000));
  };

  const submitScore = async (finalScore) => {
    setPhase('submitting');
    stopAudio();
    try {
      await gameFetch('/api/games/scores', {
        method: 'POST',
        body: JSON.stringify({ gameType: 'PITCH_MATCH', score: finalScore, token: tokenRef.current }),
      });
      setPhase('finished');
    } catch (err) {
      setError(err);
      setPhase('error');
    }
  };

  const lockInAnswer = () => {
    if (isLocked) return;
    setIsLocked(true);

    scoreRef.current += scoreFor(currentFreqRef.current, targetFreq);
    setTotalScore(scoreRef.current);

    timeoutsRef.current.push(setTimeout(() => {
      setIsLocked(false);
      if (round + 1 >= TARGET_PITCHES.length) {
        submitScore(scoreRef.current);
      } else {
        currentFreqRef.current = 0;
        setCurrentFreq(0);
        setRound(round + 1);
      }
    }, NEXT_ROUND_DELAY_MS));
  };

  if (phase === 'starting') return <GameLoading label="Starting game…" />;
  if (phase === 'submitting') return <GameLoading label="Saving your score…" />;
  if (phase === 'error') return <GameError error={error} />;
  if (phase === 'finished') {
    return <GameFinished title="Well Done!" subtitle="You completed the Pitch Match challenge." score={totalScore} />;
  }

  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl w-full max-w-2xl mx-auto text-center">
        <Mic className="w-16 h-16 text-[#0ea5e9] mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">Pitch Match</h2>
        <p className="text-white/70 mb-8 max-w-md">
          Listen to the target pitch and try to match it using your voice. Don&apos;t have a mic? Use the manual slider instead!
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
          className="px-8 py-4 bg-gradient-to-r from-[#0ea5e9] to-rst-accent hover:scale-105 transition-transform rounded-xl font-bold text-white shadow-lg shadow-[#0ea5e9]/20"
        >
          Start Playing
        </button>
      </div>
    );
  }

  const feedback = feedbackFor(currentFreq, targetFreq, useMic);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {micNotice && <p className="w-full mb-4 text-sm text-amber-300 text-center">{micNotice}</p>}

      <div className="w-full flex justify-between items-center mb-8 bg-white/5 p-4 rounded-xl">
        <div>
          <span className="text-xs text-white/50 uppercase block mb-1">Round</span>
          <span className="text-xl font-bold text-white">{round + 1} / {TARGET_PITCHES.length}</span>
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
        <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-white/30 z-0" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-4xl font-mono font-bold text-white mb-2">
            {currentFreq > 0 ? `${currentFreq} Hz` : '-- Hz'}
          </span>
          <span className={`text-lg font-bold px-4 py-1 rounded-full ${feedback.includes('Perfect') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/70'}`}>
            {feedback}
          </span>
        </div>

        {currentFreq > 0 && (
          <div className="w-full mt-8 h-4 bg-white/10 rounded-full relative overflow-hidden">
            <div
              className="absolute h-full w-2 bg-[#0ea5e9] rounded-full transition-all duration-100 ease-out"
              style={{ left: `${Math.max(0, Math.min(100, 50 + ((currentFreq - targetFreq) / targetFreq) * 100))}%` }}
            />
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
            value={currentFreq || 100}
            onChange={(e) => {
              currentFreqRef.current = parseInt(e.target.value, 10);
              setCurrentFreq(currentFreqRef.current);
            }}
            className="w-full accent-[#0ea5e9]"
          />
        </div>
      )}

      <button
        onClick={lockInAnswer}
        disabled={isLocked}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-bold rounded-xl transition-colors text-lg"
      >
        {isLocked ? 'Locked In!' : 'Lock In Answer'}
      </button>
    </div>
  );
}
