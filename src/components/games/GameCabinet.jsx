import { ArrowLeft, Trophy } from 'lucide-react';
import { Link } from '@/i18n/routing';
import SectionLabel from '@/components/music/SectionLabel';
import Equalizer from '@/components/music/Equalizer';

/** Page frame for each arcade game: title block, then the game in a dark "cabinet". */
export default function GameCabinet({ track, title, intro, children }) {
  return (
    <section className="px-5 md:px-10 pt-32 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <Link href="/games" className="inline-flex items-center gap-2 text-sm font-semibold text-smoke hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> Arcade
          </Link>
          <Link href="/games/leaderboards" className="inline-flex items-center gap-2 text-sm font-semibold text-smoke hover:text-ink transition-colors">
            <Trophy className="w-4 h-4" /> Leaderboards
          </Link>
        </div>
        <div className="mt-8">
          <SectionLabel>Arcade · Track {track}</SectionLabel>
          <h1 className="display text-[clamp(3rem,9vw,7rem)] mt-5">{title}</h1>
          <p className="mt-5 max-w-xl text-lg text-smoke">{intro}</p>
        </div>
        <div className="relative mt-12 rounded-[2rem] bg-ink text-paper p-5 sm:p-8 md:p-12 overflow-hidden">
          <Equalizer bars={24} className="absolute top-0 inset-x-0 h-2 text-lime/30 justify-between px-8" />
          {children}
        </div>
      </div>
    </section>
  );
}
