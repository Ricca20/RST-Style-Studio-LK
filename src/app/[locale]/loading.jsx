import Equalizer from '@/components/music/Equalizer';

export default function LocaleLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 pt-24" role="status" aria-label="Loading">
      <Equalizer bars={7} className="h-12 text-ink" />
      <p className="eyebrow text-smoke">Cueing up…</p>
    </div>
  );
}
