/**
 * Fades and lifts its children in as they scroll into view.
 * Pure CSS (scroll-driven animation, see .reveal in globals.css): content is
 * always rendered visible and only animates in browsers that support it, so
 * nothing is hidden while JavaScript loads. `delay` staggers items in a row.
 */
export default function Reveal({ children, delay = 0, className = '' }) {
  return (
    <div className={`reveal ${className}`} style={delay ? { '--reveal-offset': `${Math.round(delay * 100)}%` } : undefined}>
      {children}
    </div>
  );
}
