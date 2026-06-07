import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchChannelVideos } from '@/lib/youtube';
import { fetchPagePosts } from '@/lib/facebook';

export async function POST() {
  try {
    const [ytData, fbData] = await Promise.all([
      fetchChannelVideos(),
      fetchPagePosts()
    ]);

    await prisma.$transaction([
      prisma.socialCache.deleteMany({
        where: { platform: { in: ['YOUTUBE', 'FACEBOOK'] } }
      }),
      prisma.socialCache.createMany({
        data: [
          { platform: 'YOUTUBE', data: ytData, lastSync: new Date() },
          { platform: 'FACEBOOK', data: fbData, lastSync: new Date() }
        ]
      })
    ]);

    return NextResponse.json({ message: `Successfully synced ${ytData.length} YT items and ${fbData.length} FB items.` });
  } catch (error) {
    console.error('[SOCIAL_SYNC_ERROR]', error);
    return NextResponse.json({ error: 'Internal sync failure.', details: error.message }, { status: 500 });
  }
}
  
