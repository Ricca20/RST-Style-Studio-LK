'use client';

import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, LayoutGrid, ListMusic, X, ExternalLink, Play } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/utils/t';
import { guestSlug } from '@/lib/utils/guestSlug';
import { roleLabel } from '@/lib/quoteRoles';
import { spotifyEmbedUrl, youtubeEmbedUrl } from '@/lib/utils/embeds';
import Vinyl from '@/components/music/Vinyl';
import Equalizer from '@/components/music/Equalizer';
import PillLink from '@/components/music/PillLink';

const formatLabel = (value) => value.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

/**
 * Browsable catalogue of releases (used by Songs and Projects).
 * @param {Array} items - songs with contributions (+profile)
 * @param {'genre'|'type'} filterBy - filter chips by genre or by project type
 * @param {string} basePath - '/songs' or '/projects', for detail links
 */
export default function CatalogClient({ items = [], locale = 'en', filterBy = 'genre', basePath = '/songs', noun = 'release' }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [view, setView] = useState('sleeves');
  const [playing, setPlaying] = useState(null);

  const filterOptions = useMemo(() => {
    const values = filterBy === 'genre' ? items.flatMap((i) => i.genres || []) : items.map((i) => i.projectType);
    return [...new Set(values.filter(Boolean))];
  }, [items, filterBy]);

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      const matchesFilter = filter === 'ALL'
        || (filterBy === 'genre' ? (item.genres || []).includes(filter) : item.projectType === filter);
      if (!matchesFilter) return false;
      if (!q) return true;
      return [item.titleEn, item.titleSi, ...(item.genres || []), ...(item.contributions || []).map((c) => c.name || c.profile?.name)]
        .some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [items, filter, filterBy, query]);

  // Close the player with Escape
  const onKeyDown = useEffectEvent((e) => {
    if (e.key === 'Escape') setPlaying(null);
  });
  useEffect(() => {
    if (!playing) return;
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playing]);

  const titleOf = (item) => t(item, 'title', locale) || item.titleEn;
  const metaOf = (item) => [item.releaseYear, (item.genres || []).slice(0, 2).join(' · ')].filter(Boolean).join(' — ');

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-8 border-b border-ink/10">
        <div className="flex flex-wrap gap-2">
          {['ALL', ...filterOptions].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${filter === option ? 'bg-ink text-paper border-ink' : 'border-ink/15 hover:border-ink/50'}`}
            >
              {option === 'ALL' ? 'All' : filterBy === 'type' ? formatLabel(option) : option}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="relative flex-1 lg:w-72">
            <span className="sr-only">Search</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, artists, genres"
              className="w-full rounded-full border border-ink/15 bg-paper pl-11 pr-4 py-2.5 text-sm placeholder:text-smoke focus:outline-none focus:border-ink"
            />
          </label>
          <div className="flex rounded-full border border-ink/15 p-1" role="group" aria-label="View">
            {[['sleeves', LayoutGrid, 'Sleeves'], ['list', ListMusic, 'Tracklist']].map(([key, Icon, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                aria-pressed={view === key}
                title={label}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${view === key ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="eyebrow text-smoke mt-6 mb-10">{visible.length} {visible.length === 1 ? noun : `${noun}s`}</p>

      {visible.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-28 mx-auto opacity-40"><Vinyl label="?" /></div>
          <p className="display text-4xl mt-8">Nothing on this side.</p>
          <p className="text-smoke mt-3">Try another filter or search.</p>
        </div>
      ) : view === 'sleeves' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 pr-[8%]">
          {visible.map((item, i) => (
            <button key={item.id} type="button" onClick={() => setPlaying(item)} className="group text-left">
              <div className="relative aspect-square">
                <div className="absolute inset-[5%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[30%]">
                  <div className="w-full h-full sleeve-vinyl"><Vinyl image={item.coverImage} label="RST" sizes="200px" /></div>
                </div>
                <div className="relative z-10 h-full rounded-[1.4rem] overflow-hidden bg-ink shadow-[0_25px_60px_-30px_rgba(21,23,15,0.8)]">
                  {item.coverImage ? (
                    <Image src={item.coverImage} alt="" fill sizes="(max-width: 768px) 90vw, 30vw" className="object-cover" />
                  ) : (
                    <div className={`h-full flex flex-col justify-between p-6 ${i % 2 ? 'bg-lime text-ink' : 'bg-ink text-paper'}`}>
                      <Equalizer bars={5} className="h-6" />
                      <span className="display text-3xl md:text-4xl break-words">{titleOf(item)}</span>
                    </div>
                  )}
                  <span className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-lime text-ink flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </div>
              </div>
              <h3 className="display text-2xl md:text-3xl leading-none mt-5 truncate">{titleOf(item)}</h3>
              <p className="mt-2 text-sm text-smoke">{metaOf(item)}</p>
            </button>
          ))}
        </div>
      ) : (
        <ol>
          {visible.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setPlaying(item)}
                className="group w-full text-left flex items-center gap-4 md:gap-8 py-4 px-4 -mx-4 rounded-2xl border-b border-ink/10 hover:bg-ink hover:text-paper hover:border-transparent transition-colors"
              >
                <span className="font-display font-bold text-smoke group-hover:text-lime tabular-nums w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="relative w-14 h-14 rounded-lg overflow-hidden bg-ink shrink-0">
                  {item.coverImage ? <Image src={item.coverImage} alt="" fill sizes="56px" className="object-cover" /> : <span className="absolute inset-1.5"><Vinyl label="" /></span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block display text-xl md:text-3xl leading-none truncate">{titleOf(item)}</span>
                  <span className="block mt-1.5 text-sm text-smoke group-hover:text-paper/60 truncate">{metaOf(item)}</span>
                </span>
                {filterBy === 'type' && <span className="hidden md:inline eyebrow text-[0.62rem] opacity-60">{formatLabel(item.projectType)}</span>}
                <span className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center group-hover:bg-lime group-hover:text-ink group-hover:border-lime transition-colors shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {playing && (
        <PlayerModal item={playing} title={titleOf(playing)} meta={metaOf(playing)} href={`${basePath}/${playing.slug}`} onClose={() => setPlaying(null)} />
      )}
    </div>
  );
}

function PlayerModal({ item, title, meta, href, onClose }) {
  const youtube = youtubeEmbedUrl(item.youtubeUrl, { autoplay: true });
  const spotify = !youtube && spotifyEmbedUrl(item.spotifyUrl);

  return (
    <div className="fixed inset-0 z-[70] bg-ink/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-ink text-paper rounded-t-[2rem] sm:rounded-[2rem]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 p-6 md:p-8">
          <div className="min-w-0">
            <p className="eyebrow text-paper/50 flex items-center gap-2"><Equalizer bars={4} className="h-3 text-lime" /> Now playing</p>
            <h2 className="display text-3xl md:text-5xl mt-3 break-words">{title}</h2>
            {meta && <p className="text-paper/60 text-sm mt-2">{meta}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close player" className="w-11 h-11 rounded-full bg-paper/10 hover:bg-lime hover:text-ink flex items-center justify-center shrink-0 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 md:px-8">
          {youtube ? (
            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe src={youtube} title={title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : spotify ? (
            <iframe src={spotify} title={title} width="100%" height="352" className="rounded-2xl" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
          ) : (
            <div className="rounded-2xl bg-ink-2 p-8 flex items-center gap-6">
              <div className="w-24 shrink-0"><Vinyl image={item.coverImage} label="RST" /></div>
              <p className="text-paper/70">No stream is linked for this release yet.{(item.youtubeUrl || item.spotifyUrl || item.facebookUrl) && ' Listen on the platforms below.'}</p>
            </div>
          )}
        </div>

        {item.contributions?.length > 0 && (
          <div className="px-6 md:px-8 pt-8">
            <p className="eyebrow text-paper/40 mb-3">Credits</p>
            <div className="flex flex-wrap gap-2">
              {item.contributions.map((c) => (
                <Link
                  key={c.id}
                  href={`/contributors/${c.profile?.slug || guestSlug(c.name)}`}
                  onClick={onClose}
                  className="rounded-full border border-paper/15 px-3.5 py-1.5 text-sm hover:bg-lime hover:text-ink hover:border-lime transition-colors"
                >
                  <span className="font-semibold">{c.name || c.profile?.name}</span>
                  <span className="opacity-60"> · {roleLabel(c.role)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 p-6 md:p-8">
          <PillLink href={href} variant="lime">Full details</PillLink>
          {[['YouTube', item.youtubeUrl], ['Spotify', item.spotifyUrl], ['Facebook', item.facebookUrl]].filter(([, url]) => url).map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2.5 text-sm font-semibold hover:bg-paper hover:text-ink transition-colors">
              {label} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
