// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { canAccessAdminPath } from '@/lib/auth/admin-access';
import { guestSlug, guestNameFromSlug, isGuestSlug, legacyGuestKey } from '@/lib/utils/guestSlug';
import { triviaQuestionSchema, tuneClipSchema } from '@/lib/games/questionSchemas';
import { shuffle } from '@/lib/games/shuffle';
import { theoryAnswerKey } from '@/lib/games/theoryQuestions';
import { testimonialSchema } from '@/lib/testimonials';
import { QUOTE_ROLE_KEYS } from '@/lib/quoteRoles';

describe('admin access map', () => {
  it('lets editors manage content but not quotations or settings', () => {
    expect(canAccessAdminPath('/admin/songs/new', 'EDITOR')).toBe(true);
    expect(canAccessAdminPath('/admin/media', 'EDITOR')).toBe(true);
    expect(canAccessAdminPath('/admin/quotations', 'EDITOR')).toBe(false);
    expect(canAccessAdminPath('/admin/settings', 'ADMIN')).toBe(false);
    expect(canAccessAdminPath('/admin/settings/team', 'SUPER_ADMIN')).toBe(true);
  });

  it('limits viewers to the dashboard and their notifications', () => {
    expect(canAccessAdminPath('/admin', 'VIEWER')).toBe(true);
    expect(canAccessAdminPath('/admin/notifications', 'VIEWER')).toBe(true);
    expect(canAccessAdminPath('/admin/songs', 'VIEWER')).toBe(false);
  });

  it('defaults unknown admin pages to admins only', () => {
    expect(canAccessAdminPath('/admin/something-new', 'EDITOR')).toBe(false);
    expect(canAccessAdminPath('/admin/something-new', 'ADMIN')).toBe(true);
  });

  it('never admits contributors', () => {
    expect(canAccessAdminPath('/admin', 'CONTRIBUTOR')).toBe(false);
  });
});

describe('guest slugs', () => {
  it('keeps Sinhala names intact', () => {
    const slug = guestSlug('සමන් සිල්වා');
    expect(isGuestSlug(slug)).toBe(true);
    expect(guestNameFromSlug(slug)).toBe('සමන් සිල්වා');
  });

  it('handles params that arrive already decoded', () => {
    expect(guestNameFromSlug('guest-Saman Silva')).toBe('Saman Silva');
    expect(guestNameFromSlug('guest-100%')).toBe('100%');
  });

  it('builds the legacy key used by old links', () => {
    expect(legacyGuestKey('Saman Silva')).toBe('saman-silva');
  });
});

describe('game content validation', () => {
  const options = [
    { id: '1', textEn: 'A' },
    { id: '2', textEn: 'B' },
  ];

  it('accepts a valid trivia question', () => {
    expect(() => triviaQuestionSchema.parse({ difficulty: 'EASY', questionEn: 'Q?', options, correctOption: '2' })).not.toThrow();
  });

  it('rejects a correct answer that is not an option', () => {
    expect(() => triviaQuestionSchema.parse({ difficulty: 'EASY', questionEn: 'Q?', options, correctOption: '9' })).toThrow();
  });

  it('rejects duplicate option ids and blank option text', () => {
    expect(() => triviaQuestionSchema.parse({ difficulty: 'EASY', questionEn: 'Q?', options: [options[0], options[0]], correctOption: '1' })).toThrow();
    expect(() => triviaQuestionSchema.parse({ difficulty: 'EASY', questionEn: 'Q?', options: [{ id: '1', textEn: ' ' }, options[1]], correctOption: '1' })).toThrow();
  });

  it('requires an https audio URL for tune clips', () => {
    const base = { titleEn: 'Guess', options, correctOption: '1' };
    expect(() => tuneClipSchema.parse({ ...base, audioUrl: 'https://x.supabase.co/a.mp3' })).not.toThrow();
    expect(() => tuneClipSchema.parse({ ...base, audioUrl: 'javascript:alert(1)' })).toThrow();
  });
});

describe('misc helpers', () => {
  it('shuffle keeps every item and does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect(out.sort()).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('theory answer key comes from the question bank', () => {
    expect(theoryAnswerKey('western')).toEqual({ w1: 'o1', w2: 'o2', w3: 'o2' });
    expect(theoryAnswerKey('eastern')).toEqual({ e1: 'o3', e2: 'o1', e3: 'o3' });
  });

  it('testimonial schema coerces form values', () => {
    const parsed = testimonialSchema.parse({ name: 'Ann', quote: 'Great', rating: '4', imageUrl: '', isPublished: true });
    expect(parsed.rating).toBe(4);
    expect(parsed.imageUrl).toBeNull();
    expect(() => testimonialSchema.parse({ name: 'Ann', quote: 'Great', rating: '9' })).toThrow();
  });

  it('quote roles match the keys the quote wizard uses', () => {
    expect(QUOTE_ROLE_KEYS).toContain('LYRICS');
    expect(QUOTE_ROLE_KEYS).toContain('MIX_MASTER');
    expect(QUOTE_ROLE_KEYS).not.toContain('VOCALIST');
  });
});
