// @vitest-environment node
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('@/lib/db', () => ({ default: {} }));

let rounds;
let session;

beforeAll(async () => {
  process.env.GAME_SESSION_SECRET = 'test-secret';
  rounds = await import('@/lib/games/rounds');
  session = await import('@/lib/games/session');
});

afterEach(() => vi.useRealTimers());

describe('round tokens', () => {
  it('round-trips player, game, ids and track', () => {
    const token = rounds.createRoundToken({ playerId: 'p1', gameType: 'THEORY', ids: ['w1', 'w2'], track: 'western' });
    const round = rounds.verifyRoundToken(token, { playerId: 'p1', gameType: 'THEORY' });
    expect(round.ids).toEqual(['w1', 'w2']);
    expect(round.track).toBe('western');
    expect(round.elapsedMs).toBeGreaterThanOrEqual(0);
  });

  it('rejects a token for another player or game', () => {
    const token = rounds.createRoundToken({ playerId: 'p1', gameType: 'TRIVIA' });
    expect(rounds.verifyRoundToken(token, { playerId: 'p2', gameType: 'TRIVIA' })).toBeNull();
    expect(rounds.verifyRoundToken(token, { playerId: 'p1', gameType: 'THEORY' })).toBeNull();
  });

  it('rejects tampered payloads', () => {
    const token = rounds.createRoundToken({ playerId: 'p1', gameType: 'TRIVIA', ids: ['a'] });
    const [payload, sig] = [token.slice(0, token.lastIndexOf('.')), token.slice(token.lastIndexOf('.') + 1)];
    const forged = Buffer.from(JSON.stringify({ p: 'p1', g: 'TRIVIA', ids: ['a', 'b'], at: 0 })).toString('base64url');
    expect(rounds.verifyRoundToken(`round:${forged}.${sig}`, { playerId: 'p1', gameType: 'TRIVIA' })).toBeNull();
    expect(rounds.verifyRoundToken(`${payload}x.${sig}`, { playerId: 'p1', gameType: 'TRIVIA' })).toBeNull();
  });

  it('does not accept a session cookie as a round token', () => {
    expect(rounds.verifyRoundToken(session.signGameSession('p1'), { playerId: 'p1', gameType: 'TRIVIA' })).toBeNull();
  });

  it('measures elapsed time from issue', () => {
    vi.useFakeTimers();
    const token = rounds.createRoundToken({ playerId: 'p1', gameType: 'RHYTHM_TAP' });
    vi.advanceTimersByTime(42_000);
    expect(rounds.verifyRoundToken(token, { playerId: 'p1', gameType: 'RHYTHM_TAP' }).elapsedMs).toBe(42_000);
  });
});

describe('speedClaimsArePlausible', () => {
  const answers = (ms) => ms.map((timeTakenMs) => ({ timeTakenMs }));

  it('accepts claimed times that account for the real round time', () => {
    expect(rounds.speedClaimsArePlausible(answers([3000, 4000, 5000]), 13_000, 2_000)).toBe(true);
  });

  it('rejects fast claims during a slow round', () => {
    expect(rounds.speedClaimsArePlausible(answers([500, 500, 500]), 120_000, 10_000)).toBe(false);
  });
});
