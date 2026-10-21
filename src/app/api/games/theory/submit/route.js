import { NextResponse } from 'next/server';
import { z } from 'zod';
import { guardPlay, saveScore } from '@/lib/games/guard';
import { verifyRoundToken } from '@/lib/games/rounds';
import { uniqueAnswers } from '@/lib/games/scoring';
import { theoryAnswerKey } from '@/lib/games/theoryQuestions';
import { getClientIp } from '@/lib/rate-limit';

const MAX_ROUND_MS = 15 * 60 * 1000; // untimed quiz, but a round can't stay open forever
const POINTS_PER_CORRECT = 20;

const submitSchema = z.object({
  token: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptionId: z.string().nullable()
  })).max(10) // each theory track has only a handful of questions
});

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const guard = await guardPlay('THEORY', { ip });
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const { token, answers } = submitSchema.parse(await request.json());
    const round = verifyRoundToken(token, { playerId: guard.player.id, gameType: 'THEORY' });
    if (!round) return NextResponse.json({ error: 'Invalid game session. Please start again.' }, { status: 400 });
    if (round.elapsedMs > MAX_ROUND_MS) return NextResponse.json({ error: 'This round has expired. Please start again.' }, { status: 400 });

    // Only questions served in this round count
    const answerKey = theoryAnswerKey(round.track);
    let totalScore = 0;
    for (const answer of uniqueAnswers(answers, 'questionId')) {
      if (round.ids.includes(answer.questionId) && answerKey[answer.questionId] === answer.selectedOptionId) {
        totalScore += POINTS_PER_CORRECT;
      }
    }

    const saved = await saveScore({ playerId: guard.player.id, gameType: 'THEORY', score: totalScore, ip });
    if (!saved) return NextResponse.json({ error: 'You have already played Theory Master this month!' }, { status: 403 });

    return NextResponse.json({ success: true, score: totalScore }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error submitting theory score:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
