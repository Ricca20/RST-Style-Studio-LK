import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/utils/t';
import SongsClient from '@/components/public/SongsClient';

export default async function SongsPage({ params }) {
  const { locale } = await params;

  let songs = [];
  try {
    songs = await prisma.song.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { contributions: { include: { profile: true } } },
    });
  } catch (e) {
    console.error("Failed fetching songs:", e);
  }

  // Extract unique genres for filter pills
  const genres = [...new Set(songs.flatMap((s) => s.genres || []))].filter(Boolean);

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-32 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-[#9d2bee]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-10 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
              Master Tape Library
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase">
              STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-white to-[#9d2bee]">CATALOG</span>
            </h1>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-light">
            Explore our complete discography of audio masters, music videos, and commercial scores engineered at RST Style Studio.
          </p>
        </div>
      </section>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 pt-8">
        <SongsClient initialSongs={songs} genres={genres} locale={locale} />
      </main>
    </div>
  );
}
