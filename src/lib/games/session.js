import crypto from 'crypto';
import { cookies } from 'next/headers';

export const GAME_SESSION_COOKIE = 'game_session';
export const GAME_SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function getSecret() {
  const secret = process.env.GAME_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== 'production') return 'dev-only-insecure-game-session-secret';
  throw new Error('GAME_SESSION_SECRET is not configured');
}

function hmac(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

/** Signs an arbitrary string as `<value>.<signature>`. */
export function signValue(value) {
  return `${value}.${hmac(value)}`;
}

/** Returns the original value if the signature matches, else null. */
export function unsignValue(signed) {
  if (!signed || typeof signed !== 'string') return null;

  const dot = signed.lastIndexOf('.');
  if (dot <= 0) return null;

  const value = signed.slice(0, dot);
  const given = Buffer.from(signed.slice(dot + 1));
  let expected;
  try {
    expected = Buffer.from(hmac(value));
  } catch (error) {
    console.error('Signature verification failed:', error.message);
    return null;
  }

  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  return value;
}

/**
 * Produces the cookie value `<playerId>.<signature>` so the player id cannot be
 * swapped for someone else's without the server secret.
 */
export function signGameSession(playerId) {
  return signValue(playerId);
}

/**
 * Returns the player id from a signed cookie value, or null if it is missing,
 * malformed or the signature does not match.
 */
export function verifyGameSession(value) {
  return unsignValue(value);
}

/** Reads and verifies the game session cookie for the current request. */
export async function getGamePlayerId() {
  const cookieStore = await cookies();
  return verifyGameSession(cookieStore.get(GAME_SESSION_COOKIE)?.value);
}
