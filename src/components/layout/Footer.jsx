'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Heart } from 'lucide-react';
import Vinyl from '@/components/music/Vinyl';
import Equalizer from '@/components/music/Equalizer';
import PillLink from '@/components/music/PillLink';

const SOCIAL_LABELS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  spotify: 'Spotify',
  tiktok: 'TikTok',
  x: 'X',
};

/**
 * Site footer. `info` comes from the locale layout (StudioSettings, with URLs
 * already sanitised): name, email, phone, address, footerText and socials.
 */
export default function Footer({ info }) {
  const tNav = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');
  const studioName = info?.name || 'RST Style Studio LK';
  const socials = Object.entries(SOCIAL_LABELS).filter(([key]) => info?.socials?.[key]);

  const pages = [
    { href: '/songs', label: tNav('songs') },
    { href: '/projects', label: tNav('projects') },
    { href: '/contributors', label: tNav('contributors') },
    { href: '/services', label: tNav('services') },
    { href: '/about', label: tNav('about') },
    { href: '/media', label: 'Media' },
    { href: '/games', label: 'Arcade' },
    { href: '/contact', label: tNav('contact') },
  ];

  return (
    <footer className="bg-ink text-paper rounded-t-[2.5rem] mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-20">
        {/* Tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div>
            <p className="eyebrow text-paper/50 mb-6 flex items-center gap-3">
              <Equalizer bars={4} className="h-3 text-lime" /> Outro
            </p>
            <h2 className="display text-[clamp(3rem,8vw,7rem)]">
              Always chasing<br />
              the <span className="text-lime">perfect take.</span>
            </h2>
            <div className="mt-10">
              <PillLink href="/quote" variant="lime">{tNav('getQuote')}</PillLink>
            </div>
          </div>
          <div className="w-44 md:w-64 shrink-0 self-center">
            <Vinyl spinning label="RST" />
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-20 pt-12 border-t border-paper/10">
          <div>
            <h3 className="eyebrow text-paper/40 mb-5">Studio</h3>
            <p className="text-paper/70 text-sm leading-relaxed max-w-xs">{tFooter('description')}</p>
          </div>

          <div>
            <h3 className="eyebrow text-paper/40 mb-5">Pages</h3>
            <ul className="grid gap-2.5 text-sm">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-paper/80 hover:text-lime transition-colors">{p.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-paper/40 mb-5">{tNav('contact')}</h3>
            <ul className="grid gap-2.5 text-sm text-paper/80">
              {info?.email && (
                <li><a href={`mailto:${info.email}`} className="hover:text-lime transition-colors break-all">{info.email}</a></li>
              )}
              {info?.phone && (
                <li><a href={`tel:${info.phone.replace(/[^\d+]/g, '')}`} className="hover:text-lime transition-colors">{info.phone}</a></li>
              )}
              <li className="text-paper/60">{info?.address || 'Sri Lanka'}</li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-paper/40 mb-5">Follow</h3>
            {socials.length > 0 ? (
              <ul className="grid gap-2.5 text-sm">
                {socials.map(([key, label]) => (
                  <li key={key}>
                    <a href={info.socials[key]} target="_blank" rel="noopener noreferrer" className="text-paper/80 hover:text-lime transition-colors">
                      {label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-paper/50">Coming soon</p>
            )}
            <Link href="/login" className="inline-block mt-6 text-xs text-paper/30 hover:text-paper/70 transition-colors">{tNav('login')}</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-8 mt-12 border-t border-paper/10 text-xs text-paper/50">
          <p>
            {info?.footerText || <>&copy; {new Date().getFullYear()} {studioName}. {tFooter('rights')}.</>}
          </p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 fill-lime text-lime" /> in Sri Lanka
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-paper transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-paper transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <p aria-hidden="true" className="display text-[22vw] leading-[0.75] text-paper/[0.06] text-center select-none -mb-[3vw] whitespace-nowrap">
        RST STYLE
      </p>
    </footer>
  );
}
