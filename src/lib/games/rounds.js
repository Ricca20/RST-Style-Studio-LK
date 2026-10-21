import prisma from '@/lib/db';
import { signValue, unsignValue } from '@/lib/games/session';

// A round token is issued when a game starts. It is signed, so the server can
// later trust: who started the round, which game, which questions were served,
// and when. Submissions must present it.

export function createRoundToken({ playerId, gameType, ids = [], track = null }) {
  const payload = { p: playerId, g: gameType, ids, t: track, at: Date.now() };
  // The "round:" prefix keeps these distinct from session cookies signed with the same key
  return signValue(`round:${Buffer.from(JSON.stringify(payload)).toString('base64url')}`);
}

/**
 * @returns {{ ids: string[], track: string|null, issuedAt: number, elapsedMs: number } | null}
 *   null if the token is missing, forged, or belongs to another player/game.
 */
export function verifyRoundToken(token, { playerId, gameType }) {
  const signed = unsignValue(token);
  if (!signed?.startsWith('round:')) return null;
  const encoded = signed.slice('round:'.length);

  let payload;
  try {
    payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (payload.p !== playerId || payload.g !== gameType || typeof payload.at !== 'number') return null;
  return {
    ids: Array.isArray(payload.ids) ? payload.ids : [],
    track: payload.t ?? null,
    issuedAt: payload.at,
    elapsedMs: Date.now() - payload.at,
  };
}

export function currentPeriod(now = new Date()) {
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

/** True if the player already has a score for this game this month. */
export async function hasPlayedThisMonth(playerId, gameType) {
  const { month, year } = currentPeriod();
  const existing = await prisma.gameScore.findUnique({
    where: { playerId_gameType_month_year: { playerId, gameType, month, year } },
    select: { id: true },
  });
  return Boolean(existing);
}

/**
 * Speed bonuses rely on the per-answer times the browser reports. Only honour
 * them if, taken together, they roughly account for the real time the round
 * took; a client claiming fast answers during a slow round gets no bonus.
 * `slackMs` covers network latency and UI transitions between questions.
 */
export function speedClaimsArePlausible(answers, elapsedMs, slackMs) {
  const claimed = answers.reduce((sum, a) => sum + (Number(a.timeTakenMs) || 0), 0);
  return claimed + slackMs >= elapsedMs;
}
