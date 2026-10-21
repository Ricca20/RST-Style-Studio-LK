import prisma from '@/lib/db';
import { routing } from '@/i18n/routing';

// Rebuild hourly so new songs and profiles appear without a redeploy
export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rststylestudio.lk';

// localePrefix is 'as-needed', so the default locale (Sinhala) has no prefix.
const localizedUrl = (locale, path) =>
  `${baseUrl}${locale === routing.defaultLocale ? '' : `/${locale}`}${path}`;

const STATIC_PATHS = [
  '',
  '/about',
  '/contact',
  '/songs',
  '/projects',
  '/contributors',
  '/services',
  '/quote',
  '/media',
  '/games',
  '/games/leaderboards',
  '/games/trivia',
  '/games/rhythm-tap',
  '/games/pitch-match',
  '/games/name-that-tune',
  '/games/theory-master',
  '/privacy',
  '/terms',
];

export default async function sitemap() {
  const entries = (path, extra) => routing.locales.map((locale) => ({ url: localizedUrl(locale, path), ...extra }));

  const routes = STATIC_PATHS.flatMap((path) =>
    entries(path, { lastModified: new Date(), changeFrequency: 'weekly', priority: path === '' ? 1 : 0.8 })
  );

  let songs = [];
  let profiles = [];
  try {
    [songs, profiles] = await Promise.all([
      prisma.song.findMany({
        where: { isDraft: false, deletedAt: null },
        select: { slug: true, projectType: true, updatedAt: true },
      }),
      prisma.profile.findMany({
        where: { isActive: true, isApproved: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch (error) {
    console.error('Sitemap: failed to load dynamic routes', error);
  }

  // Songs live under /songs; every other project type under /projects
  const songRoutes = songs.flatMap((song) =>
    entries(`/${song.projectType === 'SONG' ? 'songs' : 'projects'}/${song.slug}`, {
      lastModified: song.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  );

  const profileRoutes = profiles.flatMap((profile) =>
    entries(`/contributors/${profile.slug}`, { lastModified: profile.updatedAt, changeFrequency: 'monthly', priority: 0.7 })
  );

  return [...routes, ...songRoutes, ...profileRoutes];
}
