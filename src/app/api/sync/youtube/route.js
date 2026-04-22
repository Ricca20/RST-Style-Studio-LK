import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchChannelVideos } from '@/lib/youtube';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const videos = await fetchChannelVideos();
    
    const cache = await prisma.socialCache.upsert({
      where: { platform: 'YOUTUBE' },
      update: {
        data: videos,
        lastSync: new Date()
      },
      create: {
        platform: 'YOUTUBE',
        data: videos
      }
    });

    return NextResponse.json({ success: true, cache });
  } catch (error) {
    console.error('YouTube sync failed:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
