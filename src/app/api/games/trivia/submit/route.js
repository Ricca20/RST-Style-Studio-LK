import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import { guardPlay, saveScore } from '@/lib/games/guard';
import { speedClaimsArePlausible, verifyRoundToken } from '@/lib/games/rounds';
import { uniqueAnswers } from '@/lib/games/scoring';
import { getClientIp } from '@/lib/rate-limit';

const SECONDS_PER_QUESTION = 15; // matches the TriviaGame countdown
const DIFFICULTY_POINTS = { EASY: 10, MEDIUM: 15, HARD: 20 };

const submitSchema = z.object({
  token: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptionId: z.string().nullable(), // null when the timer ran out
    timeTakenMs: z.number().min(0).max(SECONDS_PER_QUESTION * 1000)
  })).max(10) // GET /api/games/trivia serves 10 questions per game
});

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const guard = await guardPlay('TRIVIA', { ip });
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const body = submitSchema.parse(await request.json());
    const round = verifyRoundToken(body.token, { playerId: guard.player.id, gameType: 'TRIVIA' });
    if (!round) return NextResponse.json({ error: 'Invalid game session. Please start again.' }, { status: 400 });

    // The round can't take longer than every timer running out, plus some slack
    const maxRoundMs = round.ids.length * SECONDS_PER_QUESTION * 1000 + 60_000;
    if (round.elapsedMs > maxRoundMs) {
      return NextResponse.json({ error: 'This round has expired. Please start again.' }, { status: 400 });
    }

    // Only questions served in this round count
    const answers = uniqueAnswers(body.answers, 'questionId').filter(a => round.ids.includes(a.questionId));
    const allowSpeedBonus = speedClaimsArePlausible(answers, round.elapsedMs, 5_000 + answers.length * 1_500);

    const dbQuestions = await prisma.triviaQuestion.findMany({
      where: { id: { in: answers.map(a => a.questionId) } },
      select: { id: true, difficulty: true, correctOption: true }
    });

    let totalScore = 0;
    for (const answer of answers) {
      const dbQuestion = dbQuestions.find(q => q.id === answer.questionId);
      if (!dbQuestion || dbQuestion.correctOption !== answer.selectedOptionId) continue;

      let points = DIFFICULTY_POINTS[dbQuestion.difficulty] ?? DIFFICULTY_POINTS.EASY;
      if (allowSpeedBonus) {
        const secondsTaken = answer.timeTakenMs / 1000;
        if (secondsTaken < 5) points += 5;
        else if (secondsTaken < 10) points += 2;
      }
      totalScore += points;
    }

    const saved = await saveScore({ playerId: guard.player.id, gameType: 'TRIVIA', score: totalScore, ip });
    if (!saved) return NextResponse.json({ error: 'You have already played Trivia this month!' }, { status: 403 });

    return NextResponse.json({ success: true, score: totalScore }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error submitting trivia score:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
