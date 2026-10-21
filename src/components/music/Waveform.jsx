// Decorative audio waveform. Bar heights come from a seeded generator so the
// shape is stable between server and client renders.
function heights(seed, count) {
  let x = seed;
  return Array.from({ length: count }, (_, i) => {
    x = (x * 9301 + 49297) % 233280;
    const noise = x / 233280;
    const envelope = 0.55 + 0.45 * Math.sin((i / count) * Math.PI); // louder in the middle
    return Math.max(0.12, noise * envelope);
  });
}

export default function Waveform({ seed = 7, bars = 72, progress = 0, className = 'h-10 w-full', playedClassName = 'fill-lime' }) {
  const values = heights(seed, bars);
  const played = Math.round(bars * progress);
  return (
    <svg viewBox={`0 0 ${bars * 4} 40`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {values.map((h, i) => (
        <rect
          key={i}
          x={i * 4}
          y={20 - h * 19}
          width="2.4"
          height={h * 38}
          rx="1.2"
          className={i < played ? playedClassName : 'fill-current'}
        />
      ))}
    </svg>
  );
}
