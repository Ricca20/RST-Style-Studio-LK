'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useRef, useState } from 'react';
import * as motion from 'framer-motion/client';
import {
  Mail,
  Phone,
  MapPin,
  Music,
  Headphones,
  Mic2,
  ArrowUpRight,
  Heart,
} from 'lucide-react';

/* ─── Inline SVG Social Icons (brand icons removed from lucide) ─── */
function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692 1.197 0 1.968.125 2.154.167v2.219z" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
  );
}

/* ─── Animated Equalizer Bars ─── */
function EqualizerBars({ count = 5, className = '' }) {
  return (
    <div className={`flex items-end gap-[3px] h-8 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-[#0ea5e9] to-[#7dd3fc]"
          style={{
            animation: `equalizer ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.1}s`,
            height: '30%',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Floating Vinyl Disc ─── */
function VinylDisc() {
  return (
    <div className="footer-vinyl-container">
      <div className="footer-vinyl">
        {/* Grooves */}
        <div className="footer-vinyl-groove footer-vinyl-groove-1" />
        <div className="footer-vinyl-groove footer-vinyl-groove-2" />
        <div className="footer-vinyl-groove footer-vinyl-groove-3" />
        {/* Label */}
        <div className="footer-vinyl-label">
          <div className="footer-vinyl-label-inner">
            <span className="text-[6px] font-bold tracking-[0.2em] text-white/80 uppercase">
              RST
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Waveform Line (decorative audio wave) ─── */
function WaveformLine() {
  return (
    <svg
      viewBox="0 0 600 40"
      className="w-full h-8 opacity-20"
      preserveAspectRatio="none"
    >
      <path
        d="M0,20 Q25,5 50,20 Q75,35 100,20 Q125,5 150,20 Q175,35 200,20 Q225,5 250,20 Q275,35 300,20 Q325,5 350,20 Q375,35 400,20 Q425,5 450,20 Q475,35 500,20 Q525,5 550,20 Q575,35 600,20"
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="2"
        className="footer-waveform-path"
      />
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor="#0ea5e9" />
          <stop offset="80%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Social Icon Button with 3D hover ─── */
function SocialButton({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-social-btn group"
    >
      <div className="footer-social-btn-inner">
        {children}
      </div>
    </a>
  );
}

/* ─── Footer Link with arrow ─── */
function FooterLink({ href, children }) {
  return (
    <Link href={href} className="footer-link group">
      <span className="footer-link-dot" />
      <span className="footer-link-text">{children}</span>
      <ArrowUpRight
        size={12}
        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#0ea5e9]"
      />
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN FOOTER COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Footer() {
  const tNav = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');
  const footerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -2, y: x * 2 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <footer className="footer-3d-root">
      {/* Background Glow Effects */}
      <div className="footer-bg-glow footer-bg-glow-left" />
      <div className="footer-bg-glow footer-bg-glow-right" />
      <div className="footer-bg-grid" />

      {/* Waveform Divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
        <WaveformLine />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* ─── Top Section: 3D Console Panel ─── */}
        <div
          ref={footerRef}
          className="footer-console perspective-1200"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="footer-console-inner preserve-3d"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            {/* Corner screws (matching navbar) */}
            <div className="dj-screw dj-screw-tl" />
            <div className="dj-screw dj-screw-tr" />
            <div className="dj-screw dj-screw-bl" />
            <div className="dj-screw dj-screw-br" />

            {/* Edge Light */}
            <div className="footer-edge-light" />

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 p-6 sm:p-10">
              {/* ─── Brand Column ─── */}
              <div className="lg:w-[320px] shrink-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="footer-logo-ring">
                    <img
                      src="/logo.PNG"
                      alt="RST Style Studio"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white tracking-tight">
                      RST Style Studio
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-medium">
                        Now Mixing
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  {tFooter('description')}
                </p>

                {/* Equalizer + Vinyl */}
                <div className="flex items-center gap-4 mb-6">
                  <EqualizerBars count={7} />
                  <VinylDisc />
                  <EqualizerBars count={7} />
                </div>

                {/* Social Icons */}
                <div className="flex gap-3">
                  <SocialButton href="#" label="Instagram">
                    <InstagramIcon size={16} />
                  </SocialButton>
                  <SocialButton href="#" label="Facebook">
                    <FacebookIcon size={16} />
                  </SocialButton>
                  <SocialButton href="#" label="YouTube">
                    <YoutubeIcon size={16} />
                  </SocialButton>
                </div>
              </div>

              {/* ─── Neon Separator (vertical) ─── */}
              <div className="hidden lg:block footer-neon-divider" />

              {/* ─── Links Grid ─── */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
                {/* Studio Links */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Music size={14} className="text-[#0ea5e9]" />
                    <h5 className="footer-section-title">Studio</h5>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    <li><FooterLink href="/about">About Us</FooterLink></li>
                    <li><FooterLink href="/songs">Portfolio</FooterLink></li>
                    <li><FooterLink href="/profiles">Profiles</FooterLink></li>
                    <li>
                      <Link
                        href="/admin"
                        className="text-white/20 hover:text-[#0ea5e9] text-[11px] transition-colors mt-2 block font-medium tracking-wide"
                      >
                        {tNav('login')}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Services Links */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Headphones size={14} className="text-[#0ea5e9]" />
                    <h5 className="footer-section-title">{tNav('services')}</h5>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    <li><FooterLink href="/services">All Services</FooterLink></li>
                    <li><FooterLink href="/quote">{tNav('getQuote')}</FooterLink></li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-5">
                    <Mic2 size={14} className="text-[#0ea5e9]" />
                    <h5 className="footer-section-title">{tNav('contact')}</h5>
                  </div>
                  <ul className="flex flex-col gap-3">
                    <li className="footer-contact-item">
                      <div className="footer-contact-icon">
                        <Mail size={12} />
                      </div>
                      <span>hello@rststylestudiolk.com</span>
                    </li>
                    <li className="footer-contact-item">
                      <div className="footer-contact-icon">
                        <Phone size={12} />
                      </div>
                      <span>+94 77 123 4567</span>
                    </li>
                    <li className="footer-contact-item">
                      <div className="footer-contact-icon">
                        <MapPin size={12} />
                      </div>
                      <span>Sri Lanka</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="footer-bottom-bar">
          <p className="text-white/25 text-xs flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} RST Style Studio LK.{' '}
            {tFooter('rights')}.
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
            <a
              href="#"
              className="text-white/25 hover:text-white/60 text-xs transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/25 hover:text-white/60 text-xs transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
