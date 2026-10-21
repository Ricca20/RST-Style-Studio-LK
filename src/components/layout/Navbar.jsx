'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { X } from 'lucide-react';
import LocaleSwitcher from '@/components/shared/LocaleSwitcher';
import Equalizer from '@/components/music/Equalizer';
import Vinyl from '@/components/music/Vinyl';
import PillLink from '@/components/music/PillLink';

// Mirrors StudioSettings.bookingStatus
const BOOKING_PILL = {
  AVAILABLE: { text: 'Booking sessions now', dot: 'bg-emerald-500' },
  BUSY: { text: 'Limited slots this month', dot: 'bg-amber-500' },
  AWAY: { text: 'Fully booked', dot: 'bg-red-500' },
};

function Logo({ tone = 'ink', onClick }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-3 shrink-0" aria-label="RST Style Studio — home">
      <span className="relative w-10 h-10 rounded-full overflow-hidden bg-ink ring-2 ring-lime/80">
        <Image src="/logo.png" alt="" fill sizes="40px" className="object-cover" priority />
      </span>
      <span className="leading-none">
        <span className={`block font-display font-extrabold text-xl tracking-tight ${tone === 'paper' ? 'text-paper' : 'text-ink'}`}>RST</span>
        <span className={`block eyebrow text-[0.58rem] ${tone === 'paper' ? 'text-paper/60' : 'text-smoke'}`}>Style Studio LK</span>
      </span>
    </Link>
  );
}

export default function Navbar({ showLocaleSwitcher = true, bookingStatus = 'AVAILABLE', socials = {}, email = null }) {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll and listen for Escape while the menu is open
  const onKeyDown = useEffectEvent((e) => {
    if (e.key === 'Escape') setIsOpen(false);
  });
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const links = [
    { href: '/', label: t('home') },
    { href: '/songs', label: t('songs') },
    { href: '/projects', label: t('projects') },
    { href: '/contributors', label: t('contributors') },
    { href: '/services', label: t('services') },
    { href: '/about', label: t('about') },
    { href: '/media', label: 'Media' },
    { href: '/games', label: 'Arcade' },
    { href: '/contact', label: t('contact') },
  ];
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const booking = BOOKING_PILL[bookingStatus] || BOOKING_PILL.AVAILABLE;
  const socialEntries = Object.entries(socials).filter(([, url]) => url);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-paper/85 backdrop-blur-md border-b border-ink/10' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto h-20 px-5 md:px-10 flex items-center justify-between gap-4">
          <Logo />

          <Link
            href="/contact"
            className="hidden lg:inline-flex items-center gap-3 rounded-full border border-ink/15 bg-paper/60 px-4 py-2 text-sm font-semibold hover:border-ink/40 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${booking.dot}`} />
            {booking.text}
            <Equalizer bars={4} className="h-3.5 text-ink" />
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block">
              <PillLink href="/quote" variant="lime">{t('getQuote')}</PillLink>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
              className="w-12 h-12 rounded-full bg-ink text-paper flex flex-col items-center justify-center gap-1.5 hover:bg-ink-2 transition-colors"
            >
              <span className="block w-5 h-0.5 bg-current rounded-full" />
              <span className="block w-3 h-0.5 bg-current rounded-full ml-2" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu, styled as a tracklist */}
      <div
        className={`fixed inset-0 z-[60] bg-ink text-paper transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? '[clip-path:circle(150%_at_calc(100%-3.5rem)_2.5rem)]' : '[clip-path:circle(0%_at_calc(100%-3.5rem)_2.5rem)] pointer-events-none'}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto h-20 px-5 md:px-10 flex items-center justify-between">
            <Logo tone="paper" onClick={close} />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="w-12 h-12 rounded-full bg-lime text-ink flex items-center justify-center hover:rotate-90 transition-transform duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 grid lg:grid-cols-[1fr_22rem] gap-12">
            <nav aria-label="Main">
              <p className="eyebrow text-paper/40 mb-4">Tracklist — {links.length} tracks</p>
              <ol>
                {links.map((link, i) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="group flex items-baseline gap-5 py-2 md:py-2.5 border-b border-paper/10"
                    >
                      <span className="font-display text-sm text-paper/40 tabular-nums w-8">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`display text-[clamp(2.25rem,6.5vw,4.75rem)] transition-all duration-300 group-hover:translate-x-3 group-hover:text-lime ${isActive(link.href) ? 'text-lime' : ''}`}>
                        {link.label}
                      </span>
                      {isActive(link.href) && <Equalizer bars={4} className="h-5 text-lime self-center" />}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <aside className="flex flex-col gap-8 lg:pt-10">
              <div className="w-48 lg:w-full max-w-[18rem]">
                <Vinyl spinning label="RST" />
              </div>
              <PillLink href="/quote" variant="lime" className="self-start">{t('getQuote')}</PillLink>
              {showLocaleSwitcher && <LocaleSwitcher tone="paper" />}
              {email && (
                <a href={`mailto:${email}`} className="text-paper/70 hover:text-lime transition-colors break-all">{email}</a>
              )}
              {socialEntries.length > 0 && (
                <ul className="flex flex-wrap gap-x-5 gap-y-2 eyebrow text-paper/60">
                  {socialEntries.map(([name, url]) => (
                    <li key={name}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-lime transition-colors">{name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
