import PitchMatchGame from '@/components/games/PitchMatchGame';
import GameCabinet from '@/components/games/GameCabinet';

export const metadata = {
  title: 'Pitch Match - Arcade | RST Style Studio LK',
  description: 'Test your vocal pitch accuracy in this interactive music game.',
};

export default function PitchMatchPage() {
  return (
    <GameCabinet track="02" title="Pitch Match" intro="Listen to the note, sing it back and match the frequency to score.">
      <PitchMatchGame />
    </GameCabinet>
  );
}
