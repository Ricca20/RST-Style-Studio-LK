import Image from 'next/image';
import { Award } from 'lucide-react';
import prisma from '@/lib/db';
import SectionLabel from '@/components/music/SectionLabel';
import Reveal from '@/components/music/Reveal';

/** Awards and recognitions managed under Admin → Honorary Mentions. Hidden when empty. */
export default async function HonoraryMentionsSection() {
  let mentions = [];
  try {
    mentions = await prisma.honoraryMention.findMany({
      where: { deletedAt: null },
      orderBy: { awardedAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to load honorary mentions:', error);
  }

  if (mentions.length === 0) return null;

  return (
    <section className="px-5 md:px-10 pt-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionLabel>Hall of fame</SectionLabel>
          <h2 className="display text-[clamp(3rem,7vw,6rem)] mt-5 mb-14">Gold records.</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentions.map((m, i) => (
            <Reveal key={m.id} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-[2rem] bg-paper-2 p-7 flex gap-5">
                {m.imageUrl ? (
                  <Image src={m.imageUrl} alt={m.name} width={72} height={72} className="w-18 h-18 rounded-2xl object-cover shrink-0" />
                ) : (
                  <span className="w-16 h-16 rounded-2xl bg-ink text-lime flex items-center justify-center shrink-0">
                    <Award className="w-7 h-7" />
                  </span>
                )}
                <div className="min-w-0">
                  {m.awardedAt && <p className="eyebrow text-smoke">{new Date(m.awardedAt).getFullYear()}</p>}
                  <h3 className="font-display font-bold text-xl mt-1">{m.name}</h3>
                  {m.title && <p className="text-sm font-semibold mt-1">{m.title}</p>}
                  {m.description && <p className="text-sm text-smoke mt-3">{m.description}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
