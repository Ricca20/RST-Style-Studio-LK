'use client';

import { useState } from 'react';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Share2,
  Radio,
  Mic,
  Calendar,
  Sparkles,
  Sliders,
  Music2
} from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/services/whatsapp';

// Brand SVGs
const InstagramIcon = () => (
  <svg className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const SpotifyIcon = () => (
  <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14.5c2.5 1 5.5 1 8 0"></path>
    <path d="M6.5 11.5c3.5 1.5 7.5 1.5 11 0"></path>
    <path d="M5 8.5c4.5 2 9.5 2 14 0"></path>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

export default function ContactClient({ settings = null, locale = 'en' }) {
  const [name, setName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Vocal Tracking & Recording');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Contact addresses & Social networks
  const contactPhone = settings?.phone || '+94 77 123 4567';
  const contactEmail = settings?.email || 'hello@rststylestudiolk.com';
  const contactAddress = settings?.address || 'Colombo / Gampaha, Sri Lanka';
  const whatsappNumber = settings?.whatsapp || settings?.phone || '+94771234567';

  const socialLinks = [
    {
      id: 'INSTAGRAM',
      name: 'Instagram',
      handle: '@rststylestudio',
      url: settings?.instagramUrl || 'https://instagram.com',
      icon: <InstagramIcon />,
      color: 'from-pink-500/15 via-purple-500/15 to-orange-500/15',
      borderColor: 'border-pink-500/30 hover:border-pink-500',
      badge: 'STORY & REELS',
    },
    {
      id: 'YOUTUBE',
      name: 'YouTube',
      handle: 'RST Style Studio LK',
      url: settings?.youtubeUrl || 'https://youtube.com',
      icon: <YouTubeIcon />,
      color: 'from-red-600/15 to-red-900/15',
      borderColor: 'border-red-500/30 hover:border-red-500',
      badge: 'STUDIO MASTERS & VIDEOS',
    },
    {
      id: 'FACEBOOK',
      name: 'Facebook',
      handle: 'RST Style Studio LK',
      url: settings?.facebookUrl || 'https://facebook.com',
      icon: <FacebookIcon />,
      color: 'from-blue-600/15 to-blue-900/15',
      borderColor: 'border-blue-500/30 hover:border-blue-500',
      badge: 'NEWS & RELEASES',
    },
    {
      id: 'SPOTIFY',
      name: 'Spotify',
      handle: 'RST Style Studio Catalog',
      url: settings?.spotifyUrl || 'https://spotify.com',
      icon: <SpotifyIcon />,
      color: 'from-green-600/15 to-green-900/15',
      borderColor: 'border-green-500/30 hover:border-green-500',
      badge: 'OFFICIAL PLAYLISTS',
    },
    {
      id: 'TIKTOK',
      name: 'TikTok',
      handle: '@rststylestudio',
      url: settings?.tiktokUrl || 'https://tiktok.com',
      icon: <TikTokIcon />,
      color: 'from-cyan-500/15 to-purple-500/15',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500',
      badge: 'BEHIND THE SCENES',
    },
    {
      id: 'WHATSAPP',
      name: 'WhatsApp Desk',
      handle: contactPhone,
      url: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`,
      icon: <MessageCircle className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/15 to-emerald-900/15',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500',
      badge: 'DIRECT INQUIRY',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please enter your Name, Email, and Phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          artistName,
          email,
          phone,
          service,
          preferredDate,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to transmit inquiry.');
      }

      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Transmission error. You can also contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsAppInquiry = () => {
    const text = `Hello RST Style Studio!\n\nI am *${name}*${artistName ? ` (${artistName})` : ''}.\n\n*Service:* ${service}\n*Preferred Date:* ${preferredDate || 'Flexible'}\n*Email:* ${email}\n\n*Notes:*\n${notes || 'N/A'}`;
    const waUrl = buildWhatsAppUrl(whatsappNumber, text);
    window.open(waUrl, '_blank');
  };

  const openMailTo = () => {
    const subject = encodeURIComponent(`Studio Booking Inquiry: ${name} (${service})`);
    const body = encodeURIComponent(
      `Hello RST Style Studio,\n\nName: ${name}\nArtist/Band: ${artistName || 'N/A'}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nPreferred Session Date: ${preferredDate || 'Flexible'}\n\nNotes:\n${notes || 'N/A'}`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col gap-16">
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: STUDIO SOCIAL CHANNELS & DIRECTORY DESK
          ═══════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-2">
              <Share2 className="w-3.5 h-3.5" /> OFFICIAL COMMUNITY & DIRECTORY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              CONNECT ON <span className="text-[#0ea5e9]">ALL CHANNELS</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-md font-light">
            Follow our studio sessions, hear recent master drops, or connect directly on our official social networks.
          </p>
        </div>

        {/* Social Media Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-gradient-to-br ${social.color} bg-black/70 backdrop-blur-xl p-6 rounded-3xl border ${social.borderColor} transition-all duration-300 shadow-xl flex items-center justify-between gap-4 overflow-hidden cursor-pointer`}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-black/80 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                  {social.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono font-bold text-[#0ea5e9] uppercase tracking-widest block mb-1">
                    {social.badge}
                  </span>
                  <h3 className="text-xl font-black text-white truncate group-hover:text-[#0ea5e9] transition-colors leading-tight">
                    {social.name}
                  </h3>
                  <p className="text-xs font-mono text-gray-400 truncate mt-0.5">{social.handle}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#0ea5e9] text-gray-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Physical Address & Quick Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9] shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">STUDIO LOCATION</span>
              <span className="text-sm font-bold text-white block truncate">{contactAddress}</span>
            </div>
          </div>

          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9] shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">STUDIO DESK PHONE</span>
              <a href={`tel:${contactPhone}`} className="text-sm font-bold text-white hover:text-[#0ea5e9] transition-colors block truncate">
                {contactPhone}
              </a>
            </div>
          </div>

          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9] shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">DIRECT EMAIL</span>
              <a href={`mailto:${contactEmail}`} className="text-sm font-bold text-white hover:text-[#0ea5e9] transition-colors block truncate">
                {contactEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: ANALOG STUDIO RESERVATION & EMAIL FORM
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="relative bg-black/80 backdrop-blur-2xl rounded-[3rem] border border-[#0ea5e9]/40 p-6 sm:p-12 shadow-[0_0_80px_rgba(14,165,233,0.2)] overflow-hidden">
          {/* Top Edge Lighting */}
          <div className="absolute top-0 left-16 right-16 h-1 bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent shadow-[0_0_20px_#0ea5e9]" />

          {/* Hardware Corner Screws */}
          <div className="absolute top-4 left-4 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
          <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
          <div className="absolute bottom-4 left-4 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
          <div className="absolute bottom-4 right-4 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
            <div>
              <span className="text-xs font-mono text-[#0ea5e9] uppercase tracking-widest block font-bold mb-1">
                ANALOG MASTER CONSOLE • DIRECT TRANSMISSION
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                STUDIO SESSION & EMAIL BOOKING DESK
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-green-400 bg-green-950/40 px-4 py-2 rounded-full border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>EMAIL & WHATSAPP GATEWAY ACTIVE</span>
            </div>
          </div>

          {isSubmitted ? (
            /* Submission Success State */
            <div className="py-12 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-[#0ea5e9]" />
              </div>
              <h4 className="text-3xl font-black text-white mb-3">INQUIRY TRANSMITTED SUCCESSFULLY!</h4>
              <p className="text-gray-300 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Thank you, <strong className="text-white">{name}</strong>! Your message has been sent directly to our studio engineers. We will contact you at <strong className="text-[#0ea5e9]">{phone}</strong> or <strong className="text-[#0ea5e9]">{email}</strong> shortly.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={openWhatsAppInquiry}
                  className="px-6 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Open Copy in WhatsApp
                </button>
                <button
                  type="button"
                  onClick={openMailTo}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" /> Send Copy via Email Client
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setName('');
                    setArtistName('');
                    setEmail('');
                    setPhone('');
                    setNotes('');
                  }}
                  className="px-6 py-4 rounded-2xl bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  New Booking
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm font-mono">
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Name & Artist Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    CH 01 : Contact Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kasun Perera"
                    className="h-12 w-full rounded-xl border border-white/15 bg-black/60 px-4 text-white placeholder-gray-500 focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/30 focus:outline-none transition-all font-mono text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    CH 02 : Artist / Band Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="e.g. Neon Skyline"
                    className="h-12 w-full rounded-xl border border-white/15 bg-black/60 px-4 text-white placeholder-gray-500 focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/30 focus:outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    CH 03 : Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="h-12 w-full rounded-xl border border-white/15 bg-black/60 px-4 text-white placeholder-gray-500 focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/30 focus:outline-none transition-all font-mono text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    CH 04 : WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="h-12 w-full rounded-xl border border-white/15 bg-black/60 px-4 text-white placeholder-gray-500 focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/30 focus:outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Service Selection Presets */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                  CH 05 : SELECT PRIMARY SERVICE REQUIRED
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Vocal Tracking & Recording', icon: <Mic className="w-5 h-5" /> },
                    { label: 'Analog Mixing & Mastering', icon: <Sliders className="w-5 h-5" /> },
                    { label: 'Full Song Production', icon: <Music2 className="w-5 h-5" /> },
                    { label: 'Music Video / Commercial', icon: <Sparkles className="w-5 h-5" /> },
                  ].map((preset) => {
                    const isSelected = service === preset.label;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setService(preset.label)}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-white shadow-[0_0_20px_rgba(14,165,233,0.35)]'
                            : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <div className={isSelected ? 'text-[#0ea5e9]' : 'text-gray-400'}>
                          {preset.icon}
                        </div>
                        <span className="text-xs font-mono font-bold uppercase leading-tight">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Date */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                  CH 06 : Preferred Session Date (Optional)
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/15 bg-black/60 px-4 text-white focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/30 focus:outline-none transition-all font-mono text-sm [color-scheme:dark]"
                />
              </div>

              {/* Notes / Specification */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                  CH 07 : Project Specification / Notes
                </label>
                <textarea
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your project vision, target tempo, instrumentation needs, or questions..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-4 text-white placeholder-gray-500 focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/30 focus:outline-none transition-all font-mono text-sm resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-gray-400">
                  <span className="text-[#0ea5e9] font-bold">INSTANT EMAIL DISPATCH</span> • DIRECT TO STUDIO ENGINEERS
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 h-16 rounded-2xl bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee] hover:opacity-95 disabled:opacity-50 text-white font-mono font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'TRANSMITTING REQUEST...' : 'TRANSMIT INQUIRY & SEND EMAIL'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
