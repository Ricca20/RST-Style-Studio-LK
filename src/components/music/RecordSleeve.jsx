import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Vinyl from './Vinyl';
import Equalizer from './Equalizer';

/**
 * A release shown as a record sleeve. On hover the vinyl slides out of the sleeve
 * and starts turning. Without cover art, a typographic sleeve is generated.
 */
export default function RecordSleeve({ href, title, cover, meta, tags = [], index = 0 }) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-square">
        <div className="absolute inset-[5%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[30%]">
          <div className="w-full h-full sleeve-vinyl">
            <Vinyl image={cover} label="RST" sizes="200px" />
          </div>
        </div>

        <div className="relative z-10 h-full rounded-[1.4rem] overflow-hidden bg-ink shadow-[0_25px_60px_-30px_rgba(21,23,15,0.8)] transition-transform duration-500 group-hover:-translate-x-[3%]">
          {cover ? (
            <Image src={cover} alt={title} fill sizes="(max-width: 768px) 90vw, 30vw" className="object-cover" />
          ) : (
            <div className={`h-full flex flex-col justify-between p-6 ${index % 2 ? 'bg-lime text-ink' : 'bg-ink text-paper'}`}>
              <Equalizer bars={5} className="h-6" />
              <span className="display text-3xl md:text-4xl break-words">{title}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="display text-2xl md:text-3xl leading-none truncate">{title}</h3>
          {meta && <p className="mt-2 text-sm text-smoke">{meta}</p>}
        </div>
        {tags.length > 0 && (
          <span className="eyebrow shrink-0 rounded-full border border-ink/15 px-2.5 py-1 text-[0.62rem]">{tags[0]}</span>
        )}
      </div>
    </Link>
  );
}
