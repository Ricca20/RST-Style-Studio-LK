import prisma from '@/lib/db';
import { fetchChannelVideos, isYouTubeConfigured } from '@/lib/services/youtube';
import { fetchPagePosts, isFacebookConfigured } from '@/lib/services/facebook';
import { fetchArtistTopTracks, isSpotifyConfigured } from '@/lib/services/spotify';

export const PLATFORMS = {
  YOUTUBE: { label: 'YouTube', isConfigured: isYouTubeConfigured, fetch: fetchChannelVideos },
  FACEBOOK: { label: 'Facebook', isConfigured: isFacebookConfigured, fetch: fetchPagePosts },
  SPOTIFY: { label: 'Spotify', isConfigured: isSpotifyConfigured, fetch: fetchArtistTopTracks },
};

/**
 * Fetches one platform and stores the result in SocialCache. The cache is only
 * written after a successful fetch, so API failures keep the last good data.
 * @returns {{ platform, status: 'synced'|'not_configured'|'failed', count?, error? }}
 */
export async function syncPlatform(platform) {
  const config = PLATFORMS[platform];
  if (!config) throw new Error(`Unknown platform: ${platform}`);

  if (!config.isConfigured()) {
    return { platform, status: 'not_configured' };
  }

  try {
    const items = await config.fetch();
    await prisma.socialCache.upsert({
      where: { platform },
      update: { data: items, lastSync: new Date() },
      create: { platform, data: items },
    });
    return { platform, status: 'synced', count: items.length };
  } catch (error) {
    console.error(`${config.label} sync failed:`, error);
    return { platform, status: 'failed', error: error.message };
  }
}

/** Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Rejects everything if the secret is unset. */
export function isAuthorizedCronRequest(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}
