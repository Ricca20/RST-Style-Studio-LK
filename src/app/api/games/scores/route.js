import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import { cookies } from 'next/headers';

const scoreSchema = z.object({
  gameType: z.enum(['TRIVIA', 'PITCH_MATCH', 'THEORY', 'NAME_THAT_TUNE', 'RHYTHM_TAP']),
  score: z.number().int().min(0)
});

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const playerId = cookieStore.get('game_session')?.value;

    if (!playerId) {
      return NextResponse.json({ error: 'Unauthorized. Please register or verify your email.' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = scoreSchema.parse(body);

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // 1. Check if the player already played this game this month
    const existingPlay = await prisma.gameScore.findUnique({
      where: {
        playerId_gameType_month_year: {
          playerId: playerId,
          gameType: validatedData.gameType,
          month: currentMonth,
          year: currentYear
        }
      }
    });

    if (existingPlay) {
      return NextResponse.json({ error: 'You have already played this game this month! Try again next month.' }, { status: 403 });
    }

    // 2. Anti-Cheat: IP Address Tracking
    // Get IP address from headers (works for Vercel/proxies)
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    if (ipAddress !== 'unknown') {
      // Check how many different players from this IP have played THIS game THIS month
      const playsFromIp = await prisma.gameScore.count({
        where: {
          gameType: validatedData.gameType,
          month: currentMonth,
          year: currentYear,
          ipAddress: ipAddress
        }
      });

      // Limit to max 2 plays per IP per game per month to prevent mass account creation abuse
      if (playsFromIp >= 2) {
        return NextResponse.json({ error: 'IP limit reached for this game this month.' }, { status: 429 });
      }
    }

    // 3. Save the score
    const newScore = await prisma.gameScore.create({
      data: {
        playerId,
        gameType: validatedData.gameType,
        month: currentMonth,
        year: currentYear,
        score: validatedData.score,
        ipAddress: ipAddress !== 'unknown' ? ipAddress : null
      }
    });

    return NextResponse.json({ success: true, score: newScore }, { status: 201 });

  } catch (error) {
    console.error('Error submitting score:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
