import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/t';
import SongsClient from '@/components/public/SongsClient';

export default async function SongsPage({ params }) {
  const { locale } = await params;

  let songs = [];
  try {
    songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' },
      include: { contributions: { include: { contributor: true } } },
    });
  } catch (e) {}

  // Extract unique genres for filter pills
  const genres = [...new Set(songs.flatMap((s) => s.genres || []))].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0f0b12] pt-24">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#9d2bee] animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-widest text-white/90">
              Available for mixing
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight mb-6">
            AUDIO THAT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d2bee] to-purple-300">
              RESONATES
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto font-light">
            Award-winning production, mixing, and mastering for the modern artist.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 pb-32">
        <SongsClient initialSongs={songs} genres={genres} locale={locale} />
      </main>
    </div>
  );
}
