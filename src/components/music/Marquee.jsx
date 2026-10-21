import { Disc3 } from 'lucide-react';

/**
 * Infinite horizontal ticker. Items are rendered twice and the track moves by
 * half its width, so the loop is seamless. Pauses on hover.
 */
export default function Marquee({ items, duration = 30, className = '', itemClassName = 'display text-4xl md:text-6xl', Separator = Disc3 }) {
  const row = items.map((item, i) => (
    <span key={i} className="flex items-center">
      <span className={`whitespace-nowrap px-6 md:px-10 ${itemClassName}`}>{item}</span>
      <Separator className="w-6 h-6 md:w-8 md:h-8 shrink-0 opacity-70" aria-hidden="true" />
    </span>
  ));

  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max" style={{ '--marquee-duration': `${duration}s` }}>
        <div className="flex shrink-0 items-center">{row}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{row}</div>
      </div>
    </div>
  );
}
