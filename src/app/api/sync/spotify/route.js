import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchArtistTopTracks } from '@/lib/spotify';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tracks = await fetchArtistTopTracks();
    
    const cache = await prisma.socialCache.upsert({
      where: { platform: 'SPOTIFY' },
      update: {
        data: tracks,
        lastSync: new Date()
      },
      create: {
        platform: 'SPOTIFY',
        data: tracks
      }
    });

    return NextResponse.json({ success: true, cache });
  } catch (error) {
    console.error('Spotify sync failed:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
