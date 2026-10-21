import SectionLabel from './SectionLabel';
import Waveform from './Waveform';

/**
 * Standard header for inner pages: label, a huge multi-line title, intro copy,
 * an optional visual on the right, and a waveform rule underneath.
 */
export default function PageHero({ label, side, title, intro, children, seed = 11 }) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <section className="relative pt-36 md:pt-44 px-5 md:px-10 grain">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-4xl">
            {label && <SectionLabel side={side}>{label}</SectionLabel>}
            <h1 className="display text-[clamp(3.25rem,10vw,8.5rem)] mt-6">
              {lines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
            {intro && <p className="mt-8 max-w-xl text-lg text-smoke leading-relaxed">{intro}</p>}
          </div>
          {children && <div className="lg:w-[34%] shrink-0">{children}</div>}
        </div>
        <Waveform seed={seed} className="h-12 w-full mt-14 text-ink/15" />
      </div>
    </section>
  );
}
