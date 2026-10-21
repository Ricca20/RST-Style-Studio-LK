import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import prisma from '@/lib/db';

/** Published client reviews. Renders nothing when there are none. */
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
    <section className="relative py-24 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Client Reviews</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            What Artists <span className="accent">Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.id} className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col">
              <Quote className="w-8 h-8 text-rst-accent/60 mb-4" />
              {t.rating && (
                <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                  ))}
                </div>
              )}
              <blockquote className="text-white/80 leading-relaxed flex-1">“{t.quote}”</blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                {t.imageUrl ? (
                  <Image src={t.imageUrl} alt={t.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-rst-accent/20 flex items-center justify-center font-bold text-white">{t.name.charAt(0)}</div>
                )}
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  {t.role && <div className="text-xs text-white/50">{t.role}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
