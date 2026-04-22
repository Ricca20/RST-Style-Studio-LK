import slugify from 'slugify';

export function createSlug(text) {
  if (!text) return '';
  return slugify(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: false,
    trim: true
  });
}
  
