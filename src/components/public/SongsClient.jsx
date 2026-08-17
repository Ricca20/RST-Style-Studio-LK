'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import {
  Play,
  PlayCircle,
  Film,
  MonitorPlay,
  Filter,
  Disc,
  Grid,
  Search,
  ListMusic,
  Volume2,
  ExternalLink,
  Headphones,
  Users,
  ArrowUpRight,
  X,
  Pause,
  Radio,
  Music
} from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';

// Helper to extract YouTube Video ID & build clean embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}

// Helper to extract Spotify Track ID & build embed URL
function getSpotifyEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  return match ? `https://open.spotify.com/embed/track/${match[1]}?utm_source=generator` : null;
}

export default function SongsClient({ initialSongs = [], genres = [], locale = 'en' }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeGenre, setActiveGenre] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('VINYL'); // 'VINYL' | 'RACK' | 'LIST'
  
  // Player state: holds the song object currently loaded in the interactive in-page player
  const [activeSong, setActiveSong] = useState(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);

  const tabs = [
    { id: 'ALL', label: 'ALL RELEASES', icon: Play, count: initialSongs.length },
    { id: 'SONG', label: 'AUDIO MASTERS', icon: PlayCircle, count: initialSongs.filter(s => s.projectType === 'SONG').length },
    { id: 'MUSIC_VIDEO', label: 'MUSIC VIDEOS', icon: Film, count: initialSongs.filter(s => s.projectType === 'MUSIC_VIDEO').length },
    { id: 'COMMERCIAL', label: 'COMMERCIAL SCORES', icon: MonitorPlay, count: initialSongs.filter(s => s.projectType === 'COMMERCIAL').length },
  ];

  const filteredSongs = useMemo(() => {
    return initialSongs.filter(song => {
      const matchType = activeTab === 'ALL' || song.projectType === activeTab;
      const matchGenre = activeGenre === 'ALL' || (song.genres && song.genres.includes(activeGenre));
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchType && matchGenre;

      const titleMatch = (song.titleEn || song.titleSi || '').toLowerCase().includes(query);
      const genreMatch = (song.genres || []).some(g => g.toLowerCase().includes(query));
      const contributorMatch = (song.contributions || []).some(c =>
        (c.name || c.profile?.name || '').toLowerCase().includes(query)
      );

      return matchType && matchGenre && (titleMatch || genreMatch || contributorMatch);
    });
  }, [initialSongs, activeTab, activeGenre, searchQuery]);

  const t = (obj, key, loc) => {
    if (!obj) return '';
    const kLoc = `${key}${loc.charAt(0).toUpperCase() + loc.slice(1)}`;
    return obj[kLoc] || obj[`${key}En`] || obj[key] || '';
  };

  const handlePlaySong = (e, song) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSong(song);
    setIsPlayingDemo(true);
  };

  return (
    <div className="flex flex-col relative">
      {/* ═══════════════════════════════════════════════════════════
          IN-PAGE STUDIO MASTER AUDIO/VIDEO PLAYER MODAL
          ═══════════════════════════════════════════════════════════ */}
      {activeSong && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setActiveSong(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-gradient-to-b from-muted via-gray-950 to-background border border-[#0ea5e9]/50 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hardware Corner Screws */}
            <div className="absolute top-3 left-3 z-30 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>
            <div className="absolute top-3 right-12 z-30 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>

            {/* Close Button */}
            <button
              onClick={() => setActiveSong(null)}
              className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-muted hover:bg-white/20 text-foreground flex items-center justify-center transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Ribbon */}
            <div className="p-6 md:p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
                  ANALOG TAPE PLAYER • HI-RES STREAM
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {t(activeSong, 'title', locale) || activeSong.titleEn}
                </h3>
                <p className="text-muted-foreground font-mono text-xs mt-1">
                  RELEASE YEAR: {activeSong.releaseYear || '2025'} • FORMAT: {activeSong.projectType}
                </p>
              </div>

              {/* Action Buttons to open full dossier */}
              <Link
                href={`/songs/${activeSong.slug}`}
                onClick={() => setActiveSong(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0ea5e9] text-foreground font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#0ea5e9]/90 transition-all shadow-[0_0_20px_#0ea5e9]"
              >
                VIEW FULL MASTER PAGE <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* EMBEDDED PLAYER SECTION */}
            <div className="p-6 md:p-8 bg-card/60">
              {getYouTubeEmbedUrl(activeSong.youtubeUrl) ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-2xl bg-background">
                  <iframe
                    src={getYouTubeEmbedUrl(activeSong.youtubeUrl)}
                    title={activeSong.titleEn}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : getSpotifyEmbedUrl(activeSong.spotifyUrl) ? (
                <div className="w-full rounded-2xl overflow-hidden border border-border shadow-2xl bg-background">
                  <iframe
                    src={getSpotifyEmbedUrl(activeSong.spotifyUrl)}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              ) : (
                /* Interactive Analog Equalizer & Audio Simulator Deck */
                <div className="p-8 rounded-2xl bg-gradient-to-b from-muted to-background border border-border flex flex-col items-center justify-center text-center">
                  <div className="flex items-end justify-center gap-1.5 h-16 mb-6">
                    {[45, 75, 30, 90, 60, 100, 70, 40, 85, 55, 95, 65, 35, 80, 50, 90, 70, 40].map((h, idx) => (
                      <div
                        key={idx}
                        style={{ height: isPlayingDemo ? `${h}%` : '15%' }}
                        className="w-2.5 rounded-full bg-gradient-to-t from-cyan-500 via-[#0ea5e9] to-purple-500 transition-all duration-300"
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                      className="w-14 h-14 rounded-full bg-[#0ea5e9] text-foreground flex items-center justify-center shadow-[0_0_25px_#0ea5e9] hover:scale-105 transition-transform cursor-pointer"
                    >
                      {isPlayingDemo ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                    <div className="text-left font-mono">
                      <div className="text-xs text-[#0ea5e9] font-bold">24-BIT / 96kHz ANALOG SUMMING</div>
                      <div className="text-sm text-foreground font-bold">{isPlayingDemo ? 'PLAYING MASTER STREAM...' : 'PAUSED'}</div>
                    </div>
                  </div>

                  {activeSong.spotifyUrl && (
                    <a
                      href={activeSong.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-white/20 text-foreground text-xs font-mono font-bold transition-colors mt-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Open on Spotify
                    </a>
                  )}
                  {activeSong.youtubeUrl && (
                    <a
                      href={activeSong.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-mono font-bold transition-colors mt-2 ml-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Open on YouTube
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Credited Artists & Dossier Links */}
            {activeSong.contributions && activeSong.contributions.length > 0 && (
              <div className="p-6 md:p-8 border-t border-border bg-background/40">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-4">
                  CREDITED STUDIO ARTISTS & ENGINEERS:
                </span>
                <div className="flex flex-wrap gap-3">
                  {activeSong.contributions.map((credit, idx) => {
                    const slug = credit.profile?.slug || `guest-${credit.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                    return (
                      <Link
                        key={idx}
                        href={`/contributors/${slug}`}
                        onClick={() => setActiveSong(null)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted/50 hover:bg-[#0ea5e9]/20 border border-border hover:border-[#0ea5e9]/40 transition-all group"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
                        <span className="text-sm font-bold text-foreground group-hover:text-[#0ea5e9] transition-colors">
                          {credit.name}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">({credit.role})</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STUDIO CONSOLE CONTROLLER DESK
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-card/60 backdrop-blur-2xl rounded-3xl border border-border p-6 md:p-8 mb-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Hardware Screws */}
        <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>
        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>
        <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>
        <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-[#0ea5e9]/20 via-[#9d2bee]/20 to-[#0ea5e9]/20 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-border relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-ping" />
              <span className="text-xs font-mono text-[#0ea5e9] uppercase tracking-widest font-bold">
                ANALOG MASTER CATALOG • LIVE DB SYNC
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3 tracking-tight">
              STUDIO AUDIO VAULT
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-muted text-primary border border-border">
                {filteredSongs.length} {filteredSongs.length === 1 ? 'RELEASE' : 'RELEASES'}
              </span>
            </h3>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tracks, artists, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-background/50 border border-border focus:border-[#0ea5e9] text-foreground text-sm font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Channel Format Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 relative z-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#0ea5e9]/20 to-[#0ea5e9]/5 border-[#0ea5e9] shadow-[0_0_25px_rgba(14,165,233,0.25)]'
                    : 'bg-background/40 border-white/5 hover:border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <tab.icon className={`w-5 h-5 ${isActive ? 'text-[#0ea5e9]' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#0ea5e9] text-foreground font-bold shadow-[0_0_10px_#0ea5e9]' : 'bg-muted/50 text-muted-foreground'
                  }`}>
                    {tab.count}
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
                  isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {tab.label}
                </span>
                <div className={`w-full h-1 rounded-full mt-3 transition-all ${
                  isActive ? 'bg-[#0ea5e9] shadow-[0_0_10px_#0ea5e9]' : 'bg-muted/50 group-hover:bg-white/20'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Bottom Filter Bar: Genres & View Mode Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10 pt-2">
          {/* Genre Pills */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 no-scrollbar">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#0ea5e9]" /> GENRES:
            </span>
            <button
              onClick={() => setActiveGenre('ALL')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeGenre === 'ALL'
                  ? 'bg-[#0ea5e9] text-foreground shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border hover:border-white/30'
              }`}
            >
              ALL ({initialSongs.length})
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeGenre === genre
                    ? 'bg-[#0ea5e9] text-foreground shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border hover:border-white/30'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-1 bg-card/60 p-1 rounded-xl border border-border shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode('VINYL')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'VINYL'
                  ? 'bg-[#0ea5e9] text-foreground shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Vinyl Sleeve View"
            >
              <Disc className="w-3.5 h-3.5" />
              VINYL
            </button>
            <button
              onClick={() => setViewMode('RACK')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'RACK'
                  ? 'bg-[#0ea5e9] text-foreground shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Studio Hardware Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              STUDIO RACK
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'LIST'
                  ? 'bg-[#0ea5e9] text-foreground shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Mixing Console Channel Strip List View"
            >
              <ListMusic className="w-3.5 h-3.5" />
              CONSOLE LIST
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TRACK DISPLAY AREA
          ═══════════════════════════════════════════════════════════ */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-28 rounded-3xl border border-border bg-background/40 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
          <Volume2 className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
          <h4 className="text-2xl font-black text-foreground mb-2">NO TRACKS MATCHING SEARCH OR FILTER</h4>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any database masters matching your current filters. Try searching for another title or resetting presets.
          </p>
          <button
            onClick={() => { setActiveTab('ALL'); setActiveGenre('ALL'); setSearchQuery(''); }}
            className="px-6 py-3 rounded-full bg-[#0ea5e9] text-foreground font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#0ea5e9]/90 transition-all shadow-[0_0_20px_#0ea5e9] cursor-pointer"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : viewMode === 'VINYL' ? (

        /* ── MODE 1: INTERACTIVE VINYL SLEEVE ALBUMS ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredSongs.map((song) => {
            const title = t(song, 'title', locale) || song.titleEn || 'Untitled Master';
            const primaryContributor = song.contributions?.[0];
            const artistName = primaryContributor?.profile
              ? t(primaryContributor.profile, 'name', locale) || primaryContributor.profile.name
              : primaryContributor?.name || 'RST Studio Ensemble';

            return (
              <div
                key={song.id}
                onClick={(e) => handlePlaySong(e, song)}
                className="group relative bg-card/60 backdrop-blur-xl rounded-3xl border border-border hover:border-[#0ea5e9]/60 p-6 transition-all duration-500 shadow-2xl overflow-hidden flex flex-col h-full justify-between cursor-pointer"
              >
                {/* Hardware Corner Screws */}
                <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>

                <div>
                  {/* Vinyl Sleeve & Pull-Out Spinning Disc Container */}
                  <div className="relative aspect-square w-full rounded-2xl bg-background/50 mb-6 overflow-hidden flex items-center justify-center border border-border group-hover:border-[#0ea5e9]/40 transition-all">
                    {/* Spinning Vinyl Record (Slides out slightly on hover) */}
                    <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-gradient-to-tr from-black via-gray-900 to-gray-800 border-4 border-gray-950 shadow-2xl flex items-center justify-center transition-all duration-700 group-hover:translate-x-3 group-hover:rotate-180">
                      <div className="w-20 h-20 rounded-full border border-border flex items-center justify-center bg-[#0ea5e9]/20">
                        <div className="w-6 h-6 rounded-full bg-background border border-white/30" />
                      </div>
                      <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
                      <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                    </div>

                    {/* Cover Sleeve Artwork */}
                    {song.coverImage ? (
                      <img
                        src={song.coverImage}
                        alt={title}
                        className="w-full h-full object-cover relative z-10 rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative z-10 w-full h-full bg-gradient-to-br from-muted via-gray-950 to-background flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 flex items-center justify-center text-[#0ea5e9] mb-3 shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                          <Disc className="w-8 h-8 animate-spin-slow" />
                        </div>
                        <span className="text-xs font-mono font-bold text-foreground/60 tracking-widest uppercase">
                          ANALOG VINYL MASTER
                        </span>
                      </div>
                    )}

                    {/* Format Badge */}
                    <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-lg bg-background/80 backdrop-blur-md border border-border text-[10px] font-mono font-bold text-[#0ea5e9] uppercase tracking-wider">
                      {song.projectType === 'MUSIC_VIDEO' ? 'MUSIC VIDEO' : song.projectType === 'COMMERCIAL' ? 'COMMERCIAL SCORE' : 'AUDIO MASTER'}
                    </div>

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 z-20 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-16 h-16 rounded-full bg-[#0ea5e9] text-foreground flex items-center justify-center shadow-[0_0_30px_#0ea5e9] transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Metadata Header */}
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {song.releaseYear || '2025 MASTER'}
                    </span>
                    <span className="text-[#0ea5e9] font-bold bg-[#0ea5e9]/10 px-2.5 py-0.5 rounded-full border border-[#0ea5e9]/30">
                      {song.genres?.[0] || 'Stereo Master'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-foreground tracking-tight mb-1.5 group-hover:text-[#0ea5e9] transition-colors line-clamp-1">
                    {title}
                  </h3>

                  <p className="text-muted-foreground font-mono text-xs mb-4 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span>{artistName}</span>
                  </p>
                </div>

                {/* Footer Stats & CTA */}
                <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    33 ⅓ RPM • HI-RES
                  </span>
                  <span className="text-foreground font-bold group-hover:text-[#0ea5e9] transition-colors flex items-center gap-1">
                    PLAY & LISTEN <Play className="w-3.5 h-3.5 fill-current" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      ) : viewMode === 'RACK' ? (

        /* ── MODE 2: STUDIO RACK HARDWARE CARDS ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSongs.map((song) => {
            const title = t(song, 'title', locale) || song.titleEn || 'Untitled Master';
            const primaryContributor = song.contributions?.[0];
            const artistName = primaryContributor?.profile
              ? t(primaryContributor.profile, 'name', locale) || primaryContributor.profile.name
              : primaryContributor?.name || 'RST Studio';

            return (
              <div
                key={song.id}
                onClick={(e) => handlePlaySong(e, song)}
                className="group relative flex flex-col bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-border hover:border-[#0ea5e9]/60 shadow-xl transition-all duration-500 h-full justify-between cursor-pointer"
              >
                {/* Hardware Corner Screws */}
                <div className="absolute top-3 left-3 z-30 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>
                <div className="absolute top-3 right-3 z-30 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/30 text-[9px]">+</div>

                {/* Top Badge */}
                <div className="absolute top-3 left-10 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">
                  {song.projectType === 'MUSIC_VIDEO' ? <Film className="w-3 h-3 text-pink-400" /> :
                   song.projectType === 'COMMERCIAL' ? <MonitorPlay className="w-3 h-3 text-blue-400" /> :
                   <PlayCircle className="w-3 h-3 text-[#0ea5e9]" />}
                  {song.projectType === 'MUSIC_VIDEO' ? 'Video Master' : song.projectType === 'COMMERCIAL' ? 'Commercial' : 'Audio Master'}
                </div>

                {/* Cover Image */}
                <div className="relative aspect-[4/4] w-full overflow-hidden bg-background/40">
                  {song.coverImage ? (
                    <img
                      src={song.coverImage}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-background flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 flex items-center justify-center text-[#0ea5e9] mb-3 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                        <Headphones className="w-8 h-8" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-foreground/50 tracking-widest uppercase">
                        STUDIO MASTER
                      </span>
                    </div>
                  )}

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-10">
                    <div className="w-16 h-16 rounded-full bg-[#0ea5e9] text-foreground flex items-center justify-center shadow-[0_0_25px_#0ea5e9] transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Card Bottom Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase mb-2">
                      <span>{song.releaseYear || '2025 MASTER'}</span>
                      <span className="text-[#0ea5e9] font-bold">{song.genres?.[0] || 'Stereo'}</span>
                    </div>
                    <h4 className="text-foreground font-black text-xl tracking-tight leading-tight mb-2 group-hover:text-[#0ea5e9] transition-colors line-clamp-1">
                      {title}
                    </h4>
                    <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed mb-4">
                      {t(song, 'description', locale) || 'Mastered at RST Style Studio with high-headroom analog summing.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground/80 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {artistName}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#0ea5e9] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      PLAY <Play className="w-3.5 h-3.5 fill-current" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      ) : (

        /* ── MODE 3: MIXING CONSOLE CHANNEL STRIP LIST VIEW ── */
        <div className="flex flex-col gap-3">
          {/* List Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-background/40 rounded-xl border border-border text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">CH #</div>
            <div className="col-span-4">TRACK / MASTER TITLE</div>
            <div className="col-span-3">CREDITED ARTISTS</div>
            <div className="col-span-2">GENRE / FORMAT</div>
            <div className="col-span-2 text-right">ACTION</div>
          </div>

          {filteredSongs.map((song, idx) => {
            const title = t(song, 'title', locale) || song.titleEn || 'Untitled Master';
            const primaryContributor = song.contributions?.[0];
            const artistName = primaryContributor?.profile
              ? t(primaryContributor.profile, 'name', locale) || primaryContributor.profile.name
              : primaryContributor?.name || 'RST Studio';

            return (
              <div
                key={song.id}
                onClick={(e) => handlePlaySong(e, song)}
                className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-background/50 hover:bg-background/80 backdrop-blur-xl rounded-2xl border border-border hover:border-[#0ea5e9]/60 p-4 transition-all duration-300 shadow-lg cursor-pointer"
              >
                {/* Track Channel Number */}
                <div className="md:col-span-1 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-muted/50 border border-border flex items-center justify-center text-xs font-mono font-bold text-muted-foreground group-hover:border-[#0ea5e9] group-hover:text-[#0ea5e9] transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Track Info + Cover Thumbnail */}
                <div className="md:col-span-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0 relative">
                    {song.coverImage ? (
                      <img src={song.coverImage} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0ea5e9]/20 text-[#0ea5e9]">
                        <Disc className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-5 h-5 text-[#0ea5e9] fill-current" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-foreground font-black text-base truncate group-hover:text-[#0ea5e9] transition-colors">
                      {title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {song.releaseYear || '2025'} • {song.projectType}
                    </p>
                  </div>
                </div>

                {/* Artists */}
                <div className="md:col-span-3 text-sm text-muted-foreground font-mono truncate">
                  {artistName}
                  {song.contributions?.length > 1 && (
                    <span className="ml-1.5 text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/60">
                      +{song.contributions.length - 1} more
                    </span>
                  )}
                </div>

                {/* Genre & Format */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-muted/50 border border-border text-xs font-mono text-primary">
                    {song.genres?.[0] || 'Stereo Master'}
                  </span>
                </div>

                {/* Action CTA */}
                <div className="md:col-span-2 flex items-center md:justify-end">
                  <span className="w-full md:w-auto justify-center px-4 py-2 rounded-xl bg-[#0ea5e9]/20 group-hover:bg-[#0ea5e9] text-[#0ea5e9] group-hover:text-foreground border border-[#0ea5e9]/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5">
                    PLAY MASTER <Play className="w-3.5 h-3.5 fill-current" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      )}
    </div>
  );
}
