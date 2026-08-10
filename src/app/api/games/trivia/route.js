import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // Optional: enforce that only registered users can fetch questions to prevent scraping
    const cookieStore = await cookies();
    const playerId = cookieStore.get('game_session')?.value;

    if (!playerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch 10 random active questions
    // Prisma doesn't have a native "ORDER BY RAND()" so we fetch IDs and randomize in JS,
    // or fetch all active and shuffle. Since the pool might not be huge, fetching all active is okay.
    
    const allQuestions = await prisma.triviaQuestion.findMany({
      where: { isActive: true },
      select: {
        id: true,
        difficulty: true,
        questionEn: true,
        questionSi: true,
        questionIt: true,
        options: true,
        // DONT send correctOption to the client! 
        // We will validate it server-side when they submit the score, 
        // or we can send it if we trust the client (for MVP, let's send it but obfuscated or just send it and accept client scoring for simplicity)
        // Wait, the user specifically asked for anti-cheat. 
        // For true anti-cheat, the client submits an array of { questionId, answerId } and the server calculates the score.
        // Let's implement that in a separate /api/games/trivia/score endpoint.
      }
    });

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: 'No questions available' }, { status: 404 });
    }

    // Shuffle and pick 10
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    // Shuffle options for each question
    const sanitizedQuestions = selected.map(q => {
      const opts = Array.isArray(q.options) ? q.options : [];
      return {
        ...q,
        options: opts.sort(() => 0.5 - Math.random())
      };
    });

    return NextResponse.json(sanitizedQuestions);
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
