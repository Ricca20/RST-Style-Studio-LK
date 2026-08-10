import TriviaGame from '@/components/games/TriviaGame';

export const metadata = {
  title: 'SL Music IQ - Arcade',
  description: 'Test your knowledge of the Sri Lankan music industry.',
};

export default function TriviaPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Arcade Challenge</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-white">
            SL Music <span className="accent">IQ</span>
          </h1>
          <p className="text-white/60">
            Answer fast. Score big. Climb the leaderboard.
          </p>
        </div>
        
        <TriviaGame />
      </div>
    </div>
  );
}
