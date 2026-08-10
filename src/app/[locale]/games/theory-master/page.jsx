import TheoryMasterGame from '@/components/games/TheoryMasterGame';

export const metadata = {
  title: 'Theory Master - Arcade',
  description: 'Test your musical theory knowledge in both Eastern and Western tracks.',
};

export default function TheoryMasterPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Arcade Challenge</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-white">
            Theory <span className="accent">Master</span>
          </h1>
          <p className="text-white/60">
            Choose your musical discipline and prove your knowledge.
          </p>
        </div>
        
        <TheoryMasterGame />
      </div>
    </div>
  );
}
