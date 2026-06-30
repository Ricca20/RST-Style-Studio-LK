import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/utils/t';
import SongsClient from '@/components/public/SongsClient';
import Scroll3DWrapper from '@/components/ui/Scroll3DWrapper';

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
    <div className="min-h-screen bg-transparent pt-24">


      {/* Empty Hero Section for Video Background Focus */}
      <section className="relative w-full h-[70vh] min-h-[500px] pointer-events-none">
        {/* Intentionally left empty so users can focus on the video */}
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 pb-32">
        <Scroll3DWrapper intensity={0.5}>
          <SongsClient initialSongs={songs} genres={genres} locale={locale} />
        </Scroll3DWrapper>
      </main>
    </div>
  );
}
