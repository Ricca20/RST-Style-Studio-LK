'use client';

import { useState } from 'react';
import { LogIn } from 'lucide-react';
import GameRegistrationModal from './GameRegistrationModal';

/** Entry point for new players on the arcade hub. */
export default function ArcadeRegisterButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0ea5e9] to-rst-accent rounded-full text-white font-bold transition-transform hover:scale-105"
      >
        <LogIn className="w-5 h-5" />
        Register to Play
      </button>
      <GameRegistrationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
