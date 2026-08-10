import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import { cookies } from 'next/headers';

// Keep the same hardcoded questions here for server-side evaluation
const theoryQuestions = {
  western: {
    w1: 'o1',
    w2: 'o2',
    w3: 'o2'
  },
  eastern: {
    e1: 'o3',
    e2: 'o1',
    e3: 'o3'
  }
};

const submitSchema = z.object({
  track: z.enum(['western', 'eastern']),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptionId: z.string()
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
    const gameType = 'THEORY';

    // 1. Anti-Cheat: Check if already played this month
    const existingPlay = await prisma.gameScore.findUnique({
      where: {
        playerId_gameType_month_year: {
          playerId,
          gameType,
          month: currentMonth,
          year: currentYear
        }
      }
    });

    if (existingPlay) {
      return NextResponse.json({ error: 'You have already played Theory Master this month!' }, { status: 403 });
    }

    // 2. Anti-Cheat: IP Address check
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (ipAddress !== 'unknown') {
      const playsFromIp = await prisma.gameScore.count({
        where: { gameType, month: currentMonth, year: currentYear, ipAddress }
      });
      if (playsFromIp >= 2) {
        return NextResponse.json({ error: 'IP limit reached for this game this month.' }, { status: 429 });
      }
    }

    // 3. Calculate Score
    let totalScore = 0;
    const trackAnswers = theoryQuestions[validatedData.track];

    for (const answer of validatedData.answers) {
      if (trackAnswers[answer.questionId] === answer.selectedOptionId) {
        totalScore += 20; // 20 points per correct answer
      }
    }

    // 4. Save Score
    const newScore = await prisma.gameScore.create({
      data: {
        playerId,
        gameType,
        month: currentMonth,
        year: currentYear,
        score: totalScore,
        ipAddress: ipAddress !== 'unknown' ? ipAddress : null
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
