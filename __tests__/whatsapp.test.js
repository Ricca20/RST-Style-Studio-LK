import { describe, it, expect } from 'vitest';
import { buildWhatsAppUrl } from '../src/lib/whatsapp';

describe('buildWhatsAppUrl', () => {
  it('should format phone number by removing non-digits and URL encode message', () => {
    const phone = '+94 77 123 4567';
    const message = 'Hello RST Style Studio!';
    
    const url = buildWhatsAppUrl(phone, message);
    
    expect(url).toBe('https://wa.me/94771234567?text=Hello%20RST%20Style%20Studio!');
  });

  it('should handle multiline messages correctly', () => {
    const phone = '1234567890';
    const message = 'Line 1\nLine 2\nLine 3';
    
    const url = buildWhatsAppUrl(phone, message);
    
    expect(url).toBe('https://wa.me/1234567890?text=Line%201%0ALine%202%0ALine%203');
  });

  it('should strip special characters from phone number', () => {
    const phone = '(123) 456-7890';
    const message = 'Test';
    
    const url = buildWhatsAppUrl(phone, message);
    
    expect(url).toBe('https://wa.me/1234567890?text=Test');
  });
});
