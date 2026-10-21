// @vitest-environment node
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { memoryRateLimit as rateLimit, getClientIp, _resetRateLimits } from '@/lib/rate-limit';

vi.mock('@/lib/db', () => ({ default: {} }));

describe('memoryRateLimit (fallback)', () => {
  beforeEach(() => _resetRateLimits());
  afterEach(() => vi.useRealTimers());

  it('allows up to the limit and blocks after', () => {
    for (let i = 0; i < 3; i++) expect(rateLimit('k', 3, 1000).success).toBe(true);
    expect(rateLimit('k', 3, 1000).success).toBe(false);
  });

  it('keeps separate budgets per key', () => {
    rateLimit('quote:1.1.1.1', 1, 1000);
    expect(rateLimit('quote:1.1.1.1', 1, 1000).success).toBe(false);
    expect(rateLimit('contact:1.1.1.1', 1, 1000).success).toBe(true);
  });

  it('resets after the window passes', () => {
    vi.useFakeTimers();
    rateLimit('k', 1, 1000);
    expect(rateLimit('k', 1, 1000).success).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rateLimit('k', 1, 1000).success).toBe(true);
  });
});

describe('getClientIp', () => {
  const req = (headers) => ({ headers: new Headers(headers) });

  it('takes the first address from x-forwarded-for', () => {
    expect(getClientIp(req({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' }))).toBe('203.0.113.5');
  });

  it('falls back to x-real-ip, then unknown', () => {
    expect(getClientIp(req({ 'x-real-ip': '198.51.100.7' }))).toBe('198.51.100.7');
    expect(getClientIp(req({}))).toBe('unknown');
  });
});

describe('rateLimit (database-backed)', () => {
  it('falls back to the in-memory limiter when the database is unavailable', async () => {
    vi.resetModules();
    vi.doMock('@/lib/db', () => ({ default: { $queryRaw: vi.fn().mockRejectedValue(new Error('down')) } }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rateLimit: dbRateLimit } = await import('@/lib/rate-limit');

    expect((await dbRateLimit('fallback', 1, 1000)).success).toBe(true);
    expect((await dbRateLimit('fallback', 1, 1000)).success).toBe(false);
  });

  it('uses the count returned by the database', async () => {
    vi.resetModules();
    vi.doMock('@/lib/db', () => ({ default: { $queryRaw: vi.fn().mockResolvedValue([{ count: 6 }]) } }));
    const { rateLimit: dbRateLimit } = await import('@/lib/rate-limit');

    expect((await dbRateLimit('k', 5, 1000)).success).toBe(false);
  });
});
