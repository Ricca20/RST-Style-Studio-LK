import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import { cookies } from 'next/headers';

const submitSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
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
    const gameType = 'TRIVIA';

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
      return NextResponse.json({ error: 'You have already played Trivia this month!' }, { status: 403 });
    }

    // 2. Anti-Cheat: IP Address check
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (ipAddress !== 'unknown') {
      const playsFromIp = await prisma.gameScore.count({
        where: {
          gameType,
          month: currentMonth,
          year: currentYear,
          ipAddress
        }
      });
      if (playsFromIp >= 2) {
        return NextResponse.json({ error: 'IP limit reached for this game this month.' }, { status: 429 });
      }
    }

    // 3. Calculate Score Server-Side
    let totalScore = 0;
    const questionIds = validatedData.answers.map(a => a.questionId);
    
    const dbQuestions = await prisma.triviaQuestion.findMany({
      where: { id: { in: questionIds } }
    });

    for (const answer of validatedData.answers) {
      const dbQuestion = dbQuestions.find(q => q.id === answer.questionId);
      if (!dbQuestion) continue;

      if (dbQuestion.correctOption === answer.selectedOptionId) {
        // Base points based on difficulty
        let points = 10;
        if (dbQuestion.difficulty === 'MEDIUM') points = 15;
        if (dbQuestion.difficulty === 'HARD') points = 20;

        // Speed bonus (max 15 seconds per question)
        // If answered in < 5 seconds, max bonus.
        const secondsTaken = answer.timeTakenMs / 1000;
        let speedBonus = 0;
        if (secondsTaken < 5) speedBonus = 5;
        else if (secondsTaken < 10) speedBonus = 2;

        totalScore += (points + speedBonus);
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
    console.error('Error submitting trivia score:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
