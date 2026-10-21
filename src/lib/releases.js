import prisma from '@/lib/db';
import { t } from '@/lib/utils/t';

// Songs live under /songs (projectType SONG); everything else under /projects.
export const KINDS = {
  songs: { where: { projectType: 'SONG' }, path: '/songs' },
  projects: { where: { projectType: { not: 'SONG' } }, path: '/projects' },
};

const PUBLISHED = { deletedAt: null, isDraft: false };

/** A published release of the given kind, with credits; null if missing, draft or trashed. */
export async function getRelease(kind, slug) {
  const song = await prisma.song.findFirst({
    where: { slug, ...PUBLISHED, ...KINDS[kind].where },
    include: { contributions: { include: { profile: { select: { slug: true, name: true, imageUrl: true } } } } },
  });
  return song;
}

export async function getRelatedReleases(kind, song, take = 3) {
  try {
    return await prisma.song.findMany({
      where: { id: { not: song.id }, ...PUBLISHED, ...KINDS[kind].where },
      take,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getPublishedSlugs(kind) {
  const rows = await prisma.song.findMany({ where: { ...PUBLISHED, ...KINDS[kind].where }, select: { slug: true } });
  return rows.map((r) => ({ slug: r.slug }));
}

export async function releaseMetadata(kind, slug, locale) {
  const song = await prisma.song.findFirst({ where: { slug, ...PUBLISHED, ...KINDS[kind].where } });
  if (!song) return { title: 'Not found | RST Style Studio LK' };

  const title = t(song, 'title', locale);
  const description = song.description || `Listen to ${title} on RST Style Studio LK.`;
  const path = `${KINDS[kind].path}/${slug}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: song.coverImage || '/images/og-default.jpg' }] },
    alternates: {
      canonical: locale === 'si' ? path : `/${locale}${path}`,
      languages: { si: path, en: `/en${path}`, it: `/it${path}` },
    },
  };
}
