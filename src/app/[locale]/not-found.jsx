import Vinyl from '@/components/music/Vinyl';
import PillLink from '@/components/music/PillLink';

export default function LocaleNotFound() {
  return (
    <section className="min-h-[80vh] flex items-center px-5 md:px-10 pt-32 pb-20">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
          <p className="eyebrow text-smoke">Error 404 · Track not found</p>
          <h1 className="display text-[clamp(4rem,13vw,11rem)] mt-4">Skipped<br />a beat.</h1>
          <p className="mt-6 max-w-md text-lg text-smoke">This page isn&apos;t on the record. It may have moved, or the link might be scratched.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <PillLink href="/" variant="ink">Back to the start</PillLink>
            <PillLink href="/songs" variant="outline">Browse songs</PillLink>
          </div>
        </div>
        <div className="w-56 md:w-80 justify-self-center">
          <Vinyl spinning label="404" />
        </div>
      </div>
    </section>
  );
}
