import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { guardPlay } from '@/lib/games/guard';
import { createRoundToken } from '@/lib/games/rounds';
import { shuffle } from '@/lib/games/shuffle';
import { getClientIp } from '@/lib/rate-limit';

const QUESTIONS_PER_GAME = 10;

export async function GET(request) {
  try {
    const guard = await guardPlay('TRIVIA', { ip: getClientIp(request) });
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const allQuestions = await prisma.triviaQuestion.findMany({
      where: { isActive: true },
      // correctOption is never sent; answers are scored server-side on submit
      select: { id: true, difficulty: true, questionEn: true, questionSi: true, questionIt: true, options: true }
    });

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: 'No questions available' }, { status: 404 });
    }

    const questions = shuffle(allQuestions).slice(0, QUESTIONS_PER_GAME).map(q => ({
      ...q,
      options: shuffle(Array.isArray(q.options) ? q.options : [])
    }));

    const token = createRoundToken({ playerId: guard.player.id, gameType: 'TRIVIA', ids: questions.map(q => q.id) });
    return NextResponse.json({ questions, token });
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
