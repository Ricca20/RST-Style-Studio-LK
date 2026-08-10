import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('gameType');
    
    let month = parseInt(searchParams.get('month'));
    let year = parseInt(searchParams.get('year'));

    // Default to current month/year if not provided
    const now = new Date();
    if (!month || isNaN(month)) month = now.getMonth() + 1;
    if (!year || isNaN(year)) year = now.getFullYear();

    if (!gameType || !['TRIVIA', 'PITCH_MATCH', 'THEORY', 'NAME_THAT_TUNE', 'RHYTHM_TAP'].includes(gameType)) {
      return NextResponse.json({ error: 'Valid gameType is required' }, { status: 400 });
    }

    // 1. Fetch top 10 scores for this game this month
    const topScores = await prisma.gameScore.findMany({
      where: {
        gameType,
        month,
        year
      },
      orderBy: {
        score: 'desc'
      },
      take: 10,
      include: {
        player: {
          select: {
            username: true,
            // Hide email for privacy
          }
        }
      }
    });

    // 2. Fetch prize info for this month if set by admin
    const leaderboardInfo = await prisma.monthlyLeaderboard.findUnique({
      where: {
        gameType_month_year: {
          gameType,
          month,
          year
        }
      },
      select: {
        prizeDetails: true,
        winnerId: true,
        adminApproved: true,
        winner: {
          select: {
            username: true
          }
        }
      }
    });

    // Format the response
    const formattedScores = topScores.map((s, index) => ({
      rank: index + 1,
      username: s.player.username,
      score: s.score,
      date: s.createdAt
    }));

    return NextResponse.json({
      gameType,
      month,
      year,
      prizeDetails: leaderboardInfo?.prizeDetails || 'Prize TBA',
      winner: (leaderboardInfo?.adminApproved && leaderboardInfo?.winner) ? leaderboardInfo.winner.username : null,
      leaderboard: formattedScores
    }, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate' // Cache for 60 seconds
      }
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
