import PitchMatchGame from '@/components/games/PitchMatchGame';

export const metadata = {
  title: 'Pitch Match - Arcade',
  description: 'Test your vocal pitch accuracy in this interactive music game.',
};

export default function PitchMatchPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Arcade Challenge</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-white">
            Pitch <span className="accent">Match</span>
          </h1>
          <p className="text-white/60">
            Listen to the note. Sing it back. Match the frequency perfectly to score points.
          </p>
        </div>
        
        <PitchMatchGame />
      </div>
    </div>
  );
}
