'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LocaleSwitcher from '@/components/shared/LocaleSwitcher';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/songs', label: t('songs') || 'Portfolio' },
    { href: '/profiles', label: t('profiles') || 'Profiles' },
    { href: '/services', label: t('services') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <>
      {/* Floating Glass Pill Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full pointer-events-none px-4">
        <nav
          className={`glass-nav pointer-events-auto w-[90%] md:w-3/4 max-w-5xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'shadow-xl border-[#9d2bee]/20' : ''
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.PNG"
              alt="RST Style Studio"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
              RST Studio
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href="/contact"
              className="hidden sm:flex bg-[#9d2bee] hover:bg-[#9d2bee]/90 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all neon-glow"
            >
              Book Session
            </Link>
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">
                {isOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[45] bg-[#151118]/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-2xl font-bold hover:text-[#9d2bee] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-4 bg-[#9d2bee] text-white px-8 py-3 rounded-full font-bold neon-glow"
            onClick={() => setIsOpen(false)}
          >
            Book Session
          </Link>
        </div>
      )}
    </>
  );
}
