import { NextResponse } from 'next/server';
import { z } from 'zod';
import { guardPlay } from '@/lib/games/guard';
import { createRoundToken } from '@/lib/games/rounds';
import { getClientIp } from '@/lib/rate-limit';

// Starts a round for the games scored in the browser. Trivia, Theory and Name
// That Tune get their round token from their question endpoints instead.
const startSchema = z.object({ gameType: z.enum(['PITCH_MATCH', 'RHYTHM_TAP']) });

export async function POST(request) {
  try {
    const { gameType } = startSchema.parse(await request.json());

    const guard = await guardPlay(gameType, { ip: getClientIp(request) });
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    return NextResponse.json({ token: createRoundToken({ playerId: guard.player.id, gameType }) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error starting game:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}
