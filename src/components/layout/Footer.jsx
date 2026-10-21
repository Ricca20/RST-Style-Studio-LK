'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Mail,
  Phone,
  MapPin,
  Music,
  Headphones,
  Mic2,
  Heart,
  Home,
  Info,
  Users,
  Wrench,
  Camera,
} from 'lucide-react';

/* ─── Inline SVG Social Icons ─── */
function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692 1.197 0 1.968.125 2.154.167v2.219z" />
    </svg>
  );
}

function YoutubeIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
  );
}

function SpotifyIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function TikTokIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function XIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube', Icon: YoutubeIcon },
  { key: 'spotify', label: 'Spotify', Icon: SpotifyIcon },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { key: 'x', label: 'X', Icon: XIcon },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN FOOTER COMPONENT — DJ Hardware Chassis Design
   ═══════════════════════════════════════════════════════════════ */
export default function Footer({ info }) {
  const studioName = info?.name || 'RST Style Studio LK';
  const socials = SOCIAL_LINKS.filter(({ key }) => info?.socials?.[key]);
  const tNav = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');

  const studioLinks = [
    { href: '/', label: 'Home', Icon: Home },
    { href: '/about', label: 'About Us', Icon: Info },
    { href: '/media', label: 'Media', Icon: Camera },
    { href: '/contributors', label: 'Contributors', Icon: Users },
  ];

  const serviceLinks = [
    { href: '/songs', label: tNav('songs') || 'Portfolio', Icon: Music },
    { href: '/services', label: tNav('services') || 'Services', Icon: Wrench },
    { href: '/contact', label: tNav('contact') || 'Contact', Icon: Mail },
  ];

  return (
    <footer className="footer-root">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

        {/* ─── Main DJ Hardware Chassis ─── */}
        <div className="footer-chassis">

          {/* Corner Screws */}
          <div className="dj-screw dj-screw-tl" />
          <div className="dj-screw dj-screw-tr" />
          <div className="dj-screw dj-screw-bl" />
          <div className="dj-screw dj-screw-br" />

          {/* Edge Glow */}
          <div className="footer-edge-glow" />

          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-6">

            {/* ─── Brand Column with Logo Knob ─── */}
            <div className="lg:w-[280px] shrink-0 flex flex-col items-start">
              <div className="flex items-center gap-4 mb-3">
                {/* Logo Knob */}
                <Link href="/" title="Home" className="dj-knob-container shrink-0" style={{ width: 52, height: 52 }}>
                  <div className="dj-knob">
                    <img
                      src="/logo.png"
                      alt="RST Style Studio"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  </div>
                </Link>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    RST Style Studio
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-400/80 uppercase tracking-widest font-medium">
                      Now Mixing
                    </span>
                  </div>
                </div>
              </div>

              <p className="footer-brand-desc">
                {tFooter('description')}
              </p>

              {/* Social Knobs — only platforms with a URL in Settings */}
              {socials.length > 0 && (
                <div className="flex gap-3 mb-4">
                  {socials.map(({ key, label, Icon }) => (
                    <a
                      key={key}
                      href={info.socials[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="footer-social-knob"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              )}

              {/* Now Playing decorative slider */}
              <div className="footer-now-playing w-full">
                <span className="footer-now-playing-label">Now Playing</span>
                <div className="footer-now-playing-track">
                  <div className="footer-now-playing-fill" />
                </div>
              </div>
            </div>

            {/* ─── Separator ─── */}
            <div className="hidden lg:block footer-col-separator" />

            {/* ─── Studio Links Column ─── */}
            <div className="flex-1 min-w-0">
              <div className="footer-section-heading">
                <Music size={12} />
                <span>Studio</span>
              </div>
              <ul className="flex flex-col gap-1">
                {studioLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-nav-link">
                      <link.Icon size={14} strokeWidth={1.8} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/login"
                    className="text-white/15 hover:text-[#0ea5e9] text-[10px] transition-colors mt-2 block font-medium tracking-wide uppercase"
                  >
                    {tNav('login')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* ─── Separator ─── */}
            <div className="hidden lg:block footer-col-separator" />

            {/* ─── Services Links Column ─── */}
            <div className="flex-1 min-w-0">
              <div className="footer-section-heading">
                <Headphones size={12} />
                <span>{tNav('services')}</span>
              </div>
              <ul className="flex flex-col gap-1">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-nav-link">
                      <link.Icon size={14} strokeWidth={1.8} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Separator ─── */}
            <div className="hidden lg:block footer-col-separator" />

            {/* ─── Contact Info Column ─── */}
            <div className="flex-1 min-w-0">
              <div className="footer-section-heading">
                <Mic2 size={12} />
                <span>{tNav('contact')}</span>
              </div>
              <ul className="flex flex-col gap-2">
                {info?.email && (
                  <li className="footer-contact-row">
                    <Mail size={13} strokeWidth={1.8} />
                    <a href={`mailto:${info.email}`} className="hover:text-white transition-colors">{info.email}</a>
                  </li>
                )}
                {info?.phone && (
                  <li className="footer-contact-row">
                    <Phone size={13} strokeWidth={1.8} />
                    <a href={`tel:${info.phone.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">{info.phone}</a>
                  </li>
                )}
                <li className="footer-contact-row">
                  <MapPin size={13} strokeWidth={1.8} />
                  <span>{info?.address || 'Sri Lanka'}</span>
                </li>
              </ul>
            </div>

            {/* ─── Separator ─── */}
            <div className="hidden lg:block footer-col-separator" />

            {/* ─── CTA Knob Column ─── */}
            <div className="shrink-0 flex flex-col items-center justify-center gap-2">
              <Link href="/contact" title="Book Session" className="dj-knob-container shrink-0">
                <div className="dj-knob">
                  <div className="dj-knob-center-blue animate-pulse" />
                </div>
              </Link>
              <span className="dj-link-text text-white/40">Book</span>
            </div>

          </div>
        </div>

        {/* ─── Bottom Bar (outside chassis) ─── */}
        <div className="footer-bottom-bar">
          <p className="text-white/25 text-xs flex items-center gap-1.5">
            {info?.footerText || (
              <>
                &copy; {new Date().getFullYear()} {studioName}.{' '}
                {tFooter('rights')}.
              </>
            )}
          </p>
          <div className="flex items-center gap-1 text-white/20 text-xs">
            <span>Made with</span>
            <Heart
              size={10}
              className="text-red-500 fill-red-500 animate-pulse"
            />
            <span>in Sri Lanka</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/25 hover:text-white/60 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/25 hover:text-white/60 text-xs transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
