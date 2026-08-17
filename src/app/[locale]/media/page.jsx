import React from 'react';
import MediaGalleryClient from '@/components/public/MediaGalleryClient';

export const metadata = {
  title: 'Visual Studio Archive & Media Vault | RST Style Studio',
  description: 'Explore our 3D holographic gallery of studio hardware, acoustic rooms, recording sessions, and master productions engineered at RST Style Studio.',
};

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-transparent text-white pt-28 pb-32 relative overflow-hidden">
      {/* Background Holographic Atmosphere */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#0ea5e9]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Hero Header Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-10 pt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-ping" />
              64-BIT VISUAL ARCHIVE ONLINE
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
              STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-white to-cyan-300">MEDIA</span>
            </h1>
          </div>
          <p className="text-slate-200 max-w-md text-sm md:text-base leading-relaxed font-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            Take a 3D interactive tour through our acoustic recording suites, legendary hardware consoles, and live studio tracking sessions.
          </p>
        </div>
      </section>

      {/* Main 3D Interactive Gallery */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 pt-8">
        <MediaGalleryClient />
      </main>
    </div>
  );
}
