// Roles a Collaborator can be priced for. The quotation wizards (QuoteClient,
// ServicesPageClient) show exactly these, and the admin Collaborators page and
// API only accept these, so the two can never drift apart.

export const CORE_ROLES = [
  { key: 'LYRICS', label: 'Lyrics', description: 'Songwriter / Lyricist', emoji: '✍️', required: true },
  { key: 'MELODY', label: 'Melody', description: 'Melody Composer', emoji: '🎵', required: true },
  { key: 'MUSIC', label: 'Music Arrangement', description: 'Music Arranger / Producer', emoji: '🎹', required: true },
  { key: 'MIX_MASTER', label: 'Mix & Master', description: 'Mixing & Mastering Engineer', emoji: '🎛️', required: true },
];

export const INSTRUMENT_ROLES = [
  { key: 'LEAD_GUITAR', label: 'Lead Guitar', emoji: '🎸' },
  { key: 'RHYTHM_GUITAR', label: 'Rhythm Guitar', emoji: '🎸' },
  { key: 'BASS_GUITAR', label: 'Bass Guitar', emoji: '🎸' },
  { key: 'FLUTE', label: 'Flute', emoji: '🪈' },
  { key: 'SITAR', label: 'Sitar', emoji: '🪕' },
  { key: 'VIOLIN', label: 'Violin', emoji: '🎻' },
  { key: 'DRUMS', label: 'Drums', emoji: '🥁' },
  { key: 'KEYBOARD', label: 'Keyboard', emoji: '🎹' },
  { key: 'TABLA', label: 'Tabla', emoji: '🪘' },
  { key: 'SINGING', label: 'Singing / Vocals', emoji: '🎤' },
];

export const QUOTE_ROLES = [...CORE_ROLES, ...INSTRUMENT_ROLES];
export const QUOTE_ROLE_KEYS = QUOTE_ROLES.map((r) => r.key);

export function quoteRole(key) {
  return QUOTE_ROLES.find((r) => r.key === key) || null;
}

/** Human-readable label for a credit role: known keys get their label, others are tidied (MIX_MASTER → Mix master). */
export function roleLabel(role) {
  if (!role) return '';
  const known = quoteRole(role);
  if (known) return known.label;
  return /[A-Z]_|^[A-Z]+$/.test(role)
    ? role.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
    : role;
}
