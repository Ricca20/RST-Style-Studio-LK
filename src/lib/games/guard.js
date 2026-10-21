import prisma from '@/lib/db';
import { getGamePlayerId } from '@/lib/games/session';
import { currentPeriod, hasPlayedThisMonth } from '@/lib/games/rounds';

const MAX_PLAYS_PER_IP = 2;

/** The verified player for this request, or null (no/forged cookie, or player deleted). */
export async function getCurrentPlayer() {
  const playerId = await getGamePlayerId();
  if (!playerId) return null;
  const player = await prisma.gamePlayer.findUnique({
    where: { id: playerId },
    select: { id: true, username: true, verifiedAt: true },
  });
  return player?.verifiedAt ? player : null;
}

/**
 * Checks shared by starting and submitting a game.
 * @returns {{ player } | { error: string, status: number }}
 */
export async function guardPlay(gameType, { ip = null } = {}) {
  const player = await getCurrentPlayer();
  if (!player) {
    return { error: 'Please register or verify your email to play.', status: 401 };
  }

  if (await hasPlayedThisMonth(player.id, gameType)) {
    return { error: 'You have already played this game this month! Try again next month.', status: 403 };
  }

  // Limit how many different players from one IP can play a game each month,
  // to slow down throwaway-account farming.
  if (ip && ip !== 'unknown') {
    const { month, year } = currentPeriod();
    const playsFromIp = await prisma.gameScore.count({ where: { gameType, month, year, ipAddress: ip } });
    if (playsFromIp >= MAX_PLAYS_PER_IP) {
      return { error: 'IP limit reached for this game this month.', status: 429 };
    }
  }

  return { player };
}

/** Saves the month's score. A concurrent duplicate submit hits the unique constraint. */
export async function saveScore({ playerId, gameType, score, ip }) {
  const { month, year } = currentPeriod();
  try {
    return await prisma.gameScore.create({
      data: { playerId, gameType, month, year, score, ipAddress: ip && ip !== 'unknown' ? ip : null },
    });
  } catch (error) {
    if (error.code === 'P2002') return null;
    throw error;
  }
}
