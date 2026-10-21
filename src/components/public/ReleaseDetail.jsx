import Image from 'next/image';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/utils/t';
import { guestSlug } from '@/lib/utils/guestSlug';
import { roleLabel } from '@/lib/quoteRoles';
import { spotifyEmbedUrl, youtubeEmbedUrl } from '@/lib/utils/embeds';
import Vinyl from '@/components/music/Vinyl';
import Equalizer from '@/components/music/Equalizer';
import PillLink from '@/components/music/PillLink';
import SectionLabel from '@/components/music/SectionLabel';
import RecordSleeve from '@/components/music/RecordSleeve';
import Reveal from '@/components/music/Reveal';
import Waveform from '@/components/music/Waveform';

const TYPE_LABELS = { SONG: 'Song', MUSIC_VIDEO: 'Music video', COMMERCIAL: 'Commercial', MIXING_MASTERING: 'Mixing & mastering', POST_PRODUCTION: 'Post-production' };
const typeLabel = (type) => TYPE_LABELS[type] || type.replace(/_/g, ' ').toLowerCase();

/** Shared page body for /songs/[slug] and /projects/[slug]. */
export default function ReleaseDetail({ song, related = [], locale, basePath, backLabel, labels }) {
  const title = t(song, 'title', locale);
  const youtube = youtubeEmbedUrl(song.youtubeUrl);
  const spotify = spotifyEmbedUrl(song.spotifyUrl);
  const platforms = [['Spotify', song.spotifyUrl], ['YouTube', song.youtubeUrl], ['Facebook', song.facebookUrl]].filter(([, url]) => url);
  const seed = [...song.slug].reduce((sum, c) => sum + c.charCodeAt(0), 0);

  return (
    <>
      {/* Header: sleeve + title */}
      <section className="relative pt-32 md:pt-40 px-5 md:px-10 grain">
        <div className="max-w-7xl mx-auto">
          <Link href={basePath} className="inline-flex items-center gap-2 text-sm font-semibold text-smoke hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </Link>

          <div className="grid lg:grid-cols-[minmax(0,26rem)_1fr] gap-12 lg:gap-20 items-center mt-10">
            <Reveal>
              <div className="relative aspect-square mr-[22%]">
                <div className="absolute inset-[5%] translate-x-[32%]">
                  <div className="w-full h-full spin-record"><Vinyl image={song.coverImage} label="RST" /></div>
                </div>
                <div className="relative z-10 h-full rounded-[1.6rem] overflow-hidden bg-ink shadow-[0_30px_70px_-30px_rgba(21,23,15,0.8)]">
                  {song.coverImage ? (
                    <Image src={song.coverImage} alt={title} fill sizes="(max-width: 1024px) 80vw, 420px" className="object-cover" priority />
                  ) : (
                    <div className="h-full flex flex-col justify-between p-8 bg-lime text-ink">
                      <Equalizer bars={6} className="h-8" />
                      <span className="display text-5xl break-words">{title}</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <SectionLabel>{typeLabel(song.projectType)}</SectionLabel>
              <h1 className="display text-[clamp(3rem,8vw,6.75rem)] mt-6 break-words">{title}</h1>
              {song.titleSi && song.titleSi !== title && <p className="text-xl text-smoke mt-4">{song.titleSi}</p>}

              <dl className="flex flex-wrap gap-x-10 gap-y-4 mt-8">
                {song.releaseYear && (
                  <div><dt className="eyebrow text-smoke">{labels.releaseYear}</dt><dd className="font-display font-bold text-2xl mt-1">{song.releaseYear}</dd></div>
                )}
                {song.genres?.length > 0 && (
                  <div><dt className="eyebrow text-smoke">{labels.genre}</dt><dd className="font-display font-bold text-2xl mt-1">{song.genres.join(', ')}</dd></div>
                )}
                {song.contributions.length > 0 && (
                  <div><dt className="eyebrow text-smoke">Credits</dt><dd className="font-display font-bold text-2xl mt-1">{song.contributions.length}</dd></div>
                )}
              </dl>

              {song.description && <p className="mt-8 text-lg text-ink/75 leading-relaxed max-w-xl whitespace-pre-line">{song.description}</p>}

              {platforms.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-8">
                  {platforms.map(([label, url], i) => (
                    <PillLink key={label} href={url} external variant={i === 0 ? 'ink' : 'outline'} icon={ExternalLink}>{label}</PillLink>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
          <Waveform seed={seed} progress={0.35} className="h-12 w-full mt-16 text-ink/15" playedClassName="fill-ink" />
        </div>
      </section>

      {/* Player */}
      {(youtube || spotify) && (
        <section className="px-5 md:px-10 pt-10">
          <div className="max-w-5xl mx-auto">
            {youtube ? (
              <div className="aspect-video rounded-[2rem] overflow-hidden bg-ink">
                <iframe src={youtube} title={title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            ) : (
              <iframe src={spotify} title={title} width="100%" height="352" className="rounded-[1.5rem]" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
            )}
          </div>
        </section>
      )}

      {/* Credits as liner notes */}
      {song.contributions.length > 0 && (
        <section className="px-5 md:px-10 pt-28">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[22rem_1fr] gap-12">
            <Reveal>
              <SectionLabel>Liner notes</SectionLabel>
              <h2 className="display text-[clamp(2.75rem,6vw,4.5rem)] mt-5">Who played<br />on this.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul>
                {song.contributions.map((c) => {
                  const name = c.name || c.profile?.name;
                  const image = c.profile?.imageUrl || c.imageUrl;
                  return (
                    <li key={c.id}>
                      <Link href={`/contributors/${c.profile?.slug || guestSlug(name)}`} className="group flex items-center gap-5 py-4 px-4 -mx-4 rounded-2xl border-b border-ink/10 hover:bg-ink hover:text-paper hover:border-transparent transition-colors">
                        <span className="relative w-12 h-12 rounded-full overflow-hidden bg-ink shrink-0">
                          {image ? <Image src={image} alt="" fill sizes="48px" className="object-cover" /> : <span className="absolute inset-1"><Vinyl label={name.charAt(0)} /></span>}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display font-bold text-xl md:text-2xl truncate">{name}</span>
                        </span>
                        <span className="eyebrow text-smoke group-hover:text-lime text-[0.65rem] text-right">{roleLabel(c.role)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {/* More releases */}
      {related.length > 0 && (
        <section className="px-5 md:px-10 pt-28">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <h2 className="display text-[clamp(2.75rem,6vw,4.5rem)]">Up next.</h2>
              <PillLink href={basePath} variant="outline">{backLabel}</PillLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 pr-[8%]">
              {related.map((r, i) => (
                <RecordSleeve
                  key={r.id}
                  href={`${basePath}/${r.slug}`}
                  title={t(r, 'title', locale)}
                  cover={r.coverImage}
                  meta={[r.releaseYear, r.genres?.[0]].filter(Boolean).join(' — ')}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nudge to book */}
      <section className="px-5 md:px-10 pt-28">
        <div className="max-w-7xl mx-auto rounded-[2rem] bg-lime text-ink p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h2 className="display text-[clamp(2.5rem,5vw,4rem)]">Want a sound<br />like this?</h2>
          <div className="flex flex-wrap gap-3">
            <PillLink href="/quote" variant="ink">Get a quote</PillLink>
            <PillLink href="/contact" variant="outline">Talk to us</PillLink>
          </div>
        </div>
      </section>
    </>
  );
}
