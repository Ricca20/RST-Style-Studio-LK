'use client';

import { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Home page intro video. With StudioSettings.autoPlayMusic on, it tries to start
 * with sound; browsers usually block that until the visitor interacts, so it
 * falls back to muted and shows a sound toggle.
 */
export default function HeroVideo({ autoPlayWithSound = false }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playMuted = () => {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay blocked entirely — the poster shows as a fallback
      });
    };

    if (autoPlayWithSound) {
      video.muted = false;
      video.play()
        .then(() => setIsMuted(false))
        .catch(playMuted);
    } else {
      playMuted();
    }
  }, [autoPlayWithSound]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) video.play().catch(() => {});
    setIsMuted(video.muted);
  };

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-contain md:object-cover"
        poster="/logo.png"
        src="/herovideo.mp4"
      />
      {autoPlayWithSound && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
          className="pointer-events-auto absolute bottom-28 right-6 z-30 w-12 h-12 rounded-full bg-black/50 border border-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}
    </>
  );
}
