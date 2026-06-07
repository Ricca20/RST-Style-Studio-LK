import { Link } from '@/i18n/routing';

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-[#151118] pt-24">
      {/* Hero Section */}
      <section className="relative flex min-h-[75vh] w-full flex-col justify-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-gradient-to-b from-[#9d2bee]/10 via-[#151118] to-[#151118]" />
        </div>
        <div className="relative z-10 px-6 md:px-40 flex flex-1 flex-col justify-center items-center text-center">
          <div className="max-w-[800px] flex flex-col gap-6">
            <div className="flex justify-center mb-4">
              <span className="px-4 py-1.5 rounded-full border border-[#9d2bee]/30 bg-[#9d2bee]/10 text-[#9d2bee] text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                Premium Production House
              </span>
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em]">
              WE DON&apos;T JUST RECORD;<br />
              <span className="text-[#9d2bee]">WE SCULPT SOUND.</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
              A sonic sanctuary built for artists who demand perfection. Experience the perfect blend of analog warmth and digital precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/songs"
                className="flex items-center justify-center rounded-full h-12 px-8 bg-[#9d2bee] hover:bg-[#9d2bee]/80 transition-all text-white text-base font-bold neon-glow"
              >
                View Our Work
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center rounded-full h-12 px-8 bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white text-base font-bold backdrop-blur-sm"
              >
                <span className="mr-2 material-symbols-outlined text-sm">play_arrow</span>
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Architect / Founder Section */}
      <section className="py-20 px-6 md:px-20 bg-[#151118]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-2 mb-10">
            <h2 className="text-[22px] font-bold leading-tight tracking-widest uppercase text-[#9d2bee]">
              The Architect
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Meet the Sound Engineer
            </h3>
          </div>
          <div className="bg-[#1E1822] border border-white/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#9d2bee]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center relative z-10">
              {/* Portrait */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-2xl bg-[#322839]">
                  <img
                    src="/logo.PNG"
                    alt="Studio Founder"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white text-2xl font-bold">RST Studio</p>
                    <p className="text-[#9d2bee] text-sm font-medium">Founder & Lead Engineer</p>
                  </div>
                </div>
              </div>
              {/* Bio */}
              <div className="flex flex-col gap-6 md:w-2/3">
                <div className="flex items-start gap-4 text-white/40">
                  <span className="material-symbols-outlined text-5xl">format_quote</span>
                </div>
                <p className="text-white/90 text-xl md:text-2xl font-light leading-relaxed">
                  &quot;Our obsession has always been the space between the notes. We built RST Style Studio to capture the raw emotion of performance while delivering the pristine clarity required by modern standards.&quot;
                </p>
                <div className="h-px w-full bg-white/10 my-2" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">10+</span>
                    <span className="text-sm text-white/50 uppercase tracking-wider">Years Exp.</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">50+</span>
                    <span className="text-sm text-white/50 uppercase tracking-wider">Songs</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">120+</span>
                    <span className="text-sm text-white/50 uppercase tracking-wider">Projects</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">∞</span>
                    <span className="text-sm text-white/50 uppercase tracking-wider">Passion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Arsenal / Gear Grid */}
      <section className="py-20 px-6 md:px-20 bg-[#151118]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[22px] font-bold leading-tight tracking-widest uppercase text-[#9d2bee]">
                The Arsenal
              </h2>
              <h3 className="text-4xl font-bold text-white tracking-tight">World-Class Gear</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gear Card 1 */}
            <div className="group bg-[#1E1822] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(157,43,238,0.2)] hover:border-[#9d2bee] cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-white">mic</span>
              </div>
              <div className="flex flex-col gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#9d2bee]/20 flex items-center justify-center text-[#9d2bee] mb-2">
                  <span className="material-symbols-outlined">mic_external_on</span>
                </div>
                <h4 className="text-xl font-bold text-white">Recording</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Professional vocal and instrument recording with pristine sound quality, featuring industry-standard microphones and preamps.
                </p>
              </div>
            </div>

            {/* Gear Card 2 */}
            <div className="group bg-[#1E1822] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(157,43,238,0.2)] hover:border-[#9d2bee] cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-white">settings_input_component</span>
              </div>
              <div className="flex flex-col gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#9d2bee]/20 flex items-center justify-center text-[#9d2bee] mb-2">
                  <span className="material-symbols-outlined">tune</span>
                </div>
                <h4 className="text-xl font-bold text-white">Mixing & Mastering</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  The heart of our studio features professional mixing and mastering capabilities with analog warmth and digital precision.
                </p>
              </div>
            </div>

            {/* Gear Card 3 */}
            <div className="group bg-[#1E1822] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(157,43,238,0.2)] hover:border-[#9d2bee] cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-white">speaker</span>
              </div>
              <div className="flex flex-col gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#9d2bee]/20 flex items-center justify-center text-[#9d2bee] mb-2">
                  <span className="material-symbols-outlined">surround_sound</span>
                </div>
                <h4 className="text-xl font-bold text-white">Production</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Full music production from beat-making to arrangement. Our acoustically treated rooms ensure your sound translates perfectly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sonic Palette */}
      <section className="py-20 px-6 md:px-20 bg-[#0F0F11] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <h2 className="text-[22px] font-bold leading-tight tracking-widest uppercase text-[#9d2bee] mb-3">
            Sonic Palette
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-12">
            No Genre Is Off Limits
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Sinhala Pop', 'R&B / Soul', 'Hip-Hop', 'Cinematic Scores', 'Electronic', 'Classical', 'Baila'].map(
              (genre) => (
                <div key={genre} className="group cursor-pointer">
                  <div className="px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm group-hover:bg-[#9d2bee] group-hover:border-[#9d2bee] transition-all duration-300">
                    <span className="text-white font-bold tracking-wide">{genre}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 md:px-20 bg-[#0F0F11] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            READY TO MAKE <br />
            <span className="text-[#9d2bee]">HISTORY?</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl">
            Our schedule fills up fast. Book your session now to lock in your time with our engineers.
          </p>
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-full h-16 px-12 bg-[#9d2bee] hover:bg-[#9d2bee]/90 transition-all text-white text-xl font-bold neon-glow shadow-2xl shadow-[#9d2bee]/40 transform hover:-translate-y-1"
          >
            Book A Session
          </Link>
        </div>
      </section>
    </div>
  );
}
