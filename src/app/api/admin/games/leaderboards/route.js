import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logAuditAction, requireRole } from '@/lib/auth/server-auth';
import { sendLeaderboardWinnerEmail } from '@/lib/services/sendEmail';

const GAME_TYPES = ['TRIVIA', 'PITCH_MATCH', 'THEORY', 'NAME_THAT_TUNE', 'RHYTHM_TAP'];

export async function GET(request) {
  try {
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
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const body = await request.json();
    const { action } = body;

    if (action === 'SET_PRIZE') {
      const { gameType, prizeDetails } = body;
      const month = Number(body.month);
      const year = Number(body.year);
      if (!GAME_TYPES.includes(gameType) || !Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 2000) {
        return NextResponse.json({ error: 'Valid game, month and year are required' }, { status: 400 });
      }
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

      const leaderboard = await prisma.monthlyLeaderboard.findUnique({ where: { id: leaderboardId } });
      if (!leaderboard) {
        return NextResponse.json({ error: 'Leaderboard not found' }, { status: 404 });
      }

      // The winner must actually have a score on this leaderboard
      const winningScore = await prisma.gameScore.findFirst({
        where: { playerId: winnerId, gameType: leaderboard.gameType, month: leaderboard.month, year: leaderboard.year },
        include: { player: true }
      });
      if (!winningScore) {
        return NextResponse.json({ error: 'This player has no score on this leaderboard' }, { status: 400 });
      }

      const emailSent = await sendLeaderboardWinnerEmail({
        email: winningScore.player.email,
        username: winningScore.player.username,
        gameType: leaderboard.gameType,
        month: leaderboard.month,
        year: leaderboard.year,
        score: winningScore.score,
        prizeDetails: leaderboard.prizeDetails,
      });

      const updated = await prisma.monthlyLeaderboard.update({
        where: { id: leaderboardId },
        data: {
          winnerId,
          winnerScore: winningScore.score,
          adminApproved: true,
          // Only record a send time if the email really went out
          emailSentAt: emailSent ? new Date() : null
        }
      });

      await logAuditAction(user.dbUser.id, 'APPROVE_LEADERBOARD_WINNER', 'MonthlyLeaderboard', leaderboardId, { winnerId, emailSent }, request);

      if (!emailSent) {
        return NextResponse.json({ ...updated, warning: 'Winner approved, but the email could not be sent. Contact the player manually.' });
      }
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
