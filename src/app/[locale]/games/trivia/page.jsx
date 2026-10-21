import TriviaGame from '@/components/games/TriviaGame';
import GameCabinet from '@/components/games/GameCabinet';

export const metadata = {
  title: 'SL Music IQ - Arcade | RST Style Studio LK',
  description: 'Test your knowledge of the Sri Lankan music industry.',
};

export default function TriviaPage() {
  return (
    <GameCabinet track="01" title="SL Music IQ" intro="Answer fast, score big and climb the leaderboard.">
      <TriviaGame />
    </GameCabinet>
  );
}
