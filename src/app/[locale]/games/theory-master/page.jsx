import TheoryMasterGame from '@/components/games/TheoryMasterGame';
import GameCabinet from '@/components/games/GameCabinet';

export const metadata = {
  title: 'Theory Master - Arcade | RST Style Studio LK',
  description: 'Test your musical theory knowledge in both Eastern and Western tracks.',
};

export default function TheoryMasterPage() {
  return (
    <GameCabinet track="04" title="Theory Master" intro="Choose Eastern or Western theory and prove what you know.">
      <TheoryMasterGame />
    </GameCabinet>
  );
}
