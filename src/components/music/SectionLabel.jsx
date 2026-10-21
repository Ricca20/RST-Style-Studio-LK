import Equalizer from './Equalizer';

/** Small "Side A · Releases" style label shown above section headings. */
export default function SectionLabel({ side, children, tone = 'ink', className = '' }) {
  const toneClasses = tone === 'paper' ? 'border-paper/20 text-paper' : 'border-ink/15 text-ink';
  return (
    <div className={`inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 eyebrow ${toneClasses} ${className}`}>
      <Equalizer bars={3} className="h-3" />
      {side && <span className="hidden sm:inline opacity-60">Side {side}</span>}
      {side && <span className="hidden sm:inline opacity-30">/</span>}
      <span>{children}</span>
    </div>
  );
}
