import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { t } from '@/lib/utils/t';
import { getPublishedSlugs, getRelatedReleases, getRelease, releaseMetadata } from '@/lib/releases';
import ReleaseDetail from '@/components/public/ReleaseDetail';

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  return releaseMetadata('songs', slug, locale);
}

export async function generateStaticParams() {
  return getPublishedSlugs('songs');
}

export default async function SongDetailPage({ params }) {
  const { slug, locale } = await params;
  const tSongs = await getTranslations({ locale, namespace: 'Songs' });

  const song = await getRelease('songs', slug);
  if (!song) notFound();
  const related = await getRelatedReleases('songs', song);

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://rststylestudio.lk';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: t(song, 'title', locale),
    url: `${site}/${locale}/songs/${song.slug}`,
    image: song.coverImage || `${site}/images/og-default.jpg`,
    ...(song.genres?.[0] && { genre: song.genres[0] }),
    ...(song.releaseYear && { datePublished: String(song.releaseYear) }),
    byArtist: { '@type': 'MusicGroup', name: 'RST Style Studio LK' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReleaseDetail
        song={song}
        related={related}
        locale={locale}
        basePath="/songs"
        backLabel="All songs"
        labels={{ genre: tSongs('genre'), releaseYear: tSongs('releaseYear') }}
      />
    </>
  );
}
