import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export function createSlug(text) {
  if (!text) return '';
  
  let slug = text.toLowerCase()
    .replace(/\s+/g, '-') // replace spaces with dashes
    .replace(/[^a-z0-9\u0D80-\u0DFF\-]/g, '') // keep alphanumeric, Sinhala, and dashes
    .replace(/-+/g, '-') // remove consecutive dashes
    .replace(/^-+|-+$/g, ''); // trim dashes from ends

  // If entirely stripped (e.g., only punctuation), fallback to uuid
  if (!slug || slug.trim() === '') {
    slug = uuidv4().split('-')[0];
  }
  
  return slug;
}
