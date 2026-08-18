'use client';

import React, { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import TiltCard from '@/components/ui/TiltCard';
import { Search, Sparkles, Music, Award, Users, ArrowUpRight, Globe, Camera, PlaySquare, Disc } from 'lucide-react';

export default function ContributorsShowcaseClient({ contributors = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const rolesList = [
    { id: 'ALL', label: 'All Contributors' },
    { id: 'ENGINEER', label: 'Engineers & Producers' },
    { id: 'VOCALIST', label: 'Vocalists & Artists' },
    { id: 'INSTRUMENTAL', label: 'Instrumentalists' },
    { id: 'LYRICIST', label: 'Lyricists & Composers' },
  ];

  // Helper to categorize roles
  const getCategoryFromRole = (roleStr = '') => {
    const lower = roleStr.toLowerCase();
    if (lower.includes('engineer') || lower.includes('producer') || lower.includes('mix') || lower.includes('master') || lower.includes('arranger')) {
      return 'ENGINEER';
    }
    if (lower.includes('vocal') || lower.includes('singer') || lower.includes('artist') || lower.includes('lead')) {
      return 'VOCALIST';
    }
    if (lower.includes('guitar') || lower.includes('piano') || lower.includes('flute') || lower.includes('sitar') || lower.includes('violin') || lower.includes('drum') || lower.includes('instrument')) {
      return 'INSTRUMENTAL';
    }
    if (lower.includes('lyric') || lower.includes('melody') || lower.includes('composer') || lower.includes('writer')) {
      return 'LYRICIST';
    }
    return 'ALL';
  };

  const filteredContributors = useMemo(() => {
    return contributors.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.mainRole && c.mainRole.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.bio && c.bio.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedRole === 'ALL') return true;

      const category = getCategoryFromRole(c.mainRole || '');
      return category === selectedRole;
    });
  }, [contributors, searchQuery, selectedRole]);

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-32 relative overflow-hidden">
      {/* Ambient glowing atmosphere */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#0ea5e9]/15 via-purple-600/10 to-[#0ea5e9]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-10 pt-10 pb-12 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#0ea5e9]" />
              <span>THE SOUND ARCHITECTS & ARTISTS</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase">
              STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-white to-[#9d2bee]">CONTRIBUTORS</span>
            </h1>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-light">
            Explore the producers, engineers, vocalists, and instrumentalists who bring world-class acoustic perfection to every production.
          </p>
        </div>

        {/* Live Roster Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{contributors.length}</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Total Contributors</div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {contributors.filter(c => c.isApproved || c.slug).length}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Verified Roster</div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Disc className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {contributors.reduce((acc, c) => acc + (c.creditsCount || 0), 0)}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Recorded Credits</div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Studio Fidelity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mt-10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-black/50 backdrop-blur-xl border border-white/10 p-4 rounded-3xl">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contributor by name, role, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#0ea5e9] transition-colors"
            />
          </div>

          {/* Role Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {rolesList.map((role) => {
              const active = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? 'bg-[#0ea5e9] text-white font-bold shadow-[0_0_20px_rgba(14,165,233,0.5)] scale-105'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid of Contributors */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 pt-12">
        {filteredContributors.length === 0 ? (
          <div className="text-center py-24 bg-black/30 backdrop-blur-md rounded-3xl border border-white/10">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No contributors found</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              No matching artists or producers matched your filter criteria. Try searching another term or resetting filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedRole('ALL'); }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredContributors.map((profile, idx) => {
              const hasSlug = Boolean(profile.slug);
              const effectiveSlug = profile.slug || `guest-${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              const cardHref = `/contributors/${effectiveSlug}`;

              return (
                <TiltCard key={profile.id || idx}>
                  <Link
                    href={cardHref}
                    className="group relative flex flex-col bg-black/60 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-[#0ea5e9]/60 shadow-2xl transition-all duration-500 h-full justify-between p-6 block"
                  >
                    {/* Hardware Corner Screws */}
                    <div className="absolute top-3 left-3 z-30 w-4 h-4 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>
                    <div className="absolute top-3 right-3 z-30 w-4 h-4 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">+</div>

                    <div>
                      {/* Portrait Container */}
                      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-black/40 mb-6 border border-white/10 group-hover:border-[#0ea5e9]/40 transition-all">
                        {profile.imageUrl ? (
                          <img
                            src={profile.imageUrl}
                            alt={profile.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-[#060913] text-white/10 group-hover:text-white/20 transition-colors">
                            <Users className="w-20 h-20" />
                          </div>
                        )}

                        {/* Top ID Badge */}
                        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/80">
                          {hasSlug ? `CONTRIBUTOR 0${idx + 1}` : 'GUEST CONTRIBUTOR'}
                        </div>

                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                        {/* Floating Link Arrow */}
                        {/* Floating Link Arrow */}
                        <div className="absolute bottom-3 right-3 z-20 w-11 h-11 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shadow-[0_0_20px_#0ea5e9] transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Glowing Role Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#0ea5e9] text-[11px] font-mono font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />
                          {profile.mainRole || 'Studio Artist'}
                        </div>

                        {profile.creditsCount > 0 && (
                          <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-3 py-1.5 rounded-md shrink-0">
                            {profile.creditsCount} {profile.creditsCount === 1 ? 'Credit' : 'Credits'}
                          </span>
                        )}
                      </div>

                      {/* Contributor Name */}
                      <h3 className="card-title text-2xl mb-2 group-hover:text-[#0ea5e9] transition-colors">
                        {profile.name}
                      </h3>

                      {/* Bio Display */}
                      {profile.bio && (
                        <p className="card-desc line-clamp-3 mb-4">
                          {profile.bio}
                        </p>
                      )}
                    </div>

                    {/* Footer Actions / Socials */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                      <span className="mono-label flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        ACTIVE ROSTER
                      </span>
                      <span className="mono-label text-white/70 group-hover:text-[#0ea5e9] transition-colors">
                        VIEW DOSSIER →
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
