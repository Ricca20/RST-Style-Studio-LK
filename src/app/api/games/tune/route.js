import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { guardPlay } from '@/lib/games/guard';
import { createRoundToken } from '@/lib/games/rounds';
import { shuffle } from '@/lib/games/shuffle';
import { getClientIp } from '@/lib/rate-limit';

const CLIPS_PER_GAME = 5;

export async function GET(request) {
  try {
    const guard = await guardPlay('NAME_THAT_TUNE', { ip: getClientIp(request) });
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const allClips = await prisma.tuneClip.findMany({
      where: { isActive: true },
      // correctOption is never sent; answers are scored server-side on submit
      select: { id: true, titleEn: true, titleSi: true, titleIt: true, audioUrl: true, options: true }
    });

    if (allClips.length === 0) {
      return NextResponse.json({ error: 'No clips available yet. Please check back soon.' }, { status: 404 });
    }

    const clips = shuffle(allClips).slice(0, CLIPS_PER_GAME).map(c => ({
      ...c,
      options: shuffle(Array.isArray(c.options) ? c.options : [])
    }));

    const token = createRoundToken({ playerId: guard.player.id, gameType: 'NAME_THAT_TUNE', ids: clips.map(c => c.id) });
    return NextResponse.json({ clips, token });
  } catch (error) {
    console.error('Error fetching tunes:', error);
    return NextResponse.json({ error: 'Failed to fetch tune clips' }, { status: 500 });
  }
}
