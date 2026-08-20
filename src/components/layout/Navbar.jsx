'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LocaleSwitcher from '@/components/shared/LocaleSwitcher';
import { useState, useEffect } from 'react';
import MagneticButton from '@/components/ui/MagneticButton';
import { Home, Info, Music, Users, Wrench, Mail, VolumeX, Volume2, Camera } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [volume, setVolume] = useState(0.5); // Master volume state (0 to 1)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') || 'Home' },
    { href: '/about', label: t('about') || 'About' },
    { href: '/media', label: 'Media' },
    { href: '/contributors', label: 'Contributors' },
    { href: '/songs', label: t('songs') || 'Portfolio' },
    { href: '/services', label: t('services') || 'Services' },
    { href: '/contact', label: t('contact') || 'Contact' },
  ];

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full pointer-events-none px-4">
        {/* Main DJ Hardware Chassis */}
        <nav className="dj-chassis pointer-events-auto flex items-center justify-between px-3 py-3 w-fit gap-6 transition-transform duration-500">
          
          {/* Screws */}
          <div className="dj-screw dj-screw-tl" />
          <div className="dj-screw dj-screw-tr" />
          <div className="dj-screw dj-screw-bl" />
          <div className="dj-screw dj-screw-br" />

          {/* Left Knob */}
          <div className="dj-knob-container shrink-0">
            <div className="dj-knob">
              <div className="dj-knob-center-blue" />
            </div>
          </div>

          {/* Blue Separator */}
          <div className="dj-separator-blue shrink-0" />

          {/* Left Links */}
          <div className="hidden lg:flex items-center gap-6 px-2">
            {navLinks.slice(0, 3).map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              
              let Icon = Home;
              if (link.href === '/about') Icon = Info;
              if (link.href === '/media') Icon = Camera;

              return (
                <Link key={link.href} href={link.href} className={`dj-link-blue ${isActive ? 'active' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
                  <span className="dj-link-text">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Center Slider (Master Volume Control) */}
          <div className="hidden md:flex flex-col items-center justify-center shrink-0 mx-2">
            <div className="flex items-center gap-3">
              <VolumeX size={14} className="text-white/30" />
              <div className="dj-slider-track relative w-[120px]">
                {/* Invisible native range input for perfect drag accessibility */}
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Master Volume"
                />
                {/* Visual hardware handle */}
                <div 
                  className="dj-slider-handle pointer-events-none" 
                  style={{ left: `${volume * 100}%`, transform: 'translateX(-50%)' }} 
                />
              </div>
              <Volume2 size={14} className="text-white/30" />
            </div>
          </div>

          {/* Right Links */}
          <div className="hidden lg:flex items-center gap-6 px-2">
            {navLinks.slice(3).map((link) => {
              const isActive = pathname.startsWith(link.href);
              
              let Icon = Music;
              if (link.href === '/contributors') Icon = Users;
              if (link.href === '/services') Icon = Wrench;
              if (link.href === '/contact') Icon = Mail;

              return (
                <Link key={link.href} href={link.href} className={`dj-link-blue ${isActive ? 'active' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
                  <span className="dj-link-text">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Locale Switcher (Hidden on small screens to preserve the layout) */}
          <div className="hidden xl:block px-2">
            <LocaleSwitcher />
          </div>

          {/* Right Knob */}
          <MagneticButton>
            <div className="dj-knob-container shrink-0">
              <div className="dj-knob">
                <div className="dj-knob-center-blue animate-pulse" />
              </div>
            </div>
          </MagneticButton>

          {/* Mobile Menu Toggle (Only visible on small screens) */}
          <button
            className="lg:hidden text-white/70 hover:text-white p-2 shrink-0 ml-2 z-10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[45] bg-[#0f172a]/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-2xl font-bold hover:text-[#0ea5e9] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-4 bg-[#0ea5e9] text-white px-8 py-3 rounded-full font-bold neon-glow"
            onClick={() => setIsOpen(false)}
          >
            Book Session
          </Link>
        </div>
      )}
    </>
  );
}
