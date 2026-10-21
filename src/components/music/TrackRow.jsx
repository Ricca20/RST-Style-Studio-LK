import { Play } from 'lucide-react';
import { Link } from '@/i18n/routing';

/**
 * One row of a tracklist: number, big title, supporting line and an end slot.
 * Inverts to ink on hover. Renders as a link when `href` is given.
 */
export default function TrackRow({ number, title, subtitle, end, href, external = false }) {
  const body = (
    <>
      <span className="font-display font-bold text-smoke group-hover:text-lime tabular-nums text-lg w-8 shrink-0">
        {String(number).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block display text-2xl md:text-4xl leading-none truncate">{title}</span>
        {subtitle && <span className="block mt-2 text-sm text-smoke group-hover:text-paper/60 truncate">{subtitle}</span>}
      </span>
      <span className="flex items-center gap-4 shrink-0 text-sm font-semibold">
        {end}
        <span className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center group-hover:bg-lime group-hover:text-ink group-hover:border-lime transition-colors">
          <Play className="w-4 h-4 fill-current" />
        </span>
      </span>
    </>
  );
  const classes = 'group flex items-center gap-4 md:gap-8 py-5 px-4 -mx-4 rounded-2xl border-b border-ink/10 hover:bg-ink hover:text-paper hover:border-transparent transition-colors';

  if (!href) return <div className={classes}>{body}</div>;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{body}</a>
  ) : (
    <Link href={href} className={classes}>{body}</Link>
  );
}
