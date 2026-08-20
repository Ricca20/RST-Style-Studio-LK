import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireRole } from '@/lib/auth/server-auth';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
        },
      }
    );

    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const leaderboards = await prisma.monthlyLeaderboard.findMany({
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { gameType: 'asc' }
      ],
      include: {
        winner: true
      },
      take: 20
    });

    // We also want to fetch the current top players for these leaderboards
    const leaderboardsWithScores = await Promise.all(leaderboards.map(async (lb) => {
      const topScores = await prisma.gameScore.findMany({
        where: {
          gameType: lb.gameType,
          month: lb.month,
          year: lb.year
        },
        orderBy: { score: 'desc' },
        take: 3,
        include: { player: true }
      });
      return {
        ...lb,
        topScores
      };
    }));

    return NextResponse.json(leaderboardsWithScores);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboards' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
        },
      }
    );

    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const body = await request.json();
    const { action } = body;

    if (action === 'SET_PRIZE') {
      const { gameType, month, year, prizeDetails } = body;
      const leaderboard = await prisma.monthlyLeaderboard.upsert({
        where: {
          gameType_month_year: { gameType, month, year }
        },
        update: { prizeDetails },
        create: { gameType, month, year, prizeDetails }
      });
      return NextResponse.json(leaderboard);
    } 
    else if (action === 'APPROVE_WINNER') {
      const { leaderboardId, winnerId } = body;
      
      // Get the score for this winner
      const leaderboard = await prisma.monthlyLeaderboard.findUnique({ where: { id: leaderboardId } });
      const winningScore = await prisma.gameScore.findFirst({
        where: { playerId: winnerId, gameType: leaderboard.gameType, month: leaderboard.month, year: leaderboard.year }
      });

      const updated = await prisma.monthlyLeaderboard.update({
        where: { id: leaderboardId },
        data: {
          winnerId,
          winnerScore: winningScore?.score || null,
          adminApproved: true,
          emailSentAt: new Date()
        }
      });

      // TODO: Send winner email via Resend

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
