import prisma from '@/lib/db';

export default async function sitemap() {
  const baseUrl = 'https://rststylestudio.lk';

  // Static Routes
  const staticPaths = [
    '',
    '/about',
    '/contact',
    '/songs',
    '/profiles',
    '/services',
    '/quote'
  ];

  const locales = ['en', 'si', 'it'];
  
  const routes = locales.flatMap(locale => 
    staticPaths.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1 : 0.8,
    }))
  );

  // Dynamic Songs
  const songs = await prisma.song.findMany({
    where: { isDraft: false, deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const songRoutes = locales.flatMap(locale =>
    songs.map((song) => ({
      url: `${baseUrl}/${locale}/songs/${song.slug}`,
      lastModified: song.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    }))
  );

  // Dynamic Profiles
  const profiles = await prisma.profile.findMany({
    where: { isActive: true, deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const profileRoutes = locales.flatMap(locale =>
    profiles.map((profile) => ({
      url: `${baseUrl}/${locale}/profiles/${profile.slug}`,
      lastModified: profile.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  );

  return [...routes, ...songRoutes, ...profileRoutes];
}
