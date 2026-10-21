import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Hosts are grouped by what needs them:
//  - Google Fonts: Material Symbols stylesheet imported in globals.css
//  - googletagmanager / google-analytics: GoogleAnalytics component (StudioSettings.googleAnalyticsId)
//  - connect.facebook.net / facebook.com: FacebookPixel component (StudioSettings.facebookPixelId)
//  - supabase.co: storage for images and Name That Tune audio clips
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data: https://*.supabase.co https://i.ytimg.com https://*.scdn.co https://graph.facebook.com https://www.facebook.com https://www.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self' blob: https://*.supabase.co",
  "font-src 'self' data: https://fonts.gstatic.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'self' https://www.youtube.com https://open.spotify.com",
  "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net",
  "report-uri /api/csp-report",
].join('; ') + ';';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // /profiles duplicated /contributors; keep old links working
  async redirects() {
    return [
      { source: '/profiles', destination: '/contributors', permanent: true },
      { source: '/profiles/:slug', destination: '/contributors/:slug', permanent: true },
      { source: '/:locale(si|en|it)/profiles', destination: '/:locale/contributors', permanent: true },
      { source: '/:locale(si|en|it)/profiles/:slug', destination: '/:locale/contributors/:slug', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()', // Pitch Match uses the mic
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
