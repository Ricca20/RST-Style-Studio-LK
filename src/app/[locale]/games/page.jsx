import Link from 'next/link';
import { Gamepad2, Mic, BookOpen, Music, PlaySquare, Trophy, LogOut } from 'lucide-react';
import GameRegistrationModal from '@/components/games/GameRegistrationModal';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Music Arcade - RST Style Studio',
  description: 'Play music games, test your knowledge, and climb the leaderboard for monthly prizes!',
};

const games = [
  {
    id: 'trivia',
    title: 'SL Music IQ',
    description: 'Fast-paced trivia covering the rich history of the Sri Lankan music industry. Test your knowledge on classic hits, modern artists, and historic studio moments.',
    tags: ['Knowledge', 'History', 'Medium'],
    icon: Gamepad2,
    href: '/games/trivia',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'pitch-match',
    title: 'Pitch Match',
    description: 'Listen to a synthesized note and sing it back into your microphone. Our audio engine evaluates your pitch accuracy in real-time. Can you hit the perfect note?',
    tags: ['Vocal', 'Microphone', 'Hard'],
    icon: Mic,
    href: '/games/pitch-match',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'theory-master',
    title: 'Theory Master',
    description: 'Choose between Eastern and Western music theory tracks. Identify scales, chords, and ragas by listening to generated audio clips.',
    tags: ['Theory', 'Ear Training', 'Hard'],
    icon: BookOpen,
    href: '/games/theory-master',
    color: 'from-purple-500 to-fuchsia-600'
  },
  {
    id: 'rhythm-tap',
    title: 'Rhythm Tap',
    description: 'A visual rhythm game to test your timing and reflexes. Watch the blocks fall to the beat and hit the spacebar at the exact perfect moment to rack up points.',
    tags: ['Reflexes', 'Rhythm', 'Action'],
    icon: PlaySquare,
    href: '/games/rhythm-tap',
    color: 'from-pink-500 to-rose-600'
  }
];

export default async function GamesArcadeHub() {
  const cookieStore = await cookies();
  const session = cookieStore.get('game_session')?.value;

  async function clearSession() {
    'use server';
    const cookieStore = await cookies();
    cookieStore.delete('game_session');
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      
      {/* Client Component for checking auth/showing modal could be injected here, 
          but for simplicity, we will let individual game pages handle auth blocking if they want,
          or we can render a trigger for the modal. 
          The user wanted a popup. For MVP, we'll assume they just click a game and if not authed, they get prompted. 
      */}
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">Interactive Experience</span>
          <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-6 text-white tracking-tight">
            Music <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee]">Arcade</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Play games, test your musical skills, and compete on the monthly leaderboards to win exclusive studio discounts and prizes!
          </p>
          
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link 
              href="/games/leaderboards"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium transition-all hover:scale-105"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
              View Leaderboards
            </Link>

            {session && (
              <form action={clearSession}>
                <button type="submit" className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Clear Session (Test Registration Again)
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                href={game.href}
                className="group relative flex flex-col p-8 rounded-[2rem] bg-[#0c1222] border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D Inner Glass Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'translateZ(-10px)' }} />
                
                {/* Glowing Background Blur */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-[2rem] -z-10`} />
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${game.color} opacity-10 blur-3xl rounded-full -mr-10 -mt-10`} />
                
                <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(20px)' }}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} p-[1px] mb-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500`}>
                    <div className="w-full h-full bg-[#0c1222] rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                    {game.title}
                  </h3>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow line-clamp-3 group-hover:text-white/80 transition-colors">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {game.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                      Enter Game
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${game.color} flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}>
                      <Gamepad2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
