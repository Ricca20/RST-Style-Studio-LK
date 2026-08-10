import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import { cookies } from 'next/headers';

const submitSchema = z.object({
  answers: z.array(z.object({
    clipId: z.string(),
    selectedOptionId: z.string(),
    timeTakenMs: z.number().min(0)
  }))
});

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const playerId = cookieStore.get('game_session')?.value;

    if (!playerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = submitSchema.parse(body);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const gameType = 'NAME_THAT_TUNE';

    const existingPlay = await prisma.gameScore.findUnique({
      where: {
        playerId_gameType_month_year: { playerId, gameType, month: currentMonth, year: currentYear }
      }
    });

    if (existingPlay) {
      return NextResponse.json({ error: 'You have already played Name That Tune this month!' }, { status: 403 });
    }

    let totalScore = 0;
    const clipIds = validatedData.answers.map(a => a.clipId);

    const dbClips = await prisma.tuneClip.findMany({
      where: { id: { in: clipIds } }
    });

    for (const answer of validatedData.answers) {
      // MOCK DATA check for MVP testing
      if (answer.clipId === 'mock1' && answer.selectedOptionId === 'o1') {
         totalScore += 20;
         continue;
      }

      const dbClip = dbClips.find(c => c.id === answer.clipId);
      if (!dbClip) continue;

      if (dbClip.correctOption === answer.selectedOptionId) {
        let points = 20; // base
        // Speed bonus
        const secondsTaken = answer.timeTakenMs / 1000;
        if (secondsTaken < 3) points += 10;
        else if (secondsTaken < 6) points += 5;

        totalScore += points;
      }
    }

    const newScore = await prisma.gameScore.create({
      data: {
        playerId,
        gameType,
        month: currentMonth,
        year: currentYear,
        score: totalScore
      }
    });

    return NextResponse.json({ success: true, score: totalScore, newScore }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
