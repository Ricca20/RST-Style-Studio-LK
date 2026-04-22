export function t(item, field, locale) {
  if (!item) return '';

  const keySi = `${field}Si`;
  const keyEn = `${field}En`;
  const keyIt = `${field}It`;

  if (locale === 'si' && item[keySi]) return item[keySi];
  if (locale === 'it' && item[keyIt]) return item[keyIt];
  if (locale === 'en' && item[keyEn]) return item[keyEn];

  return item[keyEn] || item[keySi] || item[keyIt] || '';
}
  
