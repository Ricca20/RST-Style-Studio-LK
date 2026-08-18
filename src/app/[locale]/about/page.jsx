import { Link } from '@/i18n/routing';
import TiltCard from '@/components/ui/TiltCard';

export async function generateMetadata() {
  return {
    title: 'About Our Laboratory | RST Studio',
    description: 'Learn about our acoustic engineering philosophy, analog hardware arsenal, and lead sound sculptors.',
  };
}

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-32 relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0ea5e9]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: THE COMPOSER & MUSICAL LEGACY (MAESTRO TRIBUTE)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-10 max-w-7xl mx-auto relative z-10">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#0ea5e9]/20 via-[#9d2bee]/15 to-transparent rounded-full blur-[130px] pointer-events-none" />

        <div className="flex flex-col gap-3 mb-16 text-center">
          <div className="inline-flex items-center gap-2.5 self-center px-4 py-1.5 rounded-full bg-black/60 border border-[#0ea5e9]/40 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-[0.25em] shadow-[0_0_25px_rgba(14,165,233,0.25)] backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse shadow-[0_0_8px_#0ea5e9]" />
            Foundational Heritage // Maestro Archive
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-cyan-200 to-[#9d2bee]">COMPOSER&apos;S</span> SOUL
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Before digital processing and analog summing desks, RST Style Studio was founded on a lifetime of orchestral storytelling and melody.
          </p>
        </div>

        {/* 3D Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          {/* Left Column (5 Cols): Dedicated 3D Holographic Portrait Pedestal (ONLY Image 1) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <TiltCard>
              <div className="group relative aerospace-card rounded-[2.5rem] p-4 border border-white/20 hover:border-[#0ea5e9]/80 transition-all duration-700 shadow-[0_20px_70px_rgba(14,165,233,0.2)] bg-gradient-to-b from-white/[0.08] via-black/80 to-black/95 overflow-hidden">
                
                {/* Subtle corner light accents */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-[#0ea5e9]/20 rounded-full blur-xl group-hover:bg-[#0ea5e9]/40 transition-all" />
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#9d2bee]/20 rounded-full blur-xl group-hover:bg-[#9d2bee]/40 transition-all" />

                {/* Main Portrait Display */}
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative shadow-2xl border border-white/10">
                  <img
                    src="/sampath1.jpg"
                    alt="Founding Composer Portrait"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  
                  {/* Cinematic Dark & Neon Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-65 transition-opacity" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    <span className="px-3 py-1 rounded-full bg-black/70 border border-white/20 text-white/90 font-mono text-[11px] font-bold tracking-wider backdrop-blur-md">
                      ARCHIVAL RECORDING
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/50 text-[#0ea5e9] font-mono text-[11px] font-bold tracking-wider backdrop-blur-md">
                      MAESTRO
                    </span>
                  </div>

                  {/* Bottom Audio Visualizer & Title Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 z-20">
                    <div className="flex items-end gap-1.5 mb-3 h-5 opacity-80">
                      <span className="w-1 bg-[#0ea5e9] rounded-full h-3 animate-pulse" />
                      <span className="w-1 bg-[#0ea5e9] rounded-full h-5 animate-pulse delay-75" />
                      <span className="w-1 bg-cyan-300 rounded-full h-2 animate-pulse delay-150" />
                      <span className="w-1 bg-[#9d2bee] rounded-full h-4 animate-pulse delay-100" />
                      <span className="w-1 bg-white rounded-full h-3 animate-pulse" />
                      <span className="text-[10px] font-mono text-slate-300 ml-2 tracking-widest uppercase">
                        HARMONIC FREQUENCY ARCHIVE
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#0ea5e9] uppercase tracking-[0.25em] block mb-1">
                      Founding Visionary
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                      THE COMPOSER
                    </h3>
                  </div>
                </div>

                {/* Footer Telemetry Bar */}
                <div className="pt-4 px-3 flex items-center justify-between font-mono text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                    LEGACY ACOUSTICS
                  </span>
                  <span className="text-white font-bold tracking-widest">RST FOUNDATION</span>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Column (7 Cols): Spacious Storyline, Biography Box & 3D Interactive Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            
            {/* Main Narrative Card */}
            <div className="aerospace-card rounded-[2.5rem] p-8 sm:p-10 border border-white/20 bg-gradient-to-br from-white/[0.08] via-black/70 to-black/90 shadow-2xl relative overflow-hidden">
              
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3.5 py-1.5 rounded-xl bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 text-[#0ea5e9] font-mono text-xs font-bold uppercase tracking-wider">
                  BIOGRAPHY &amp; VISION
                </span>
                <span className="text-xs font-mono text-slate-400">ACOUSTIC ORIGINS</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Where Orchestral Storytelling Meets Modern Sound Engineering
              </h3>

              {/* Highlight Quote Banner */}
              <div className="border-l-4 border-[#0ea5e9] pl-6 py-4 my-6 bg-gradient-to-r from-[#0ea5e9]/15 via-white/[0.02] to-transparent rounded-r-2xl border-t border-r border-b border-white/10">
                <p className="text-slate-100 text-lg italic font-medium leading-relaxed">
                  &quot;Great production does not begin with machines—it begins with understanding the emotion, melody, and humanity behind every note.&quot;
                </p>
              </div>

              {/* Dedicated Spacious Description Box Ready for User Content */}
              <div className="space-y-4 text-slate-200 text-base leading-relaxed font-light mt-6">
                <p className="p-5 rounded-2xl bg-white/[0.04] border border-white/15 text-slate-100 leading-relaxed shadow-inner">
                  RST Style Studio was built upon the lifetime legacy of our founding composer. Decades of arranging orchestral pieces, scoring cinematic productions, and mentoring musicians laid the blueprint for our studio&apos;s acoustic philosophy.
                </p>
                
                {/* Space reserved for user biography */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0ea5e9]/10 to-purple-500/10 border border-dashed border-[#0ea5e9]/40 text-slate-300 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#0ea5e9] font-mono font-bold uppercase tracking-wider text-xs">
                      ✦ COMPOSER STORY &amp; MILESTONES
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">[ RESERVED SPACE ]</span>
                  </div>
                  <p className="text-slate-300 font-light">
                    We have designed this dedicated narrative space to accommodate your full biographical tribute, stories, and musical achievements.
                  </p>
                </div>
              </div>
            </div>

            {/* 3D Interactive Legacy Pillars (3 Sleek Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  id: '01',
                  title: 'Harmonic Mastery',
                  desc: 'Orchestral arrangements & melody structuring.',
                  accent: 'from-[#0ea5e9]/20 to-transparent',
                  border: 'hover:border-[#0ea5e9]'
                },
                {
                  id: '02',
                  title: 'Cultural Roots',
                  desc: 'Authentic Sri Lankan musical traditions.',
                  accent: 'from-cyan-500/20 to-transparent',
                  border: 'hover:border-cyan-400'
                },
                {
                  id: '03',
                  title: 'Acoustic Soul',
                  desc: 'The guiding philosophy behind RST Studio.',
                  accent: 'from-[#9d2bee]/20 to-transparent',
                  border: 'hover:border-[#9d2bee]'
                }
              ].map((pillar, idx) => (
                <TiltCard key={idx}>
                  <div className={`group aerospace-card rounded-2xl p-5 border border-white/15 ${pillar.border} transition-all duration-500 bg-gradient-to-b ${pillar.accent} h-full flex flex-col justify-between shadow-lg`}>
                    <div className="flex items-center justify-between mb-3 font-mono text-xs text-slate-400">
                      <span className="text-[#0ea5e9] font-bold">{pillar.id}</span>
                      <span>PILLAR</span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white mb-1.5 group-hover:text-[#0ea5e9] transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-light leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: 3D STUDIO EVOLUTION JOURNEY (3 ALTERNATING STAGES)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-10 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-4 mb-20 text-center">
          <div className="inline-flex items-center gap-2.5 self-center px-4 py-1.5 rounded-full bg-black/60 border border-[#9d2bee]/40 text-[#9d2bee] text-xs font-mono font-bold uppercase tracking-[0.25em] shadow-[0_0_25px_rgba(157,43,238,0.25)] backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-[#9d2bee] animate-pulse shadow-[0_0_8px_#9d2bee]" />
            Evolutionary Timeline // From Genesis to 64-Bit
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            THE STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-white to-[#9d2bee]">EVOLUTION</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Experience the architectural and sonic transformation of RST Style Studio—from our first intimate acoustic setup to our current high-headroom hybrid mastering sanctuary.
          </p>
        </div>

        {/* 3D Alternating Holographic Journey */}
        <div className="flex flex-col gap-24 relative">
          
          {/* Central Holographic Laser Spine Line on Desktop */}
          <div className="hidden lg:block absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-[#0ea5e9] via-[#9d2bee] to-[#0ea5e9] opacity-40 shadow-[0_0_25px_#0ea5e9] rounded-full" />

          {/* ───────────────────────────────────────────────────────────
              STAGE 01: THE BEGINNING (/Studio1.jpg)
              ─────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative">
            
            {/* Center Node Indicator on Desktop */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-[#0ea5e9] items-center justify-center z-30 shadow-[0_0_20px_#0ea5e9]">
              <span className="w-3 h-3 rounded-full bg-[#0ea5e9]" />
            </div>

            {/* Left: 3D Holographic Stage Image Frame */}
            <div className="lg:col-span-6 lg:pr-8">
              <TiltCard>
                <div className="group relative aerospace-card rounded-3xl p-4 border border-white/20 hover:border-[#0ea5e9] transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white/[0.08] to-black/90">
                  {/* Holographic Corner Crosshairs */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#0ea5e9] z-20" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#0ea5e9] z-20" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#0ea5e9] z-20" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#0ea5e9] z-20" />

                  <div className="aspect-video rounded-2xl bg-black/60 relative overflow-hidden">
                    <img
                      src="/studio1.jpg"
                      alt="Studio Stage 01 - The Beginning"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                    
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full bg-[#0ea5e9]/90 text-white font-mono text-xs font-bold tracking-widest shadow-[0_0_15px_#0ea5e9]">
                        STAGE 01 // GENESIS
                      </span>
                      <span className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-white/10">
                        ORIGINS
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h4 className="text-xl font-black text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        The First Acoustic Sanctuary
                      </h4>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Right: 3D Holographic Specification & Description Card */}
            <div className="lg:col-span-6 lg:pl-8">
              <div className="aerospace-card rounded-3xl p-8 sm:p-10 border border-white/20 bg-gradient-to-br from-white/[0.07] via-black/70 to-black/95 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#0ea5e9] uppercase tracking-[0.2em]">
                    CHAPTER 01 // EARLY BEGINNINGS
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#0ea5e9] shadow-[0_0_10px_#0ea5e9]" />
                </div>

                <h3 className="text-3xl font-black text-white mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  Foundational Acoustic Engineering
                </h3>

                {/* Spacious Description Card ready for User Story */}
                <div className="space-y-4 text-slate-200 text-base leading-relaxed font-light mb-8">
                  <p className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    Our earliest studio setup was built with an uncompromising focus on acoustic purity. Designed to capture organic instruments and warm vocals, the room laid the foundation for our signature sound.
                  </p>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/20 text-slate-300 text-sm">
                    <span className="text-[#0ea5e9] font-mono font-bold uppercase block mb-1">
                      [ RESERVED FOR YOUR EARLY STUDIO STORY ]
                    </span>
                    Add your story about how the studio first opened, the original instruments, acoustic treatments, and early sessions here.
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 flex flex-wrap gap-2.5 font-mono text-xs">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-[#0ea5e9] font-bold">
                    ACOUSTIC PANELS
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-slate-200">
                    ANALOG TRACKING
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ───────────────────────────────────────────────────────────
              STAGE 02: HARDWARE & ANALOG EXPANSION (/studio2.jpg)
              ─────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative">
            
            {/* Center Node Indicator on Desktop */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-[#9d2bee] items-center justify-center z-30 shadow-[0_0_20px_#9d2bee]">
              <span className="w-3 h-3 rounded-full bg-[#9d2bee]" />
            </div>

            {/* Left on Desktop: 3D Holographic Specification & Description Card */}
            <div className="lg:col-span-6 lg:pr-8 order-2 lg:order-1">
              <div className="aerospace-card rounded-3xl p-8 sm:p-10 border border-white/20 bg-gradient-to-br from-white/[0.07] via-black/70 to-black/95 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#9d2bee] uppercase tracking-[0.2em]">
                    CHAPTER 02 // CONSOLE ERA
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#9d2bee] shadow-[0_0_10px_#9d2bee]" />
                </div>

                <h3 className="text-3xl font-black text-white mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  Analog Hardware & Summing Expansion
                </h3>

                {/* Spacious Description Card ready for User Story */}
                <div className="space-y-4 text-slate-200 text-base leading-relaxed font-light mb-8">
                  <p className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    As production demands scaled, we integrated professional analog summing consoles, outboard compression racks, and high-voltage preamps to impart undeniable analog weight and harmonic warmth.
                  </p>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/20 text-slate-300 text-sm">
                    <span className="text-[#9d2bee] font-mono font-bold uppercase block mb-1">
                      [ RESERVED FOR YOUR CONSOLE EXPANSION STORY ]
                    </span>
                    Add your story detailing how the studio acquired its consoles, upgraded hardware racks, and transformed its mixing workflow here.
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 flex flex-wrap gap-2.5 font-mono text-xs">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-[#9d2bee] font-bold">
                    SUMMING MIXERS
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-slate-200">
                    OUTBOARD COMPRESSION
                  </span>
                </div>
              </div>
            </div>

            {/* Right on Desktop: 3D Holographic Stage Image Frame */}
            <div className="lg:col-span-6 lg:pl-8 order-1 lg:order-2">
              <TiltCard>
                <div className="group relative aerospace-card rounded-3xl p-4 border border-white/20 hover:border-[#9d2bee] transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white/[0.08] to-black/90">
                  {/* Holographic Corner Crosshairs */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#9d2bee] z-20" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#9d2bee] z-20" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#9d2bee] z-20" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#9d2bee] z-20" />

                  <div className="aspect-video rounded-2xl bg-black/60 relative overflow-hidden">
                    <img
                      src="/studio2.jpg"
                      alt="Studio Stage 02 - Hardware Expansion"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                    
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full bg-[#9d2bee]/90 text-white font-mono text-xs font-bold tracking-widest shadow-[0_0_15px_#9d2bee]">
                        STAGE 02 // HARDWARE ERA
                      </span>
                      <span className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-white/10">
                        EXPANSION
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h4 className="text-xl font-black text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        Analog Summing Powerhouse
                      </h4>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

          </div>

          {/* ───────────────────────────────────────────────────────────
              STAGE 03: MODERN HYBRID SANCTUARY (/studio3.jpg)
              ─────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative">
            
            {/* Center Node Indicator on Desktop */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-green-400 items-center justify-center z-30 shadow-[0_0_20px_rgba(74,222,128,0.8)]">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-ping" />
            </div>

            {/* Left: 3D Holographic Stage Image Frame */}
            <div className="lg:col-span-6 lg:pr-8">
              <TiltCard>
                <div className="group relative aerospace-card rounded-3xl p-4 border border-white/20 hover:border-green-400 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white/[0.08] to-black/90">
                  {/* Holographic Corner Crosshairs */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-green-400 z-20" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-green-400 z-20" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-green-400 z-20" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-green-400 z-20" />

                  <div className="aspect-video rounded-2xl bg-black/60 relative overflow-hidden">
                    <img
                      src="/studio3.jpg"
                      alt="Studio Stage 03 - Current Process"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                    
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full bg-green-500/90 text-white font-mono text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.8)] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        STAGE 03 // CURRENT ERA
                      </span>
                      <span className="font-mono text-xs text-green-300 font-bold uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-green-500/30">
                        ACTIVE SANCTUARY
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h4 className="text-xl font-black text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        64-Bit Hybrid Mastering Control Room
                      </h4>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Right: 3D Holographic Specification & Description Card */}
            <div className="lg:col-span-6 lg:pl-8">
              <div className="aerospace-card rounded-3xl p-8 sm:p-10 border border-white/20 bg-gradient-to-br from-white/[0.07] via-black/70 to-black/95 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-green-400 uppercase tracking-[0.2em]">
                    CHAPTER 03 // TODAY & THE FUTURE
                  </span>
                  <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse" />
                </div>

                <h3 className="text-3xl font-black text-white mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  State-of-the-Art Hybrid Process
                </h3>

                {/* Spacious Description Card ready for User Story */}
                <div className="space-y-4 text-slate-200 text-base leading-relaxed font-light mb-8">
                  <p className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    Today, RST Style Studio represents the pinnacle of modern audio production—seamlessly uniting analog summing character with 64-bit precision digital mastering for commercial chart releases.
                  </p>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/20 text-slate-300 text-sm">
                    <span className="text-green-400 font-mono font-bold uppercase block mb-1">
                      [ RESERVED FOR CURRENT PROCESS STORY ]
                    </span>
                    Add your description of how sessions are engineered today, your modern equipment workflow, and your artistic vision here.
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 flex flex-wrap gap-2.5 font-mono text-xs">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-green-500/30 text-green-400 font-bold">
                    64-BIT DSP MASTERING
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-slate-200">
                    HYBRID SIGNAL CHAIN
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: THE ARCHITECT (FOUNDER DOSSIER)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-[#0ea5e9] font-mono text-xs font-bold tracking-widest uppercase">
            Lead Acoustic Specialist
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#0ea5e9] to-[#9d2bee]">ARCHITECT</span>
          </h2>
        </div>

        <div className="relative aerospace-container rounded-[3rem] p-8 md:p-14 overflow-hidden">
          {/* Hardware Screws */}
          <div className="absolute top-4 left-4 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
          <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
          <div className="absolute bottom-4 left-4 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
          <div className="absolute bottom-4 right-4 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Portrait */}
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl bg-black/40 border border-white/15">
                <img
                  src="/hero2.jpg"
                  alt="Ricky Perera at Console"
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-block px-3 py-1 rounded-md bg-[#0ea5e9] text-white font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                    Founder // Lead Engineer
                  </div>
                  <h3 className="text-white text-3xl font-black tracking-tight">RST Studio</h3>
                </div>
              </div>
            </div>

            {/* Engineering Bio */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full gap-8">
              <div>
                <span className="material-symbols-outlined text-5xl text-[#0ea5e9]/40 mb-4 block">format_quote</span>
                <p className="text-white text-xl sm:text-2xl font-light leading-relaxed mb-6 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                  &quot;Our obsession has always been the acoustic space between the notes. We engineered RST Style Studio from the ground up to capture the raw emotional intensity of a live performance while delivering the surgical 64-bit clarity required by modern global streaming standards.&quot;
                </p>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  With over a decade of analog hardware experimentation and digital signal processing research, we have cultivated an unmistakable sonic signature that makes Sri Lankan chart-toppers sound wider, punchier, and deeper.
                </p>
              </div>

              {/* Studio Stats Frame */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 font-mono">
                <div className="bg-white/[0.04] backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-white block">10+</span>
                  <span className="text-[11px] text-slate-400 uppercase">YEARS INDUSTRY EXP</span>
                </div>
                <div className="bg-white/[0.04] backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-[#0ea5e9] block">100+</span>
                  <span className="text-[11px] text-slate-400 uppercase">MASTERED TRACKS</span>
                </div>
                <div className="bg-white/[0.04] backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-white block">120+</span>
                  <span className="text-[11px] text-slate-400 uppercase">STUDIO SESSIONS</span>
                </div>
                <div className="bg-white/[0.04] backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-purple-400 block">∞</span>
                  <span className="text-[11px] text-slate-400 uppercase">SONIC PASSION</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: MUSIC GENRES (3D HOLOGRAPHIC SAMPLE MATRIX)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#0ea5e9] font-mono text-xs font-bold tracking-widest uppercase block mb-2">
            Sonic Versatility // Holographic Matrix
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            MUSIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-cyan-300 to-purple-400">GENRES</span>
          </h2>
          <p className="text-slate-200 max-w-xl mx-auto text-sm md:text-base font-light">
            No musical style is out of bounds. We engineer everything from rich acoustic &amp; traditional Sri Lankan compositions to hard-hitting commercial and electronic productions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Pop & Acoustic Unplugged', bpm: 'ORGANIC VOCALS', level: '99%', color: 'from-cyan-500 to-blue-600', tag: 'VOCAL FOCUS' },
            { name: 'R&B / Soul / Hip-Hop', bpm: '70-105 BPM', level: '98%', color: 'from-purple-500 to-pink-600', tag: 'DEEP SUB BASS' },
            { name: 'Cinematic & Orchestral', bpm: 'FULL DYNAMICS', level: '100%', color: 'from-amber-500 to-orange-600', tag: 'FILM SCORE' },
            { name: 'Electronic & Synthwave', bpm: '115-140 BPM', level: '99%', color: 'from-emerald-500 to-teal-600', tag: 'HYPER WIDE' },
            { name: 'Traditional & Baila Fusion', bpm: 'PERCUSSIVE', level: '97%', color: 'from-rose-500 to-red-600', tag: 'SRI LANKAN ROOTS' },
            { name: 'Rock & Alternative', bpm: 'LIVE DRUMS', level: '98%', color: 'from-blue-500 to-indigo-600', tag: 'ANALOG PUNCH' },
            { name: 'Commercial & Jingles', bpm: 'BROADCAST READY', level: '100%', color: 'from-yellow-500 to-amber-600', tag: 'LUFS OPTIMIZED' },
            { name: '3D Spatial Audio', bpm: 'DOLBY ATMOS', level: '100%', color: 'from-fuchsia-500 to-purple-600', tag: 'IMMERSIVE 3D' },
          ].map((genre, idx) => (
            <TiltCard key={idx}>
              <div className="group relative aerospace-card p-6 rounded-3xl border border-white/15 hover:border-[#0ea5e9]/60 transition-all duration-500 shadow-xl overflow-hidden flex flex-col justify-between h-48 bg-gradient-to-br from-white/[0.05] via-black/70 to-black/95">
                {/* Holographic Corner Crosshairs */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30 group-hover:border-[#0ea5e9]" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30 group-hover:border-[#0ea5e9]" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30 group-hover:border-[#0ea5e9]" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30 group-hover:border-[#0ea5e9]" />

                {/* Top Header */}
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-bold">
                    GENRE 0{idx + 1}
                  </span>
                  <span className="text-[#0ea5e9] font-bold tracking-wider">{genre.tag}</span>
                </div>

                {/* Center Title */}
                <div className="my-2">
                  <h3 className="text-lg font-black text-white group-hover:text-[#0ea5e9] transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {genre.name}
                  </h3>
                </div>

                {/* Bottom LED Meter & BPM */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-1.5">
                    <span>{genre.bpm}</span>
                    <span className="text-green-400 font-bold">{genre.level}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div className={`h-full bg-gradient-to-r ${genre.color} rounded-full group-hover:brightness-125 transition-all duration-500`} style={{ width: genre.level }} />
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: FOOTER BOOKING CTA DESK (3D HOLOGRAPHIC CONSOLE)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-10 max-w-7xl mx-auto">
        <TiltCard>
          <div className="relative aerospace-container rounded-[3rem] p-10 md:p-20 text-center border border-white/25 shadow-[0_0_80px_rgba(14,165,233,0.2)] overflow-hidden">
            {/* Corner Decorative Screws */}
            <div className="absolute top-6 left-6 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
            <div className="absolute top-6 right-6 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
            <div className="absolute bottom-6 left-6 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>
            <div className="absolute bottom-6 right-6 w-5 h-5 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[10px]">+</div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0ea5e9]/15 border border-[#0ea5e9]/40 text-[#0ea5e9] font-mono text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-ping" />
                SESSION BOOKING CONSOLE ACTIVE
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
                READY TO RECORD <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#0ea5e9] to-cyan-400">YOUR NEXT HIT?</span>
              </h2>
              <p className="text-slate-200 text-base md:text-lg mb-10 font-light leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] max-w-2xl mx-auto">
                Our studio schedule locks in fast. Launch our interactive 3D quotation desk or connect directly with our engineering team.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Link
                  href="/quote"
                  className="h-16 px-10 rounded-full bg-gradient-to-r from-[#0ea5e9] to-cyan-500 hover:from-cyan-500 hover:to-[#0ea5e9] text-white font-black text-lg tracking-wide flex items-center justify-center transition-all shadow-[0_0_35px_rgba(14,165,233,0.7)] hover:scale-105"
                >
                  Launch Quote Wizard
                </Link>
                <Link
                  href="/contact"
                  className="h-16 px-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-lg tracking-wide flex items-center justify-center transition-all backdrop-blur-md hover:scale-105"
                >
                  Direct Inquiry
                </Link>
              </div>
            </div>
          </div>
        </TiltCard>
      </section>
    </div>
  );
}
