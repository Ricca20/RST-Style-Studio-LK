import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export function createSlug(text) {
  if (!text) return '';
  let slug = slugify(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    trim: true
  });

  // If strict mode stripped all characters (e.g., pure Sinhala text without transliteration)
  if (!slug || slug.trim() === '') {
    slug = uuidv4().split('-')[0];
  }
  
  return slug;
}
