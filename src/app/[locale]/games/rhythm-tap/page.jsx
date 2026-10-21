import RhythmTapGame from '@/components/games/RhythmTapGame';
import GameCabinet from '@/components/games/GameCabinet';

export const metadata = {
  title: 'Rhythm Tap - Arcade | RST Style Studio LK',
  description: 'Test your musical timing and reflexes.',
};

export default function RhythmTapPage() {
  return (
    <GameCabinet track="05" title="Rhythm Tap" intro="Keep the beat: hit each note as it crosses the target zone.">
      <RhythmTapGame />
    </GameCabinet>
  );
}
