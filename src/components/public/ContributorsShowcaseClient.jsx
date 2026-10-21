'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { guestSlug } from '@/lib/utils/guestSlug';
import Vinyl from '@/components/music/Vinyl';

// Group free-text roles into a few filters
const SECTIONS = [
  { id: 'ALL', label: 'Everyone' },
  { id: 'ENGINEER', label: 'Producers & engineers', match: ['engineer', 'producer', 'mix', 'master', 'arrang', 'director'] },
  { id: 'VOCALIST', label: 'Vocalists', match: ['vocal', 'singer', 'duo', 'artist'] },
  { id: 'INSTRUMENTAL', label: 'Instrumentalists', match: ['guitar', 'piano', 'keyboard', 'flute', 'sitar', 'violin', 'drum', 'tabla', 'bass', 'instrument'] },
  { id: 'WRITER', label: 'Writers & composers', match: ['lyric', 'melody', 'compos', 'writer'] },
];

const sectionOf = (role = '') => {
  const lower = role.toLowerCase();
  return SECTIONS.find((s) => s.match?.some((m) => lower.includes(m)))?.id || 'ALL';
};

export default function ContributorsShowcaseClient({ contributors = [] }) {
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('ALL');

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return contributors.filter((c) => {
      if (section !== 'ALL' && sectionOf(c.mainRole) !== section) return false;
      return !q || [c.name, c.mainRole, c.bio].some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [contributors, query, section]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-8 border-b border-ink/10">
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              aria-pressed={section === s.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${section === s.id ? 'bg-ink text-paper border-ink' : 'border-ink/15 hover:border-ink/50'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="relative lg:w-72">
          <span className="sr-only">Search</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search names or roles"
            className="w-full rounded-full border border-ink/15 bg-paper pl-11 pr-4 py-2.5 text-sm placeholder:text-smoke focus:outline-none focus:border-ink"
          />
        </label>
      </div>

      <p className="eyebrow text-smoke mt-6 mb-10">{visible.length} {visible.length === 1 ? 'member' : 'members'}</p>

      {visible.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-28 mx-auto opacity-40"><Vinyl label="?" /></div>
          <p className="display text-4xl mt-8">No one by that name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {visible.map((c, i) => (
            <Link key={c.id || i} href={`/contributors/${c.slug || guestSlug(c.name)}`} className="group block">
              <div className="relative aspect-[4/5] rounded-[1.6rem] overflow-hidden bg-ink">
                {c.imageUrl ? (
                  <Image src={c.imageUrl} alt={c.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-700" />
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center p-8 ${i % 3 === 1 ? 'bg-lime' : 'bg-ink'}`}>
                    <div className="w-full group-hover:rotate-90 transition-transform duration-700"><Vinyl label={c.name.charAt(0)} /></div>
                  </div>
                )}
                {!c.slug && (
                  <span className="absolute top-3 left-3 eyebrow text-[0.6rem] rounded-full bg-paper/90 px-2.5 py-1">Guest</span>
                )}
                {c.creditsCount > 0 && (
                  <span className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-bold">
                    {c.creditsCount} {c.creditsCount === 1 ? 'credit' : 'credits'}
                  </span>
                )}
              </div>
              <p className="eyebrow text-smoke text-[0.62rem] mt-4 truncate">{c.mainRole}</p>
              <h3 className="font-display font-bold text-xl md:text-2xl leading-tight mt-1 group-hover:underline decoration-lime decoration-4 underline-offset-4">{c.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
