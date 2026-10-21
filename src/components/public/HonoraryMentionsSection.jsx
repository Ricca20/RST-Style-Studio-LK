import Image from 'next/image';
import { Award } from 'lucide-react';
import prisma from '@/lib/db';

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
    <section className="py-24 px-4 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="section-label">Recognition</span>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mt-2">
          Honorary <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">Mentions</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentions.map((m) => (
          <div key={m.id} className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex gap-4">
            {m.imageUrl ? (
              <Image src={m.imageUrl} alt={m.name} width={64} height={64} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-amber-400" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white">{m.name}</h3>
              {m.title && <p className="text-sm text-amber-300">{m.title}</p>}
              {m.description && <p className="text-sm text-white/60 mt-2">{m.description}</p>}
              {m.awardedAt && <p className="text-xs text-white/40 mt-2">{new Date(m.awardedAt).getFullYear()}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
