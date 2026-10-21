// Animated equalizer bars. Pure CSS (see .eq-bar in globals.css), so it works in
// server components and pauses for reduced-motion / the animations setting.
const DURATIONS = [0.9, 1.2, 0.75, 1.05, 0.85, 1.3, 0.95];

export default function Equalizer({ bars = 4, className = 'h-4', barClassName = 'bg-current', playing = true }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-end gap-[2px] ${className}`}>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={`block w-[3px] h-full rounded-full ${barClassName} ${playing ? 'eq-bar' : ''}`}
          style={playing
            ? { animationDuration: `${DURATIONS[i % DURATIONS.length]}s`, animationDelay: `${-i * 0.17}s` }
            : { transform: `scaleY(${0.35 + (i % 3) * 0.25})`, transformOrigin: 'bottom' }}
        />
      ))}
    </span>
  );
}
