import PageHero from '@/components/music/PageHero';

/** Shared layout for the Privacy Policy and Terms pages. */
export default function LegalPage({ title, updated, children }) {
  return (
    <>
      <PageHero label="The fine print" title={title} intro={`Last updated: ${updated}`} seed={5} />
      <section className="px-5 md:px-10 pt-6 pb-10">
        <article className="max-w-3xl mx-auto space-y-10 text-[1.05rem] text-ink/80 leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:underline [&_a]:decoration-lime [&_a]:decoration-2 [&_a]:underline-offset-4 [&_strong]:text-ink">
          {children}
        </article>
      </section>
    </>
  );
}
