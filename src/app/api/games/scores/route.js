import { NextResponse } from 'next/server';
import { z } from 'zod';
import { guardPlay, saveScore } from '@/lib/games/guard';
import { verifyRoundToken } from '@/lib/games/rounds';
import { getClientIp } from '@/lib/rate-limit';

// Only games scored in the browser submit here. Trivia, Theory and Name That Tune
// are scored server-side by their own /submit routes and must not accept a raw score.
//
// maxScore: the highest score each game can produce
//   PITCH_MATCH — 5 target pitches × 100 (PitchMatchGame TARGET_PITCHES)
//   RHYTHM_TAP  — (10 + 15 + 20) beats × 20 for a perfect hit (RhythmTapGame LEVELS)
// minDurationMs: the shortest real time a full game can take
//   PITCH_MATCH — 5 rounds, each with a 1.5s pause after locking in
//   RHYTHM_TAP  — 3 levels of ~10s of beats + 3s fall + 2s pause ≈ 45s
const GAME_RULES = {
  PITCH_MATCH: { maxScore: 500, minDurationMs: 7_000, maxDurationMs: 30 * 60_000 },
  RHYTHM_TAP: { maxScore: 900, minDurationMs: 40_000, maxDurationMs: 10 * 60_000 },
};

const scoreSchema = z.object({
  gameType: z.enum(['PITCH_MATCH', 'RHYTHM_TAP']),
  score: z.number().int().min(0),
  token: z.string(),
}).refine((data) => data.score <= GAME_RULES[data.gameType].maxScore, {
  message: 'Score exceeds the maximum possible for this game',
  path: ['score'],
});

export async function POST(request) {
  try {
    const body = scoreSchema.parse(await request.json());
    const ip = getClientIp(request);

    const guard = await guardPlay(body.gameType, { ip });
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const round = verifyRoundToken(body.token, { playerId: guard.player.id, gameType: body.gameType });
    if (!round) return NextResponse.json({ error: 'Invalid game session. Please start again.' }, { status: 400 });

    const rules = GAME_RULES[body.gameType];
    if (round.elapsedMs < rules.minDurationMs) {
      return NextResponse.json({ error: 'That game finished faster than is possible.' }, { status: 400 });
    }
    if (round.elapsedMs > rules.maxDurationMs) {
      return NextResponse.json({ error: 'This round has expired. Please start again.' }, { status: 400 });
    }

    const saved = await saveScore({ playerId: guard.player.id, gameType: body.gameType, score: body.score, ip });
    if (!saved) return NextResponse.json({ error: 'You have already played this game this month!' }, { status: 403 });

    return NextResponse.json({ success: true, score: body.score }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error submitting score:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
