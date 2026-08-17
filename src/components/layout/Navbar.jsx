'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LocaleSwitcher from '@/components/shared/LocaleSwitcher';
import { useState, useEffect } from 'react';
import MagneticButton from '@/components/ui/MagneticButton';
import { Home, Info, Music, Users, Wrench, Mail, VolumeX, Volume2, Camera, Menu, X } from 'lucide-react';

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
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-between items-center w-full pointer-events-none px-6">
        
        {/* Invisible Spacer to perfectly counter-balance the menu button and keep the chassis dead-center on mobile */}
        <div className="w-12 h-12 lg:hidden pointer-events-none" />

        {/* Main DJ Hardware Chassis */}
        <nav className={`dj-chassis pointer-events-auto flex items-center justify-center px-4 py-3 w-fit gap-6 transition-all duration-500 hover:scale-[1.02] ${isOpen ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
          
          {/* Screws */}
          <div className="dj-screw dj-screw-tl" />
          <div className="dj-screw dj-screw-tr" />
          <div className="dj-screw dj-screw-bl" />
          <div className="dj-screw dj-screw-br" />

          {/* Left Knob (Home) */}
          <Link href="/" title="Home" className="dj-knob-container shrink-0">
            <div className="dj-knob">
              <div className="dj-knob-center-blue" />
            </div>
          </Link>

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

          {/* Right Knob (Book Session) */}
          <MagneticButton>
            <Link href="/contact" title="Book Session" className="dj-knob-container shrink-0">
              <div className="dj-knob">
                <div className="dj-knob-center-blue animate-pulse" />
              </div>
            </Link>
          </MagneticButton>
        </nav>

        {/* Mobile Menu Toggle (Detached from chassis for perfect pill symmetry) */}
        <button
          className="lg:hidden pointer-events-auto flex items-center justify-center w-12 h-12 text-white/90 hover:text-white bg-[#0f172a]/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl transition-all"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      <div 
        className={`fixed inset-0 z-[45] flex justify-end lg:hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div 
          className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
        <div 
          className={`relative w-72 h-full bg-[#1e293b]/90 border-l border-[#0ea5e9]/20 shadow-2xl backdrop-blur-xl flex flex-col pt-28 px-8 gap-6 transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {navLinks.map((link, idx) => {
            let Icon = Home;
            if (link.href === '/about') Icon = Info;
            if (link.href === '/media') Icon = Camera;
            if (link.href === '/contributors') Icon = Users;
            if (link.href === '/songs') Icon = Music;
            if (link.href === '/services') Icon = Wrench;
            if (link.href === '/contact') Icon = Mail;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 text-white/80 hover:text-white text-lg font-medium tracking-wide transition-all duration-300 transform ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                style={{ transitionDelay: `${isOpen ? idx * 50 + 150 : 0}ms` }}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="text-[#0ea5e9]" />
                {link.label}
              </Link>
            );
          })}
          
          <div className={`mt-8 transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${isOpen ? navLinks.length * 50 + 200 : 0}ms` }}>
            <Link
              href="/contact"
              className="w-full flex items-center justify-center bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/50 hover:bg-[#0ea5e9] hover:text-white px-6 py-3 rounded-xl font-semibold transition-all neon-glow"
              onClick={() => setIsOpen(false)}
            >
              Book Session
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
