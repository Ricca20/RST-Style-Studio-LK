import RhythmTapGame from '@/components/games/RhythmTapGame';

export const metadata = {
  title: 'Rhythm Tap - Arcade',
  description: 'Test your musical timing and reflexes.',
};

export default function RhythmTapPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Arcade Challenge</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-white">
            Rhythm <span className="accent">Tap</span>
          </h1>
          <p className="text-white/60">
            Keep the beat. Hit the notes exactly as they cross the target zone.
          </p>
        </div>
        
        <RhythmTapGame />
      </div>
    </div>
  );
}
