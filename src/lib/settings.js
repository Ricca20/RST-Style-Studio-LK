import { cache } from 'react';
import prisma from '@/lib/db';

// Fields that are safe to expose to the public site. Never add private fields
// here (e.g. adminAlertEmail).
const PUBLIC_SETTINGS_SELECT = {
  name: true,
  email: true,
  phone: true,
  whatsapp: true,
  address: true,
  maintenanceMode: true,
  defaultCurrency: true,
  facebookUrl: true,
  youtubeUrl: true,
  spotifyUrl: true,
  instagramUrl: true,
  tiktokUrl: true,
  xUrl: true,
  metaTitle: true,
  metaDescription: true,
  ogImageUrl: true,
  googleAnalyticsId: true,
  facebookPixelId: true,
  accentColor: true,
  enableAnimations: true,
  bookingStatus: true,
  minimumQuotationBudget: true,
  taxRate: true,
  enableMultiLanguage: true,
  enableLiveChat: true,
  displayClientReviews: true,
  autoPlayMusic: true,
  footerText: true,
};

/**
 * Loads the public subset of StudioSettings once per request (deduped across
 * generateMetadata and the layout). Returns null if the DB is unavailable so
 * the site still renders with its built-in defaults.
 */
export const getPublicSettings = cache(async () => {
  try {
    return await prisma.studioSettings.findFirst({ select: PUBLIC_SETTINGS_SELECT });
  } catch (error) {
    console.error('Failed to load studio settings:', error);
    return null;
  }
});

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const GA_ID = /^G-[A-Z0-9]{4,20}$/i;
const PIXEL_ID = /^\d{5,20}$/;

// These values are interpolated into CSS and inline scripts, so only accept
// well-formed values rather than trusting the stored string.
export function safeAccentColor(value) {
  return value && HEX_COLOR.test(value) ? value : null;
}

export function safeGoogleAnalyticsId(value) {
  return value && GA_ID.test(value.trim()) ? value.trim() : null;
}

export function safeFacebookPixelId(value) {
  return value && PIXEL_ID.test(value.trim()) ? value.trim() : null;
}

/** Only http(s) links are rendered, so a stored `javascript:` URL can't become a link. */
export function safeExternalUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}
