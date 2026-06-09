import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/db';
import { t } from '@/lib/t';

export default async function HomePage({ params }) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'Hero' });
  const tStats = await getTranslations({ locale, namespace: 'Stats' });

  // Fetch data from Prisma — fallback gracefully if DB is unavailable
  let featuredSongs = [];
  let featuredProjects = [];
  let services = [];
  try {
    featuredSongs = await prisma.song.findMany({
      where: { isFeatured: true },
      take: 6,
      include: { contributions: { include: { contributor: true } } },
    });
    featuredProjects = await prisma.project.findMany({
      where: { isFeatured: true },
      take: 3,
    });
    services = await prisma.service.findMany({
      where: { isActive: true },
      take: 4,
    });
  } catch (e) {}

  const firstFeatured = featuredSongs[0];

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Full-Screen Video Background
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            poster="/logo.PNG"
          >
            <source src="/Herovideo.MP4" type="video/mp4" />
          </video>
          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151118] via-transparent to-[#151118]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-32">
          {/* Status Badge */}
          <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 mb-8">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
              Premium Production House
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
            {tHero('title')}
          </h1>

          {/* Subtitle */}
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            {tHero('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="flex items-center justify-center h-14 px-10 bg-[#9d2bee] hover:bg-[#9d2bee]/90 text-white text-base font-bold rounded-full transition-all neon-glow"
            >
              {tHero('cta')}
            </Link>
            <Link
              href="/songs"
              className="flex items-center justify-center h-14 px-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-bold rounded-full backdrop-blur-sm transition-all"
            >
              <span className="material-symbols-outlined mr-2 text-lg">play_arrow</span>
              Listen to Works
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED RELEASE — Audio Player Section
          ═══════════════════════════════════════════════════════════ */}
      {firstFeatured && (
        <section className="py-24 px-6 md:px-20 bg-[#151118]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <span className="material-symbols-outlined text-[#9d2bee]">stars</span>
              <h2 className="text-sm font-bold text-[#9d2bee] uppercase tracking-widest">
                Featured Release
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-10 bg-[#1e1823] rounded-3xl p-6 md:p-10 border border-white/5">
              {/* Album Art */}
              <div className="w-full md:w-72 aspect-square rounded-2xl overflow-hidden shrink-0 shadow-2xl">
                {firstFeatured.coverImage ? (
                  <img
                    src={firstFeatured.coverImage}
                    alt={t(firstFeatured, 'title', locale)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#322839] flex items-center justify-center">
                    <span className="material-symbols-outlined text-7xl text-white/20">album</span>
                  </div>
                )}
              </div>

              {/* Song Details */}
              <div className="flex flex-col justify-center flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {t(firstFeatured, 'title', locale)}
                </h3>
                <p className="text-[#9d2bee] font-medium mb-6">
                  {firstFeatured.genres && firstFeatured.genres.length > 0 ? firstFeatured.genres[0] : 'Original'}
                </p>

                {/* Waveform Visualization (decorative) */}
                <div className="flex items-center gap-[2px] h-10 mb-6 opacity-60">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full"
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                        backgroundColor: i < 12 ? '#9d2bee' : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/songs/${firstFeatured.slug}`}
                    className="flex items-center gap-2 h-12 px-8 bg-[#9d2bee] text-white font-bold rounded-full neon-glow transition-all hover:bg-[#9d2bee]/90"
                  >
                    <span className="material-symbols-outlined">play_arrow</span>
                    Listen Now
                  </Link>
                  {firstFeatured.spotifyUrl && (
                    <a
                      href={firstFeatured.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 h-12 px-8 bg-white/5 border border-white/10 text-white font-bold rounded-full transition-all hover:bg-white/10"
                    >
                      Open Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SELECTED PRODUCTIONS — Song Grid
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-20 bg-[#0f0d11]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-sm font-bold text-[#9d2bee] uppercase tracking-widest mb-2">
                Selected Works
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Featured Tracks
              </h3>
            </div>
            <Link
              href="/songs"
              className="text-[#9d2bee] hover:text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSongs.slice(0, 6).map((song) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-[#1e1823]"
              >
                {/* Cover */}
                <div className="absolute inset-0">
                  {song.coverImage ? (
                    <img
                      src={song.coverImage}
                      alt={t(song, 'title', locale)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1e1823] to-[#322839] flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-white/10">music_note</span>
                    </div>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-6">
                  {/* Play Button */}
                  <div className="self-end">
                    <span className="material-symbols-outlined text-white/60">more_horiz</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 group-hover:scale-100 transition-transform duration-300">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#9d2bee] text-white shadow-[0_0_30px_rgba(157,43,238,0.5)]">
                      <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
                    </div>
                  </div>
                  {/* Bottom Info */}
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white text-xl font-bold leading-tight">
                      {t(song, 'title', locale)}
                    </h4>
                      <div className="absolute bottom-4 left-4 bg-[#9d2bee] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {song.genres && song.genres.length > 0
                          ? song.genres[0]
                          : 'RST Studio'}
                      </div>
                  </div>
                </div>

                {/* Default Bottom Gradient (visible when not hovered) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 group-hover:opacity-0 transition-opacity">
                  <h4 className="text-white font-bold text-lg">{t(song, 'title', locale)}</h4>
                  <p className="text-white/50 text-sm">{song.genres && song.genres.length > 0 ? song.genres[0] : 'Original'}</p>
                </div>
              </Link>
            ))}
          </div>

          {featuredSongs.length === 0 && (
            <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#1e1823]">
              <span className="material-symbols-outlined text-5xl text-white/10 mb-4 block">library_music</span>
              <p className="text-white/40">No featured songs yet. Add them from the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES PREVIEW
          ═══════════════════════════════════════════════════════════ */}
      {services.length > 0 && (
        <section className="py-24 px-6 md:px-20 bg-[#151118]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold text-[#9d2bee] uppercase tracking-widest mb-2">
                Our Expertise
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Premium Services
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc) => (
                <Link
                  key={svc.id}
                  href={`/services`}
                  className="group bg-[#1e1823] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#9d2bee]/30 hover:shadow-[0_0_25px_rgba(157,43,238,0.15)]"
                >
                  <div className="w-12 h-12 rounded-full bg-[#9d2bee]/20 flex items-center justify-center text-[#9d2bee] mb-5">
                    <span className="material-symbols-outlined">{svc.icon || 'music_note'}</span>
                  </div>
                  <h4 className="text-white text-xl font-bold mb-3">
                    {t(svc, 'name', locale)}
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mb-4">
                    {t(svc, 'description', locale) || 'Professional studio service.'}
                  </p>
                  <div className="flex items-center gap-1 text-[#9d2bee] text-sm font-bold group-hover:translate-x-1 transition-transform">
                    Learn More
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#0f0d11] relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9d2bee]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <div className="text-5xl font-black mb-2 text-white">50+</div>
            <div className="text-white/40 font-medium tracking-widest uppercase text-xs">
              {tStats('songs')}
            </div>
          </div>
          <div className="p-4">
            <div className="text-5xl font-black mb-2 text-white">120+</div>
            <div className="text-white/40 font-medium tracking-widest uppercase text-xs">
              {tStats('projects')}
            </div>
          </div>
          <div className="p-4">
            <div className="text-5xl font-black mb-2 text-white">30+</div>
            <div className="text-white/40 font-medium tracking-widest uppercase text-xs">
              {tStats('contributors')}
            </div>
          </div>
          <div className="p-4">
            <div className="text-5xl font-black mb-2 text-white">10+</div>
            <div className="text-white/40 font-medium tracking-widest uppercase text-xs">
              {tStats('years')}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — Book a Session
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#151118]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9d2bee]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            READY TO MAKE <br />
            <span className="text-[#9d2bee]">HISTORY?</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Our schedule fills up fast. Book your session now to lock in your time with our engineers.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-16 px-12 bg-[#9d2bee] hover:bg-[#9d2bee]/90 text-white text-xl font-bold rounded-full neon-glow transition-all transform hover:-translate-y-1 shadow-2xl shadow-[#9d2bee]/30"
          >
            Book A Session
          </Link>
        </div>
      </section>
    </div>
  );
}
