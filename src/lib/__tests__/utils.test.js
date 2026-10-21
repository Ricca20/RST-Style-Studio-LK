// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { escapeHtml } from '@/lib/utils/escapeHtml';
import { uniqueAnswers } from '@/lib/games/scoring';

vi.mock('@/lib/db', () => ({ default: {} }));
const { safeAccentColor, safeExternalUrl, safeFacebookPixelId, safeGoogleAnalyticsId } = await import('@/lib/settings');

describe('escapeHtml', () => {
  it('escapes HTML metacharacters', () => {
    expect(escapeHtml('<img src=x onerror="a()">&\'')).toBe('&lt;img src=x onerror=&quot;a()&quot;&gt;&amp;&#39;');
  });

  it('handles null, undefined and numbers', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(1500)).toBe('1500');
  });
});

describe('uniqueAnswers', () => {
  it('keeps only the first answer per question', () => {
    const answers = [
      { questionId: 'q1', selectedOptionId: 'a' },
      { questionId: 'q1', selectedOptionId: 'a' },
      { questionId: 'q2', selectedOptionId: 'b' },
      { questionId: 'q1', selectedOptionId: 'c' },
    ];
    expect(uniqueAnswers(answers, 'questionId')).toEqual([
      { questionId: 'q1', selectedOptionId: 'a' },
      { questionId: 'q2', selectedOptionId: 'b' },
    ]);
  });
});

describe('settings validators', () => {
  it('accepts only hex accent colours', () => {
    expect(safeAccentColor('#9d2bee')).toBe('#9d2bee');
    expect(safeAccentColor('#fff')).toBe('#fff');
    expect(safeAccentColor('red; background:url(x)')).toBeNull();
    expect(safeAccentColor(null)).toBeNull();
  });

  it('accepts only well-formed analytics ids', () => {
    expect(safeGoogleAnalyticsId(' G-ABC123XYZ ')).toBe('G-ABC123XYZ');
    expect(safeGoogleAnalyticsId("G-1');alert(1)//")).toBeNull();
    expect(safeFacebookPixelId('123456789012345')).toBe('123456789012345');
    expect(safeFacebookPixelId('123abc')).toBeNull();
  });

  it('accepts only http(s) URLs', () => {
    expect(safeExternalUrl('https://instagram.com/rst')).toBe('https://instagram.com/rst');
    expect(safeExternalUrl('javascript:alert(1)')).toBeNull();
    expect(safeExternalUrl('not a url')).toBeNull();
    expect(safeExternalUrl('')).toBeNull();
  });
});
