import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/db';
import { t } from '@/lib/utils/t';
import Scroll3DWrapper from '@/components/ui/Scroll3DWrapper';
import TiltCard from '@/components/ui/TiltCard';
import FeaturedSongsSection from '@/components/public/FeaturedSongsSection';
import ServicesOverviewSection from '@/components/public/ServicesOverviewSection';
import CtaSection from '@/components/public/CtaSection';
import Image from 'next/image';
import { User, ArrowUpRight, ArrowRight, Award, Disc, Activity, Heart, Gamepad2, Trophy } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: 'Home | RST Style Studio LK',
    description: 'Professional music production, mixing, and mastering studio in Sri Lanka.',
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'Hero' });
  const tStats = await getTranslations({ locale, namespace: 'Stats' });

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

  let totalSongsCount = 120; // Fallback
  let masteredTracksCount = 100; // Fallback

  try {
    const stats = await Promise.all([
      prisma.song.count({ where: { deletedAt: null } }),
      prisma.song.count({ where: { deletedAt: null, projectType: { in: ['MIXING_MASTERING', 'POST_PRODUCTION'] } } })
    ]);
    if (stats[0] > 0) totalSongsCount = stats[0];
    if (stats[1] > 0) masteredTracksCount = stats[1];
  } catch (e) {
    console.error("Failed fetching stats:", e);
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
            poster="/logo.png"
          >
            <source src="/herovideo.mp4" type="video/mp4" />
          </video>
          {/* Gentle bottom fade to smoothly transition into the section below without blurring or dulling video clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent opacity-80 pointer-events-none" />
        </div>

        {/* Subtle bottom gradient to smoothly blend into the sections below */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060913] via-[#060913]/40 to-transparent pointer-events-none z-10" />

        {/* Scroll Indicator — minimal, floating at bottom */}
        <div className="relative z-20 flex flex-col items-center gap-2 mb-10 opacity-75 animate-pulse">
          <span className="handwritten-subtitle text-lg text-white/60">scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-white/40 flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#0ea5e9] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: SERVICES OVERVIEW
          ═══════════════════════════════════════════════════════════ */}
      <ServicesOverviewSection />

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
              <span className="section-label">
                The Sound Architects
              </span>
              <h2 className="section-heading text-4xl md:text-6xl">
                MEET THE <span className="accent">ENGINEERS</span>
              </h2>
              <p className="handwritten-accent text-2xl md:text-3xl mt-3">
                the creative minds behind the music
              </p>
            </div>
            <Link
              href="/profiles"
              className="inline-flex items-center gap-2 text-[#0ea5e9] hover:text-white font-bold text-sm tracking-wide uppercase transition-colors group"
            >
              <span>View Full Roster</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(featuredProfiles.length > 0 ? featuredProfiles : [
              { id: '1', name: 'RST Studio', mainRole: 'Lead Sound Engineer & Founder', bio: 'Mastering engineer with over a decade of analog recording and acoustic sculpture experience.', imageUrl: '/logo.png', slug: 'rst-studio' },
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
                        <Image
                          src={profile.imageUrl}
                          alt={profile.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-white/10 to-transparent text-white/30">
                          <User className="w-16 h-16 mb-2 text-white/30" />
                          <span className="mono-label">Engineer ID 0{idx + 1}</span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                      {/* Floating Link Arrow */}
                      <div className="absolute bottom-3 right-3 z-20 w-10 h-10 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shadow-[0_0_15px_#0ea5e9] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="inline-block px-3 py-1 rounded-md bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 text-[#0ea5e9] text-[11px] font-mono font-bold uppercase tracking-wider mb-3 shadow-[0_0_10px_rgba(14,165,233,0.2)]">
                      {profile.mainRole || 'Studio Artist'}
                    </div>

                    {/* Name */}
                    <h3 className="card-title text-2xl mb-2 group-hover:text-[#0ea5e9]">
                      {profile.name}
                    </h3>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="card-desc line-clamp-3">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="mono-label flex items-center gap-1.5 text-slate-300"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />ACTIVE</span>
                    <span className="mono-label text-white/70 group-hover:text-[#0ea5e9] transition-colors">VIEW DOSSIER →</span>
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
          {/* Section intro */}
          <div className="text-center mb-14">
            <span className="section-label">Studio Performance</span>
            <h2 className="section-heading text-3xl md:text-5xl mt-2">
              NUMBERS THAT <span className="accent">SPEAK</span>
            </h2>
            <p className="handwritten-subtitle text-xl md:text-2xl mt-3">
              a decade of crafting sonic experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: tStats('yearsLabel'), value: '10+', desc: tStats('yearsDesc'), icon: <Award className="w-8 h-8 text-[#0ea5e9] mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(14,165,233,0.3)]" /> },
              { label: tStats('masteredLabel'), value: `${masteredTracksCount}+`, desc: tStats('masteredDesc'), icon: <Disc className="w-8 h-8 text-[#0ea5e9] mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(14,165,233,0.3)]" /> },
              { label: tStats('projectsLabel'), value: `${totalSongsCount}+`, desc: tStats('projectsDesc'), icon: <Activity className="w-8 h-8 text-[#0ea5e9] mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(14,165,233,0.3)]" /> },
              { label: tStats('passionLabel'), value: '∞', desc: tStats('passionDesc'), icon: <Heart className="w-8 h-8 text-[#0ea5e9] mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(14,165,233,0.3)]" /> },
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

                {stat.icon}
                <span className="stat-value text-4xl sm:text-5xl mb-1">
                  {stat.value}
                </span>
                <span className="stat-label block mb-1.5">
                  {stat.label}
                </span>
                <span className="stat-desc hidden sm:block">
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: MUSIC ARCADE (GAMES)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 relative overflow-hidden bg-[#0a0f1d] border-t border-white/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-[#0ea5e9]/20 to-[#9d2bee]/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="md:w-1/2">
            <span className="section-label">Interactive Experience</span>
            <h2 className="section-heading text-4xl md:text-5xl mt-2 mb-6">
              THE MUSIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee]">ARCADE</span>
            </h2>
            <p className="text-xl text-white/60 mb-6 leading-relaxed">
              Test your musical skills, play mini-games, and climb the monthly leaderboard.
            </p>
            
            <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-4 rounded-2xl mb-8 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-yellow-500/30">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-yellow-400 font-bold text-lg">Monthly Rewards</h4>
                <p className="text-white/70 text-sm">Top players win exclusive studio discounts & free recording sessions!</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/games"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee] hover:scale-105 transition-transform rounded-xl font-bold text-white shadow-lg shadow-[#0ea5e9]/20"
              >
                <Gamepad2 className="w-5 h-5" />
                Play Now
              </Link>
              <Link 
                href="/games/leaderboards"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-white transition-colors"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            {/* Visual placeholder for games */}
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/30 to-[#9d2bee]/30 rounded-3xl transform rotate-6 border border-white/20" />
              <div className="absolute inset-0 bg-[#060913] rounded-3xl transform -rotate-3 border border-white/20 flex flex-col items-center justify-center p-8 shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0ea5e9] to-[#9d2bee] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#0ea5e9]/40">
                  <Gamepad2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">5 Mini Games</h3>
                <p className="text-white/50 text-center text-sm">Trivia, Pitch Match, Name That Tune, Theory Master & Rhythm Tap</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: CALL TO ACTION (CTA)
          ═══════════════════════════════════════════════════════════ */}
      <CtaSection />
    </div>
  );
}
