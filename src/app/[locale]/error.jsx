'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import PillLink from '@/components/music/PillLink';
import Waveform from '@/components/music/Waveform';

export default function LocaleError({ error, reset }) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <section className="min-h-[80vh] flex items-center px-5 md:px-10 pt-32 pb-20">
      <div className="max-w-3xl mx-auto w-full">
        <p className="eyebrow text-smoke">Signal lost</p>
        <h1 className="display text-[clamp(3.5rem,10vw,8rem)] mt-4">The record<br />skipped.</h1>
        <p className="mt-6 max-w-md text-lg text-smoke">Something went wrong while loading this page. Give it another spin.</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-3.5 text-sm font-bold hover:bg-ink-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <PillLink href="/" variant="outline">Go home</PillLink>
        </div>
        <Waveform seed={3} className="h-12 w-full mt-14 text-ink/15" />
      </div>
    </section>
  );
}
