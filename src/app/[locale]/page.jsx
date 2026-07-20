import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/db';
import { t } from '@/lib/utils/t';
import Scroll3DWrapper from '@/components/ui/Scroll3DWrapper';
import TiltCard from '@/components/ui/TiltCard';
import FeaturedSongsSection from '@/components/public/FeaturedSongsSection';

export default async function HomePage({ params }) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'Hero' });

  // Fetch data from Prisma — fallback gracefully if DB is empty or unavailable
  let featuredSongs = [];
  let featuredProfiles = [];
  try {
    featuredSongs = await prisma.song.findMany({
      where: { isFeatured: true, deletedAt: null },
      take: 6,
      include: { contributions: { include: { profile: true } } },
    });
    // If no featured songs, grab latest songs
    if (!featuredSongs || featuredSongs.length === 0) {
      featuredSongs = await prisma.song.findMany({
        where: { deletedAt: null },
        take: 6,
        orderBy: { createdAt: 'desc' },
      });
    }

    featuredProfiles = await prisma.profile.findMany({
      where: { isActive: true, deletedAt: null },
      take: 4,
      orderBy: { sortOrder: 'asc' },
    });

  } catch (e) {
    console.error("Failed fetching Home Page data:", e);
  }

  return (
    <div className="flex flex-col bg-transparent text-white">
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: IMMERSIVE VIDEO VIEWPORT — Clean, no text
          The user sees ONLY the intro video on first load.
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-end overflow-hidden">
        {/* Intro Video Background — ONLY for the first section */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#060913]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/logo.PNG"
          >
            <source src="/Herovideo.MP4" type="video/mp4" />
          </video>
          {/* Gentle bottom fade to smoothly transition into the section below without blurring or dulling video clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent opacity-80 pointer-events-none" />
        </div>

        {/* Subtle bottom gradient to smoothly blend into the sections below */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060913] via-[#060913]/40 to-transparent pointer-events-none z-10" />

        {/* Scroll Indicator — minimal, floating at bottom */}
        <div className="relative z-20 flex flex-col items-center gap-2 mb-10 opacity-75 animate-pulse">
          <span className="text-[11px] font-mono text-white/70 uppercase tracking-[0.25em]">SCROLL TO EXPLORE</span>
          <div className="w-5 h-8 rounded-full border border-white/40 flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#0ea5e9] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: FEATURED RELEASES CAROUSEL
          ═══════════════════════════════════════════════════════════ */}
      <FeaturedSongsSection songs={featuredSongs} locale={locale} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: THE COLLECTIVE — SOUND ARCHITECTS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-10 relative">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[#0ea5e9] font-mono text-xs font-bold tracking-widest uppercase block mb-2">
                The Sound Architects
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                MEET THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#0ea5e9] to-[#9d2bee]">ENGINEERS</span>
              </h2>
            </div>
            <Link
              href="/profiles"
              className="inline-flex items-center gap-2 text-[#0ea5e9] hover:text-white font-bold text-sm tracking-wide uppercase transition-colors group"
            >
              <span>View Full Roster</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(featuredProfiles.length > 0 ? featuredProfiles : [
              { id: '1', name: 'RST Studio', mainRole: 'Lead Sound Engineer & Founder', bio: 'Mastering engineer with over a decade of analog recording and acoustic sculpture experience.', imageUrl: '/logo.PNG', slug: 'rst-studio' },
              { id: '2', name: 'Kasun De Silva', mainRole: 'Senior Producer & Arranger', bio: 'Specialist in modern synthwave, orchestral film scoring, and vocal harmony arrangements.', imageUrl: null, slug: 'kasun' },
              { id: '3', name: 'Thilini Perera', mainRole: 'Vocalist & Vocal Coach', bio: 'Classical and pop vocal trainer helping artists deliver emotionally resonant performances.', imageUrl: null, slug: 'thilini' },
              { id: '4', name: 'Amila Fernando', mainRole: 'Mixing & Mastering Engineer', bio: 'Dolby Atmos certified mix engineer specializing in deep bass and panoramic stereo imaging.', imageUrl: null, slug: 'amila' },
            ]).map((profile, idx) => (
              <TiltCard key={profile.id || idx}>
                <Link
                  href={`/profiles/${profile.slug || ''}`}
                  className="group relative flex flex-col aerospace-card rounded-3xl overflow-hidden h-full justify-between p-6"
                >
                  {/* Hardware Screws */}
                  <div className="absolute top-3 left-3 z-30 w-4 h-4 rounded-full bg-gray-900/80 border border-white/20 flex items-center justify-center text-white/40 text-[9px]">
                    +
                  </div>
                  <div className="absolute top-3 right-3 z-30 w-4 h-4 rounded-full bg-gray-900/80 border border-white/20 flex items-center justify-center text-white/40 text-[9px]">
                    +
                  </div>

                  <div>
                    {/* Portrait Image Container */}
                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white/[0.03] mb-6 border border-white/10">
                      {profile.imageUrl ? (
                        <img
                          src={profile.imageUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-white/10 to-transparent text-white/30">
                          <span className="material-symbols-outlined text-7xl mb-2">person</span>
                          <span className="text-[10px] font-mono tracking-widest uppercase">Engineer ID 0{idx + 1}</span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                      {/* Floating Link Arrow */}
                      <div className="absolute bottom-3 right-3 z-20 w-10 h-10 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shadow-[0_0_15px_#0ea5e9] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_outward</span>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="inline-block px-3 py-1 rounded-md bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 text-[#0ea5e9] text-[11px] font-mono font-bold uppercase tracking-wider mb-3 shadow-[0_0_10px_rgba(14,165,233,0.2)]">
                      {profile.mainRole || 'Studio Artist'}
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-[#0ea5e9] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {profile.name}
                    </h3>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-slate-200/90 text-xs sm:text-sm line-clamp-3 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />ACTIVE</span>
                    <span className="text-white/70 group-hover:text-[#0ea5e9] transition-colors">VIEW DOSSIER →</span>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: LIVE STUDIO STATS & SOCIAL PROOF COUNTERS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 bg-transparent border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'YEARS IN INDUSTRY', value: '10+', desc: 'Dedicated audio excellence', icon: 'verified' },
              { label: 'MASTERED TRACKS', value: '100+', desc: 'Across Sinhala Pop & R&B', icon: 'album' },
              { label: 'STUDIO PROJECTS', value: '120+', desc: 'Commercials, movies & albums', icon: 'graphic_eq' },
              { label: 'SONIC PASSION', value: '∞', desc: 'Uncompromised fidelity', icon: 'favorite' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="relative aerospace-card p-6 md:p-8 rounded-3xl flex flex-col items-center text-center justify-center group"
              >
                {/* Screws */}
                <div className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full bg-gray-800/80 border border-white/20 flex items-center justify-center text-white/30 text-[8px]">+</div>
                <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-gray-800/80 border border-white/20 flex items-center justify-center text-white/30 text-[8px]">+</div>
                <div className="absolute bottom-3 left-3 w-3.5 h-3.5 rounded-full bg-gray-800/80 border border-white/20 flex items-center justify-center text-white/30 text-[8px]">+</div>
                <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-gray-800/80 border border-white/20 flex items-center justify-center text-white/30 text-[8px]">+</div>

                <span className="material-symbols-outlined text-3xl text-[#0ea5e9] mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                  {stat.icon}
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1 font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  {stat.label}
                </span>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:block">
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
