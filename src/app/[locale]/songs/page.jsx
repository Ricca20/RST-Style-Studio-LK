import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import PageHero from '@/components/music/PageHero';
import CatalogClient from '@/components/public/CatalogClient';

export async function generateMetadata() {
  return {
    title: 'Songs | RST Style Studio LK',
    description: 'Listen to songs written, produced, mixed and mastered at RST Style Studio LK.',
  };
}

export default async function SongsPage({ params }) {
  const { locale } = await params;
  const tSongs = await getTranslations({ locale, namespace: 'Songs' });

  let songs = [];
  try {
    songs = await prisma.song.findMany({
      where: { deletedAt: null, isDraft: false, projectType: 'SONG' },
      orderBy: [{ releaseYear: 'desc' }, { createdAt: 'desc' }],
      include: { contributions: { include: { profile: { select: { slug: true, name: true } } } } },
    });
  } catch (e) {
    console.error('Failed fetching songs:', e);
  }

  return (
    <>
      <PageHero
        side="A"
        label={tSongs('latest')}
        title={['The', 'discography.']}
        intro="Every song written, produced, mixed and mastered at RST Style Studio. Tap a sleeve to listen and see who played on it."
        seed={17}
      />
      <section className="px-5 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <CatalogClient items={songs} locale={locale} filterBy="genre" basePath="/songs" noun="song" />
        </div>
      </section>
    </>
  );
}
