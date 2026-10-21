// @vitest-environment node
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));

let signGameSession;
let verifyGameSession;

beforeAll(async () => {
  process.env.GAME_SESSION_SECRET = 'test-secret';
  ({ signGameSession, verifyGameSession } = await import('@/lib/games/session'));
});

describe('game session signing', () => {
  it('round-trips a player id', () => {
    const id = '3f1c2a9e-1111-4222-8333-944455556666';
    expect(verifyGameSession(signGameSession(id))).toBe(id);
  });

  it('rejects a bare (unsigned) player id, as the old cookie format was', () => {
    expect(verifyGameSession('3f1c2a9e-1111-4222-8333-944455556666')).toBeNull();
  });

  it('rejects a signature taken from a different player', () => {
    const [, signature] = signGameSession('player-a').split('.');
    expect(verifyGameSession(`player-b.${signature}`)).toBeNull();
  });

  it('rejects empty and malformed values', () => {
    expect(verifyGameSession(undefined)).toBeNull();
    expect(verifyGameSession('')).toBeNull();
    expect(verifyGameSession('.abc')).toBeNull();
    expect(verifyGameSession('player-a.')).toBeNull();
  });
});
