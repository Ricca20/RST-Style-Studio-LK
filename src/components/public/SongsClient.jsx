'use client';
import { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Play, PlayCircle, Film, MonitorPlay, Filter } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';

export default function SongsClient({ initialSongs, genres, locale }) {
  const tSongs = useTranslations('Songs');
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeGenre, setActiveGenre] = useState('ALL');

  const tabs = [
    { id: 'ALL', label: 'All Works', icon: Play },
    { id: 'SONG', label: 'Music Audio', icon: PlayCircle },
    { id: 'MUSIC_VIDEO', label: 'Music Videos', icon: Film },
    { id: 'COMMERCIAL', label: 'Commercials', icon: MonitorPlay },
  ];

  const filteredSongs = useMemo(() => {
    return initialSongs.filter(song => {
      const matchType = activeTab === 'ALL' || song.projectType === activeTab;
      const matchGenre = activeGenre === 'ALL' || (song.genres && song.genres.includes(activeGenre));
      return matchType && matchGenre;
    });
  }, [initialSongs, activeTab, activeGenre]);

  const t = (obj, key, loc) => {
    // Basic translation helper for client side matching backend t()
    if (!obj || !obj[`${key}En`]) return obj?.[key] || '';
    return loc === 'si' && obj[`${key}Si`] ? obj[`${key}Si`] : obj[`${key}En`];
  };

  return (
    <>
      {/* Filters + Title */}
      <div className="flex flex-col mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <h2 className="text-3xl font-black text-white tracking-tight">{tSongs('latest') || 'Our Latest Works'}</h2>
          
          {/* Project Type Tabs */}
          <div className="flex bg-[#1e293b] p-1.5 rounded-2xl border border-white/5 shadow-inner overflow-x-auto max-w-full no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#0ea5e9] text-white shadow-[0_0_20px_rgba(14, 165, 233,0.3)]'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Filters (Secondary) */}
        {genres.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-2 no-scrollbar">
            <span className="text-white/30 text-sm font-bold uppercase tracking-widest flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => setActiveGenre('ALL')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeGenre === 'ALL'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-transparent text-white/40 border border-white/5 hover:border-white/20'
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  activeGenre === genre
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-transparent text-white/40 border border-white/5 hover:border-white/20'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Songs Grid */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-white/5 bg-[#1a1620]">
          <span className="material-symbols-outlined text-6xl text-white/5 mb-4 block">music_off</span>
          <p className="text-white/40 text-lg font-light">No works found matching these filters.</p>
          <button 
            onClick={() => { setActiveTab('ALL'); setActiveGenre('ALL'); }}
            className="mt-6 text-[#0ea5e9] font-bold text-sm hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {filteredSongs.map((song) => (
            <TiltCard key={song.id}>
              <Link
                href={`/songs/${song.slug}`}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer bg-[#1a1620] shadow-xl border border-white/5 block h-full w-full"
              >
              {/* Project Type Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-wider">
                {song.projectType === 'MUSIC_VIDEO' ? <Film className="w-3 h-3 text-pink-400" /> : 
                 song.projectType === 'COMMERCIAL' ? <MonitorPlay className="w-3 h-3 text-blue-400" /> : 
                 <PlayCircle className="w-3 h-3 text-[#0ea5e9]" />}
                {song.projectType === 'MUSIC_VIDEO' ? 'Video' : song.projectType === 'COMMERCIAL' ? 'Comm.' : 'Audio'}
              </div>

              {/* Cover Image */}
              <div className="absolute inset-0">
                {song.coverImage ? (
                  <img
                    src={song.coverImage}
                    alt={t(song, 'title', locale)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1620] to-[#334155] flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-white/10">music_note</span>
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition-all duration-300 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center z-10">
                {/* Play Button */}
                <div className="scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-75">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#0ea5e9] text-white shadow-[0_0_40px_rgba(14, 165, 233,0.6)]">
                    {song.projectType === 'MUSIC_VIDEO' ? (
                      <Film className="w-8 h-8 ml-1" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </div>
                </div>
              </div>

              {/* Default Bottom Bar (Gradient always visible to make text readable) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 z-20 transition-transform duration-300 group-hover:translate-y-2 group-hover:opacity-0">
                <h4 className="text-white font-black text-xl tracking-tight leading-tight mb-1">{t(song, 'title', locale)}</h4>
                <p className="text-[#0ea5e9] text-sm font-bold">
                  {song.contributions?.[0]?.contributor
                    ? t(song.contributions[0].contributor, 'name', locale)
                    : song.genres && song.genres.length > 0
                    ? song.genres[0]
                    : 'RST Studio'}
                </p>
              </div>

              {/* Active Hover Info (Slides up) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h4 className="text-white font-black text-xl tracking-tight leading-tight mb-2">{t(song, 'title', locale)}</h4>
                <div className="flex justify-between items-end">
                  <p className="text-white/60 text-sm font-medium line-clamp-2 pr-4">
                    {t(song, 'description', locale) || 'No description available.'}
                  </p>
                  {/* Sound Wave Visual */}
                  {song.projectType !== 'MUSIC_VIDEO' && (
                    <div className="flex gap-1 h-5 items-end pb-1 shrink-0">
                      <div className="w-1 bg-[#0ea5e9] rounded-full h-3 animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 bg-[#0ea5e9] rounded-full h-5 animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 bg-[#0ea5e9] rounded-full h-2 animate-pulse" style={{ animationDelay: '300ms' }} />
                      <div className="w-1 bg-[#0ea5e9] rounded-full h-4 animate-pulse" style={{ animationDelay: '450ms' }} />
                    </div>
                  )}
                </div>
              </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      )}
    </>
  );
}
