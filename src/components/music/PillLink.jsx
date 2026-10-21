import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

const VARIANTS = {
  ink: { pill: 'bg-ink text-paper hover:bg-ink-2', knob: 'bg-lime text-ink' },
  lime: { pill: 'bg-lime text-ink hover:brightness-95', knob: 'bg-ink text-lime' },
  outline: { pill: 'border border-ink/20 text-ink hover:bg-ink hover:text-paper', knob: 'bg-ink text-paper group-hover:bg-lime group-hover:text-ink' },
  light: { pill: 'border border-paper/25 text-paper hover:bg-paper hover:text-ink', knob: 'bg-paper text-ink group-hover:bg-lime' },
};

/**
 * Rounded call-to-action with a circular arrow "knob" that turns on hover.
 * Internal hrefs use the locale-aware Link; pass `external` for other sites.
 */
export default function PillLink({ href, children, variant = 'ink', external = false, className = '', icon: Icon = ArrowRight }) {
  const v = VARIANTS[variant] || VARIANTS.ink;
  const classes = `group inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 font-bold text-sm transition-colors ${v.pill} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <span className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:-rotate-45 ${v.knob}`}>
        <Icon className="w-4 h-4" />
      </span>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{content}</a>
  ) : (
    <Link href={href} className={classes}>{content}</Link>
  );
}
