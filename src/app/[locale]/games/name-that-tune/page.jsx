import NameThatTuneGame from '@/components/games/NameThatTuneGame';
import GameCabinet from '@/components/games/GameCabinet';

export const metadata = {
  title: 'Name That Tune - Arcade | RST Style Studio LK',
  description: 'Listen to short clips and guess the song!',
};

export default function NameThatTunePage() {
  return (
    <GameCabinet track="03" title="Name That Tune" intro="Hear a few seconds of a track and pick the right title.">
      <NameThatTuneGame />
    </GameCabinet>
  );
}
