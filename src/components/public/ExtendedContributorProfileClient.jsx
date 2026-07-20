'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import TiltCard from '@/components/ui/TiltCard';
import { 
  ArrowLeft, 
  Award, 
  Disc, 
  Music, 
  Calendar, 
  Globe, 
  Camera, 
  PlaySquare, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2,
  Share2,
  Headphones,
  Mail
} from 'lucide-react';

export default function ExtendedContributorProfileClient({ profile, projects = [] }) {
  const [activeTab, setActiveTab] = useState('DISCOGRAPHY');
  const [selectedImage, setSelectedImage] = useState(null);

  const totalCredits = projects.length;
  const firstYear = projects.length > 0
    ? Math.min(...projects.map(p => p.song.releaseYear || new Date().getFullYear()))
    : new Date().getFullYear();
  const latestYear = projects.length > 0
    ? Math.max(...projects.map(p => p.song.releaseYear || new Date().getFullYear()))
    : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-32 relative overflow-hidden">
      {/* Ambient Acoustic Lighting */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#0ea5e9]/15 via-purple-600/10 to-[#0ea5e9]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mb-8">
        <Link 
          href="/contributors"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-[#0ea5e9] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SOUND ARCHITECTS & ROSTER</span>
        </Link>
      </div>

      {/* Hero Dossier Header */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mb-12">
        <div className="relative bg-black/60 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Hardware Corner Screws */}
          <div className="absolute top-4 left-4 z-30 w-4 h-4 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>
          <div className="absolute top-4 right-4 z-30 w-4 h-4 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>
          <div className="absolute bottom-4 left-4 z-30 w-4 h-4 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>
          <div className="absolute bottom-4 right-4 z-30 w-4 h-4 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 relative z-10">
            {/* Contributor Portrait / Avatar Frame */}
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 shrink-0 rounded-3xl overflow-hidden bg-black/80 border-2 border-[#0ea5e9]/40 shadow-[0_0_50px_rgba(14,165,233,0.25)]">
              {profile.imageUrl ? (
                <img 
                  src={profile.imageUrl} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9]/30 flex flex-col items-center justify-center text-white p-6 text-center">
                  <Headphones className="w-16 h-16 text-[#0ea5e9]/60 mb-3" />
                  <span className="text-3xl font-black tracking-wider">{profile.name.charAt(0)}</span>
                </div>
              )}

              {/* Verified Badge Overlay */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#0ea5e9]/50 flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0ea5e9]" />
                <span>VERIFIED</span>
              </div>
            </div>

            {/* Contributor Identity & Bio */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#0ea5e9]" />
                <span>{profile.mainRole || 'Studio Architect & Contributor'}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mb-4 flex items-center justify-center lg:justify-start gap-3">
                {profile.name}
              </h1>

              {/* Bio text */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl font-light mb-8">
                {profile.bio || `Senior acoustic architect and credited contributor at RST Style Studio LK, crafting exceptional fidelity, arrangement, and sonic atmosphere across modern productions.`}
              </p>

              {/* Social Links Bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {profile.socialLinks?.instagram && (
                  <a 
                    href={profile.socialLinks.instagram} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#E4405F] border border-white/10 hover:border-transparent text-white text-xs font-mono font-bold transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>INSTAGRAM</span>
                  </a>
                )}
                {profile.socialLinks?.spotify && (
                  <a 
                    href={profile.socialLinks.spotify} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#1DB954] border border-white/10 hover:border-transparent text-white text-xs font-mono font-bold transition-all"
                  >
                    <Disc className="w-4 h-4" />
                    <span>SPOTIFY</span>
                  </a>
                )}
                {profile.socialLinks?.youtube && (
                  <a 
                    href={profile.socialLinks.youtube} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#FF0000] border border-white/10 hover:border-transparent text-white text-xs font-mono font-bold transition-all"
                  >
                    <PlaySquare className="w-4 h-4" />
                    <span>YOUTUBE</span>
                  </a>
                )}
                {profile.socialLinks?.facebook && (
                  <a 
                    href={profile.socialLinks.facebook} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#1877F2] border border-white/10 hover:border-transparent text-white text-xs font-mono font-bold transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>FACEBOOK</span>
                  </a>
                )}

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-cyan-400 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-105 transition-all ml-auto"
                >
                  <Mail className="w-4 h-4" />
                  <span>BOOK ARTIST FOR SESSION</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9]">
                <Disc className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{totalCredits}</div>
                <div className="text-[10px] font-mono uppercase text-gray-400">Credited Tracks</div>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-[10px] font-mono uppercase text-gray-400">Studio Verification</div>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{firstYear} — {latestYear}</div>
                <div className="text-[10px] font-mono uppercase text-gray-400">Active Releases</div>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">HI-RES</div>
                <div className="text-[10px] font-mono uppercase text-gray-400">Master Quality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Discography & Works */}
      <section className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-[#0ea5e9]" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              CREDITED DISCOGRAPHY & PRODUCTIONS
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-400">
            SHOWING {projects.length} {projects.length === 1 ? 'RELEASE' : 'RELEASES'}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-xl border border-dashed border-white/10 rounded-3xl p-16 text-center">
            <Disc className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Credited Tracks Recorded Yet</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              This artist is currently working on upcoming studio sessions and master releases at RST Style Studio LK.
            </p>
            <Link
              href="/songs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0ea5e9] hover:bg-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider transition"
            >
              <span>EXPLORE ALL STUDIO RELEASES</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(({ song, roles }, idx) => (
              <TiltCard key={song.id || idx}>
                <Link
                  href={`/songs/${song.slug}`}
                  className="group relative flex items-center gap-5 p-5 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-[#0ea5e9]/60 transition-all duration-500 shadow-xl block"
                >
                  {/* Album Cover */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-black/60 border border-white/10 group-hover:border-[#0ea5e9]/40 transition-all">
                    {song.coverImage ? (
                      <img 
                        src={song.coverImage} 
                        alt={song.titleEn} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0f172a] text-white/30">
                        <Disc className="w-10 h-10 mb-1 text-[#0ea5e9]/50" />
                        <span className="text-[9px] font-mono uppercase tracking-widest">RST Master</span>
                      </div>
                    )}

                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shadow-[0_0_20px_#0ea5e9]">
                        <PlaySquare className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Song Details & Contribution Roles */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-[#0ea5e9] font-bold uppercase tracking-wider">
                        {song.projectType || 'STUDIO MASTER'}
                      </span>
                      {song.releaseYear && (
                        <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {song.releaseYear}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white truncate group-hover:text-[#0ea5e9] transition-colors mb-2">
                      {song.titleEn}
                    </h3>

                    {song.titleSi && (
                      <p className="text-xs text-gray-400 font-light truncate mb-3">
                        {song.titleSi}
                      </p>
                    )}

                    {/* Roles Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {roles.map((role, rIdx) => (
                        <span
                          key={rIdx}
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#0ea5e9]/15 text-cyan-300 border border-[#0ea5e9]/30"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#0ea5e9]" />
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#0ea5e9] text-gray-400 group-hover:text-white items-center justify-center transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        )}
      </section>

      {/* Gallery Section if Contributor has galleryImages */}
      {profile.galleryImages && profile.galleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-10 mt-16">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <Camera className="w-6 h-6 text-[#0ea5e9]" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              STUDIO ARCHIVE & GALLERY
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative group bg-black/60 cursor-pointer shadow-lg"
              >
                <img
                  src={img}
                  alt={`${profile.name} studio session ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-mono uppercase font-bold text-white bg-black/80 px-3 py-1.5 rounded-full border border-white/20">
                    VIEW IMAGE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Collaboration Call To Action Footer */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mt-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/40 via-black/80 to-[#0ea5e9]/30 border border-white/15 p-8 sm:p-12 text-center overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLABORATE WITH {profile.name.toUpperCase()}</span>
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4">
              READY TO PRODUCE YOUR NEXT RELEASE?
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light mb-8">
              Book a custom acoustic engineering session or request production collaboration with {profile.name} at RST Style Studio LK.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0ea5e9] hover:bg-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-105 transition-all"
            >
              <span>INQUIRE ABOUT A SESSION</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
