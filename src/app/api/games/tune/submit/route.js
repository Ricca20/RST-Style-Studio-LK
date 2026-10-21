import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import { guardPlay, saveScore } from '@/lib/games/guard';
import { speedClaimsArePlausible, verifyRoundToken } from '@/lib/games/rounds';
import { uniqueAnswers } from '@/lib/games/scoring';
import { getClientIp } from '@/lib/rate-limit';

const MAX_SECONDS_PER_CLIP = 60;
const BASE_POINTS = 20;

const submitSchema = z.object({
  token: z.string(),
  answers: z.array(z.object({
    clipId: z.string(),
    selectedOptionId: z.string().nullable(),
    timeTakenMs: z.number().min(0).max(MAX_SECONDS_PER_CLIP * 1000)
  })).max(5) // GET /api/games/tune serves 5 clips per game
});

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const guard = await guardPlay('NAME_THAT_TUNE', { ip });
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const body = submitSchema.parse(await request.json());
    const round = verifyRoundToken(body.token, { playerId: guard.player.id, gameType: 'NAME_THAT_TUNE' });
    if (!round) return NextResponse.json({ error: 'Invalid game session. Please start again.' }, { status: 400 });

    const maxRoundMs = round.ids.length * MAX_SECONDS_PER_CLIP * 1000 + 60_000;
    if (round.elapsedMs > maxRoundMs) {
      return NextResponse.json({ error: 'This round has expired. Please start again.' }, { status: 400 });
    }

    // Only clips served in this round count
    const answers = uniqueAnswers(body.answers, 'clipId').filter(a => round.ids.includes(a.clipId));
    const allowSpeedBonus = speedClaimsArePlausible(answers, round.elapsedMs, 5_000 + answers.length * 1_500);

    const dbClips = await prisma.tuneClip.findMany({
      where: { id: { in: answers.map(a => a.clipId) } },
      select: { id: true, correctOption: true }
    });

    let totalScore = 0;
    for (const answer of answers) {
      const dbClip = dbClips.find(c => c.id === answer.clipId);
      if (!dbClip || dbClip.correctOption !== answer.selectedOptionId) continue;

      let points = BASE_POINTS;
      if (allowSpeedBonus) {
        const secondsTaken = answer.timeTakenMs / 1000;
        if (secondsTaken < 3) points += 10;
        else if (secondsTaken < 6) points += 5;
      }
      totalScore += points;
    }

    const saved = await saveScore({ playerId: guard.player.id, gameType: 'NAME_THAT_TUNE', score: totalScore, ip });
    if (!saved) return NextResponse.json({ error: 'You have already played Name That Tune this month!' }, { status: 403 });

    return NextResponse.json({ success: true, score: totalScore }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error submitting tune score:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
