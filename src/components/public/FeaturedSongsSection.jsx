'use client';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/utils/t';
import TiltCard from '@/components/ui/TiltCard';

export default function FeaturedSongsSection({ songs = [], locale = 'en' }) {
  // If no featured songs exist in DB yet, provide fallback demo tracks so the design shines
  const displaySongs = songs.length > 0 ? songs : [
    {
      id: 'demo-1',
      titleEn: 'Neon Skyline (Original Mix)',
      titleSi: 'නියොන් ආකාසය',
      genres: ['Synthwave', 'Pop'],
      releaseYear: 2025,
      coverImage: null,
      youtubeUrl: 'https://youtube.com',
      spotifyUrl: 'https://spotify.com'
    },
    {
      id: 'demo-2',
      titleEn: 'Midnight Symphony',
      titleSi: 'මධ්‍යම රාත්‍රී සිම්ෆනිය',
      genres: ['Cinematic', 'Electronic'],
      releaseYear: 2025,
      coverImage: null,
      youtubeUrl: 'https://youtube.com',
      spotifyUrl: 'https://spotify.com'
    },
    {
      id: 'demo-3',
      titleEn: 'Island Rhythm Beats',
      titleSi: 'දිවයිනේ රිද්ම',
      genres: ['Baila', 'R&B'],
      releaseYear: 2024,
      coverImage: null,
      youtubeUrl: 'https://youtube.com',
      spotifyUrl: 'https://spotify.com'
    }
  ];

  return (
    <section className="py-24 px-4 md:px-10 relative overflow-hidden bg-transparent border-t border-b border-white/10">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#9d2bee]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0ea5e9]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#0ea5e9] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
              Mastered at RST Studio
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-white to-[#9d2bee]">RELEASES</span>
            </h2>
          </div>
          
          <Link
            href="/songs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-sm font-bold transition-all hover:border-[#0ea5e9] group self-start md:self-auto"
          >
            <span>View Full Catalog (100+ Tracks)</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform text-[#0ea5e9]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* 3D Vinyl Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displaySongs.slice(0, 6).map((song, idx) => {
            const title = t(song, 'title', locale) || song.titleEn || 'Untitled Track';
            return (
              <TiltCard key={song.id || idx}>
                <div className="group relative aerospace-card rounded-3xl p-6 transition-all duration-500 overflow-hidden flex flex-col h-full justify-between">
                  
                  {/* Hardware Corner Screws */}
                  <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-gray-800/80 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">
                    +
                  </div>
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gray-800/80 border border-white/20 flex items-center justify-center text-white/30 text-[9px]">
                    +
                  </div>

                  <div>
                    {/* Vinyl Record & Album Art Visual */}
                    <div className="relative aspect-square w-full rounded-2xl bg-white/[0.03] mb-6 overflow-hidden flex items-center justify-center border border-white/10 group-hover:border-[#0ea5e9]/40 transition-all">
                      
                      {/* Spinning Vinyl Background Graphic */}
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-black via-gray-900 to-gray-800 border-4 border-gray-950 shadow-2xl flex items-center justify-center transition-transform duration-700 group-hover:translate-x-4 group-hover:rotate-180">
                        <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-[#0ea5e9]/20">
                          <div className="w-6 h-6 rounded-full bg-black border border-white/20" />
                        </div>
                        {/* Vinyl grooves */}
                        <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
                        <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                        <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
                      </div>

                      {/* Cover Image or DJ Waveform Placeholder */}
                      {song.coverImage ? (
                        <img
                          src={song.coverImage}
                          alt={title}
                          className="w-full h-full object-cover relative z-10 rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="relative z-10 w-full h-full bg-gradient-to-br from-white/10 to-transparent flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-16 h-16 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 flex items-center justify-center text-[#0ea5e9] mb-3 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                            <span className="material-symbols-outlined text-3xl">album</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-white/60 tracking-widest uppercase">
                            Master Tape
                          </span>
                        </div>
                      )}

                      {/* Play overlay badge */}
                      <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-16 h-16 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shadow-[0_0_25px_#0ea5e9] transform scale-75 group-hover:scale-100 transition-transform">
                          <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
                        </div>
                      </div>
                    </div>

                    {/* Genres & Year Pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {song.releaseYear && (
                        <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 font-mono text-xs font-bold">
                          {song.releaseYear}
                        </span>
                      )}
                      {(song.genres || []).slice(0, 3).map((genre, gIdx) => (
                        <span
                          key={gIdx}
                          className="px-2.5 py-0.5 rounded-md bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 text-[#0ea5e9] text-xs font-semibold shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    {/* Track Title */}
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-[#0ea5e9] transition-colors line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {title}
                    </h3>
                  </div>

                  {/* Card Footer: Platform Links */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300 uppercase flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                      HI-RES AUDIO
                    </span>

                    <div className="flex items-center gap-2">
                      {song.youtubeUrl && (
                        <a
                          href={song.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                          title="Watch on YouTube"
                        >
                          <span className="material-symbols-outlined text-base">play_circle</span>
                        </a>
                      )}
                      {song.spotifyUrl && (
                        <a
                          href={song.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-green-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                          title="Listen on Spotify"
                        >
                          <span className="material-symbols-outlined text-base">headphones</span>
                        </a>
                      )}
                      <Link
                        href="/songs"
                        className="w-8 h-8 rounded-full bg-[#0ea5e9]/20 hover:bg-[#0ea5e9] text-[#0ea5e9] hover:text-white flex items-center justify-center transition-colors ml-1 shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                        title="Track Details"
                      >
                        <span className="material-symbols-outlined text-base">arrow_outward</span>
                      </Link>
                    </div>
                  </div>

                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
