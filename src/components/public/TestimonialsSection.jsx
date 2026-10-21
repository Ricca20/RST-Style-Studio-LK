import Image from 'next/image';
import { Star } from 'lucide-react';
import prisma from '@/lib/db';
import SectionLabel from '@/components/music/SectionLabel';
import Reveal from '@/components/music/Reveal';

/** Published client reviews, styled as liner-note quotes. Renders nothing when there are none. */
export default async function TestimonialsSection() {
  let testimonials = [];
  try {
    testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
    });
  } catch (error) {
    console.error('Failed to load testimonials:', error);
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="px-5 md:px-10 pt-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionLabel>Reviews</SectionLabel>
          <h2 className="display text-[clamp(3rem,7vw,6rem)] mt-5 mb-14">What artists say.</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.08}>
              <figure className={`h-full rounded-[2rem] p-8 flex flex-col ${i % 3 === 1 ? 'bg-ink text-paper' : 'bg-paper-2'}`}>
                <span className="display text-7xl leading-none text-lime [-webkit-text-stroke:1px_currentColor]" aria-hidden="true">“</span>
                {t.rating && (
                  <div className="flex gap-1 mt-2" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'fill-current' : 'opacity-25'}`} />
                    ))}
                  </div>
                )}
                <blockquote className="mt-4 text-lg leading-relaxed flex-1">{t.quote}</blockquote>
                <figcaption className="flex items-center gap-3 mt-8">
                  {t.imageUrl ? (
                    <Image src={t.imageUrl} alt={t.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <span className="w-11 h-11 rounded-full bg-lime text-ink flex items-center justify-center font-display font-bold">{t.name.charAt(0)}</span>
                  )}
                  <span>
                    <span className="block font-bold">{t.name}</span>
                    {t.role && <span className="block text-xs opacity-60">{t.role}</span>}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
