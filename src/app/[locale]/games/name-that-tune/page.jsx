import NameThatTuneGame from '@/components/games/NameThatTuneGame';

export const metadata = {
  title: 'Name That Tune - Arcade',
  description: 'Listen to short clips and guess the song!',
};

export default function NameThatTunePage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Arcade Challenge</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-white">
            Name That <span className="accent">Tune</span>
          </h1>
          <p className="text-white/60">
            Listen to a few seconds of a track and select the correct title.
          </p>
        </div>
        
        <NameThatTuneGame />
      </div>
    </div>
  );
}
