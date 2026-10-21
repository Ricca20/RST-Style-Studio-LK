import prisma from '@/lib/db';

// Fixed-window rate limiter backed by the RateLimit table, so the limit holds
// across every serverless instance. If the database call fails, it falls back
// to a per-instance in-memory counter rather than blocking legitimate users.

/**
 * @param {string} key - Identifier to limit on. Prefix it per route (e.g. `quote:${ip}`)
 *   so separate endpoints do not share a budget.
 * @param {number} limit - Max requests allowed per window.
 * @param {number} windowMs - Window length in milliseconds.
 * @returns {Promise<{ success: boolean }>}
 */
export async function rateLimit(key, limit = 5, windowMs = 60000) {
  try {
    const windowSeconds = windowMs / 1000;
    // One atomic upsert: start a new window if the old one expired, otherwise count up.
    const rows = await prisma.$queryRaw`
      INSERT INTO "RateLimit" ("key", "count", "windowStart")
      VALUES (${key}, 1, NOW())
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "RateLimit"."windowStart" < NOW() - make_interval(secs => ${windowSeconds}::float8) THEN 1
          ELSE "RateLimit"."count" + 1
        END,
        "windowStart" = CASE
          WHEN "RateLimit"."windowStart" < NOW() - make_interval(secs => ${windowSeconds}::float8) THEN NOW()
          ELSE "RateLimit"."windowStart"
        END
      RETURNING "count"`;

    // Occasionally clear out stale keys so the table stays small.
    if (Math.random() < 0.01) {
      prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "windowStart" < NOW() - INTERVAL '1 day'`
        .catch((error) => console.error('Rate limit cleanup failed:', error));
    }

    return { success: Number(rows[0].count) <= limit };
  } catch (error) {
    console.error('Rate limit store unavailable, using in-memory fallback:', error.message);
    return memoryRateLimit(key, limit, windowMs);
  }
}

const memoryStore = new Map();
const MAX_TRACKED_KEYS = 5000;

/** Per-instance fallback. Exported for tests. */
export function memoryRateLimit(key, limit = 5, windowMs = 60000) {
  const now = Date.now();

  if (memoryStore.size > MAX_TRACKED_KEYS) {
    for (const [k, data] of memoryStore) {
      if (now - data.firstRequest >= data.windowMs) memoryStore.delete(k);
    }
  }

  const requestData = memoryStore.get(key);
  if (!requestData || now - requestData.firstRequest >= windowMs) {
    memoryStore.set(key, { count: 1, firstRequest: now, windowMs });
    return { success: true };
  }

  requestData.count++;
  return { success: requestData.count <= limit };
}

/**
 * Returns the originating client IP. `x-forwarded-for` can hold a proxy chain
 * ("client, proxy1, proxy2"); the first entry is the client.
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

// Exposed for tests only.
export function _resetRateLimits() {
  memoryStore.clear();
}
