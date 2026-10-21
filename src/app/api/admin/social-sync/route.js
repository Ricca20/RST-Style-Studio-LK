import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logAuditAction, requireRole } from '@/lib/auth/server-auth';
import { PLATFORMS, syncPlatform } from '@/lib/services/socialSync';

// Status of each platform: whether its API keys are set and what is cached.
export async function GET() {
  const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const caches = await prisma.socialCache.findMany();
  const status = Object.entries(PLATFORMS).map(([platform, config]) => {
    const cache = caches.find((c) => c.platform === platform);
    return {
      platform,
      label: config.label,
      configured: config.isConfigured(),
      lastSync: cache?.lastSync || null,
      itemCount: Array.isArray(cache?.data) ? cache.data.length : 0,
    };
  });

  return NextResponse.json(status);
}

// Manual "Sync now" from the admin dashboard. Body: { platform?: 'YOUTUBE' | 'FACEBOOK' | 'SPOTIFY' }
export async function POST(request) {
  const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json().catch(() => ({}));
  const platforms = body.platform ? [body.platform] : Object.keys(PLATFORMS);
  if (platforms.some((p) => !PLATFORMS[p])) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
  }

  const results = [];
  for (const platform of platforms) {
    results.push(await syncPlatform(platform));
  }

  await logAuditAction(auth.user.dbUser.id, 'SOCIAL_SYNC', 'SocialCache', platforms.join(','), { results }, request);
  return NextResponse.json(results);
}
