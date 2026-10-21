import { cookies } from 'next/headers';
import { Gamepad2, Mic, BookOpen, Disc3, PlaySquare, Trophy, LogOut, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ArcadeRegisterButton from '@/components/games/ArcadeRegisterButton';
import { GAME_SESSION_COOKIE } from '@/lib/games/session';
import { getCurrentPlayer } from '@/lib/games/guard';
import PageHero from '@/components/music/PageHero';
import PillLink from '@/components/music/PillLink';
import Equalizer from '@/components/music/Equalizer';
import Reveal from '@/components/music/Reveal';

export const metadata = {
  title: 'Music Arcade | RST Style Studio LK',
  description: 'Play music games, test your knowledge, and climb the monthly leaderboard for studio prizes.',
};

const GAMES = [
  { title: 'SL Music IQ', description: 'Fast trivia on the history of Sri Lankan music: classic hits, modern artists and studio moments.', tags: ['Knowledge', 'Timed'], Icon: Gamepad2, href: '/games/trivia' },
  { title: 'Pitch Match', description: 'Hear a note and sing it back. The engine checks your pitch live, or use the slider without a mic.', tags: ['Vocal', 'Microphone'], Icon: Mic, href: '/games/pitch-match' },
  { title: 'Name That Tune', description: 'A few seconds of a track. Four titles. How fast can you name it?', tags: ['Listening', 'Speed'], Icon: Disc3, href: '/games/name-that-tune' },
  { title: 'Theory Master', description: 'Eastern or Western theory: scales, chords, ragas and taals, with audio examples.', tags: ['Theory', 'Ear training'], Icon: BookOpen, href: '/games/theory-master' },
  { title: 'Rhythm Tap', description: 'Notes fall to the beat. Tap the spacebar at the perfect moment across three levels.', tags: ['Rhythm', 'Reflexes'], Icon: PlaySquare, href: '/games/rhythm-tap' },
];

export default async function GamesArcadeHub() {
  const player = await getCurrentPlayer();

  async function signOutOfArcade() {
    'use server';
    const cookieStore = await cookies();
    cookieStore.delete(GAME_SESSION_COOKIE);
  }

  return (
    <>
      <PageHero
        label="Bonus track"
        title={['The Music', 'Arcade.']}
        intro="Five mini-games for music lovers. Each game can be played once a month; top scores win studio prizes."
        seed={107}
      >
        <div className="flex flex-col items-start gap-4">
          {player ? (
            <form action={signOutOfArcade} className="flex flex-col items-start gap-2">
              <p className="text-sm text-smoke">Playing as <strong className="text-ink">{player.username}</strong></p>
              <button type="submit" className="inline-flex items-center gap-2 text-sm font-semibold text-smoke hover:text-ink transition-colors">
                <LogOut className="w-4 h-4" /> Sign out of Arcade
              </button>
            </form>
          ) : (
            <ArcadeRegisterButton />
          )}
          <PillLink href="/games/leaderboards" variant="outline" icon={Trophy}>Leaderboards</PillLink>
        </div>
      </PageHero>

      <section className="px-5 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map(({ title, description, tags, Icon, href }, i) => (
            <Reveal key={href} delay={(i % 3) * 0.08}>
              <Link href={href} className={`group h-full rounded-[2rem] p-8 flex flex-col min-h-[22rem] transition-transform duration-500 hover:-translate-y-1 ${i === 0 ? 'bg-lime text-ink' : 'bg-ink text-paper'}`}>
                <div className="flex items-start justify-between">
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center ${i === 0 ? 'bg-ink text-lime' : 'bg-paper/10 text-lime'}`}>
                    <Icon className="w-6 h-6" />
                  </span>
                  <span className="font-display font-bold opacity-50 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h2 className="display text-4xl mt-10">{title}</h2>
                <p className="mt-4 opacity-70 leading-relaxed flex-1">{description}</p>
                <div className="flex items-center justify-between mt-8">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-current/20 px-3 py-1 text-xs font-semibold">{tag}</span>
                    ))}
                  </div>
                  <span className={`w-11 h-11 rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform ${i === 0 ? 'bg-ink text-lime' : 'bg-lime text-ink'}`}>
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
          <div className="rounded-[2rem] border border-ink/15 p-8 flex flex-col justify-between min-h-[22rem]">
            <Equalizer bars={6} className="h-8" />
            <div>
              <p className="display text-4xl">Monthly prizes.</p>
              <p className="mt-4 text-smoke leading-relaxed">Top players each month win studio discounts and free sessions. Winners are confirmed by the studio and contacted by email.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
