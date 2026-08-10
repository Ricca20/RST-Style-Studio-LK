import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  try {
    // Fetch random active tune clips
    const allClips = await prisma.tuneClip.findMany({
      where: { isActive: true },
      select: {
        id: true,
        titleEn: true,
        audioUrl: true,
        options: true,
        // DONT send correctOption!
      }
    });

    let selected = [];

    if (allClips.length > 0) {
      // Shuffle and pick 5
      const shuffled = allClips.sort(() => 0.5 - Math.random());
      selected = shuffled.slice(0, 5).map(c => ({
        ...c,
        options: Array.isArray(c.options) ? c.options.sort(() => 0.5 - Math.random()) : []
      }));
    } else {
      // MOCK DATA FALLBACK for MVP testing before admin uploads clips
      selected = [
        {
          id: 'mock1',
          titleEn: 'Guess the classic track',
          // Using a placeholder public domain audio or silence if needed.
          // For safety in this MVP, we use an empty data URI to avoid 404s, 
          // or just assume the frontend handles it gracefully.
          audioUrl: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg', 
          options: [
            { id: 'o1', textEn: 'Song A' },
            { id: 'o2', textEn: 'Song B' },
            { id: 'o3', textEn: 'Song C' },
            { id: 'o4', textEn: 'Song D' }
          ]
        }
      ];
    }

    return NextResponse.json(selected);
  } catch (error) {
    console.error('Error fetching tunes:', error);
    return NextResponse.json({ error: 'Failed to fetch tune clips' }, { status: 500 });
  }
}
