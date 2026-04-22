import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchPagePosts } from '@/lib/facebook';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await fetchPagePosts();
    
    const cache = await prisma.socialCache.upsert({
      where: { platform: 'FACEBOOK' },
      update: {
        data: posts,
        lastSync: new Date()
      },
      create: {
        platform: 'FACEBOOK',
        data: posts
      }
    });

    return NextResponse.json({ success: true, cache });
  } catch (error) {
    console.error('Facebook sync failed:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
