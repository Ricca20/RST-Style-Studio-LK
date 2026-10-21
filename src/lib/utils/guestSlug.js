// Contributors credited on songs without a Profile get a "guest" URL built from
// their name. The name is URI-encoded so Sinhala (and other non-Latin) names
// survive; the old format (Latin-only, dashes) is still recognised for old links.

const GUEST_PREFIX = 'guest-';

export function guestSlug(name) {
  return `${GUEST_PREFIX}${encodeURIComponent(String(name).trim())}`;
}

export function isGuestSlug(slug) {
  return typeof slug === 'string' && slug.startsWith(GUEST_PREFIX);
}

/** Name encoded in a guest slug (route params may arrive encoded or decoded). */
export function guestNameFromSlug(slug) {
  const raw = slug.slice(GUEST_PREFIX.length);
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

/** The legacy slug form: lowercase, every non a–z/0–9 run replaced by a dash. */
export function legacyGuestKey(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
