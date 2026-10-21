import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Gamepad2, Trophy, Headphones, Mic2, SlidersHorizontal, Music4 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/db';
import { t } from '@/lib/utils/t';
import { getPublicSettings } from '@/lib/settings';
import HeroVideo from '@/components/shared/HeroVideo';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import Vinyl from '@/components/music/Vinyl';
import Equalizer from '@/components/music/Equalizer';
import Marquee from '@/components/music/Marquee';
import Waveform from '@/components/music/Waveform';
import Reveal from '@/components/music/Reveal';
import PillLink from '@/components/music/PillLink';
import SectionLabel from '@/components/music/SectionLabel';
import RecordSleeve from '@/components/music/RecordSleeve';
import TrackRow from '@/components/music/TrackRow';

export async function generateMetadata() {
  return {
    title: 'Home | RST Style Studio LK',
    description: 'Professional music production, mixing, and mastering studio in Sri Lanka.',
  };
}

// Shown in the setlist until services are added in Admin → Services
const DEFAULT_SERVICES = [
  { id: 'mixing', name: 'Mixing', description: 'Balance, depth and clarity for a radio-ready blend.', Icon: SlidersHorizontal },
  { id: 'mastering', name: 'Mastering', description: 'The final polish, so it translates on every speaker and platform.', Icon: Headphones },
  { id: 'vocals', name: 'Vocal Production', description: 'Comping, tuning and processing that put the voice up front.', Icon: Mic2 },
  { id: 'scoring', name: 'Arrangement & Scoring', description: 'Original arrangements for songs, films and commercials.', Icon: Music4 },
];

const DEFAULT_GENRES = ['Sinhala Pop', 'Baila', 'R&B', 'Classical', 'Film Scores', 'Hip-Hop', 'Acoustic', 'Devotional'];

export default async function HomePage({ params }) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'Hero' });
  const tStats = await getTranslations({ locale, namespace: 'Stats' });
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });
  const settings = await getPublicSettings();

  let featuredSongs = [];
  let featuredProfiles = [];
  let services = [];
  let stats = { songs: 0, projects: 0, mastered: 0, contributors: 0 };

  try {
    const published = { deletedAt: null, isDraft: false };
    featuredSongs = await prisma.song.findMany({
      where: { ...published, isFeatured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
    if (featuredSongs.length === 0) {
      featuredSongs = await prisma.song.findMany({ where: published, take: 6, orderBy: { createdAt: 'desc' } });
    }

    let songCount, projectCount, masteredCount, contributorCount;
    [featuredProfiles, services, songCount, projectCount, masteredCount, contributorCount] = await Promise.all([
      prisma.profile.findMany({
        where: { isActive: true, isApproved: true, deletedAt: null },
        take: 6,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.service.findMany({ where: { isActive: true, deletedAt: null }, orderBy: { sortOrder: 'asc' }, take: 6 }),
      prisma.song.count({ where: { ...published, projectType: 'SONG' } }),
      prisma.song.count({ where: { ...published, projectType: { not: 'SONG' } } }),
      prisma.song.count({ where: { ...published, projectType: { in: ['MIXING_MASTERING', 'POST_PRODUCTION'] } } }),
      prisma.profile.count({ where: { isActive: true, isApproved: true, deletedAt: null } }),
    ]);
    stats = { songs: songCount, projects: projectCount, mastered: masteredCount, contributors: contributorCount };
  } catch (e) {
    console.error('Failed fetching Home Page data:', e);
  }

  const latest = featuredSongs[0];
  const songHref = (song) => `/${song.projectType === 'SONG' ? 'songs' : 'projects'}/${song.slug}`;
  const genres = [...new Set(featuredSongs.flatMap((s) => s.genres || []))];
  const marqueeGenres = genres.length >= 4 ? genres : DEFAULT_GENRES;

  const setlist = services.length > 0
    ? services.map((s) => ({ id: s.id, name: t(s, 'name', locale), description: t(s, 'description', locale), price: s.basePrice }))
    : DEFAULT_SERVICES;

  const statItems = [
    { value: stats.songs + stats.projects, label: tStats('projectsLabel'), desc: tStats('projectsDesc') },
    { value: stats.mastered, label: tStats('masteredLabel'), desc: tStats('masteredDesc') },
    { value: stats.contributors, label: 'Artists & engineers', desc: 'In the RST collective' },
  ].filter((s) => s.value > 0);

  return (
    <div className="flex flex-col">
      {/* ── Intro: name, video, latest release ─────────────────────── */}
      <section className="relative pt-32 md:pt-36 px-5 md:px-10 grain">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <Reveal>
              <SectionLabel side="A">Music production · Sri Lanka</SectionLabel>
              <h1 className="display text-[clamp(4rem,14vw,12.5rem)] mt-6">
                <span className="block">RST Style</span>
                <span className="flex items-center">
                  Studi
                  <span className="inline-block w-[0.78em] ml-[0.04em] translate-y-[0.03em]">
                    <Vinyl spinning label="" />
                  </span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.15} className="lg:max-w-sm lg:pb-6">
              <p className="text-lg text-smoke leading-relaxed">{tHero('subtitle')}</p>
              <div className="flex flex-wrap gap-3 mt-7">
                <PillLink href="/quote" variant="lime">{tHero('cta')}</PillLink>
                <PillLink href="/songs" variant="outline">Listen to our work</PillLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative mt-12">
            <div className="relative aspect-[4/5] sm:aspect-video rounded-[2rem] overflow-hidden bg-ink">
              <HeroVideo autoPlayWithSound={settings?.autoPlayMusic ?? false} />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-paper/90 backdrop-blur px-4 py-2 text-sm font-semibold">
                <Equalizer bars={4} className="h-3.5" />
                In the studio
              </div>
            </div>

            {latest && (
              <Link
                href={songHref(latest)}
                className="group md:absolute md:-bottom-10 md:left-8 mt-4 md:mt-0 flex items-center gap-4 rounded-2xl bg-paper p-3 pr-6 shadow-[0_20px_50px_-25px_rgba(21,23,15,0.6)] md:max-w-sm"
              >
                <span className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-ink">
                  {latest.coverImage ? (
                    <Image src={latest.coverImage} alt="" fill sizes="64px" className="object-cover" />
                  ) : (
                    <span className="absolute inset-2"><Vinyl label="" /></span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block eyebrow text-smoke text-[0.62rem]">Latest release</span>
                  <span className="block font-display font-bold text-lg leading-tight truncate group-hover:underline">{t(latest, 'title', locale)}</span>
                  {latest.releaseYear && <span className="block text-xs text-smoke">{latest.releaseYear}</span>}
                </span>
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── Genre ticker ───────────────────────────────────────────── */}
      <section className="mt-24 md:mt-32 -rotate-2 scale-105">
        <Marquee items={marqueeGenres} className="bg-lime text-ink py-5 md:py-7" duration={40} />
      </section>

      {/* ── A message from the studio ──────────────────────────────── */}
      <section className="px-5 md:px-10 py-28 md:py-36">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_20rem] gap-14 items-center">
          <Reveal>
            <p className="eyebrow text-smoke mb-8">Liner notes</p>
            <p className="font-display font-semibold text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.12] tracking-tight">
              We don&apos;t just record songs. We <span className="mark">produce</span> stories,{' '}
              <span className="mark">arrange</span> emotions and <span className="mark">master</span> every detail — so
              your music sounds like you, everywhere it plays.
            </p>
            <p className="font-handwritten text-4xl md:text-5xl mt-10 -rotate-3 inline-block">— the RST family</p>
          </Reveal>
          <Reveal delay={0.15}>
            <figure className="relative">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-ink rotate-2">
                <Image src="/sampath1.jpg" alt="Founding composer of RST Style Studio" fill sizes="320px" className="object-cover grayscale" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-28">
                <Vinyl spinning label="RST" />
              </div>
              <figcaption className="eyebrow text-smoke mt-12 text-right">Founding composer</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Side A / Side B ────────────────────────────────────────── */}
      <section className="px-5 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5">
          {[
            { side: 'A', title: tNav('songs'), href: '/songs', count: stats.songs, blurb: 'Original songs written, produced and mastered at RST.', tone: 'bg-ink text-paper', vinyl: 'RST' },
            { side: 'B', title: tNav('projects'), href: '/projects', count: stats.projects, blurb: 'Film scores, commercials, mixing & mastering for other artists.', tone: 'bg-lime text-ink', vinyl: 'B' },
          ].map((tile, i) => (
            <Reveal key={tile.side} delay={i * 0.1}>
              <Link href={tile.href} className={`group relative block overflow-hidden rounded-[2rem] p-8 md:p-12 min-h-[26rem] ${tile.tone}`}>
                <div className="absolute -right-28 -bottom-36 w-72 md:w-80 transition-transform duration-700 group-hover:-translate-x-8 group-hover:-translate-y-8 group-hover:rotate-45">
                  <Vinyl label={tile.vinyl} />
                </div>
                <p className="eyebrow opacity-60 relative z-10">Side {tile.side}</p>
                <h2 className="display text-[clamp(3.5rem,8vw,7rem)] mt-4 relative z-10">{tile.title}</h2>
                <p className="mt-6 max-w-xs opacity-75 relative z-10">{tile.blurb}</p>
                {tile.count > 0 && (
                  <p className="mt-8 relative z-10 font-display font-bold text-2xl">{tile.count} <span className="text-base font-sans font-semibold opacity-60">tracks</span></p>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Featured releases as record sleeves ────────────────────── */}
      {featuredSongs.length > 0 && (
        <section className="px-5 md:px-10 pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <Reveal>
                <SectionLabel>The collection</SectionLabel>
                <h2 className="display text-[clamp(3rem,7vw,6rem)] mt-5">Fresh off<br />the press.</h2>
              </Reveal>
              <PillLink href="/songs" variant="outline">All releases</PillLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 pr-[8%]">
              {featuredSongs.map((song, i) => (
                <Reveal key={song.id} delay={(i % 3) * 0.08}>
                  <RecordSleeve
                    href={songHref(song)}
                    title={t(song, 'title', locale)}
                    cover={song.coverImage}
                    meta={[song.releaseYear, song.genres?.slice(0, 2).join(' · ')].filter(Boolean).join(' — ')}
                    tags={song.isFeatured ? ['Featured'] : []}
                    index={i}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Services as a setlist ──────────────────────────────────── */}
      <section className="px-5 md:px-10 pt-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[22rem_1fr] gap-12">
          <Reveal>
            <SectionLabel>Studio sessions</SectionLabel>
            <h2 className="display text-[clamp(3rem,6vw,5rem)] mt-5">Tonight&apos;s setlist.</h2>
            <p className="mt-6 text-smoke leading-relaxed">Pick the sessions you need, or build a full team in the quotation wizard and get an instant estimate.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PillLink href="/services" variant="ink">{tNav('services')}</PillLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              {setlist.map((service, i) => (
                <TrackRow
                  key={service.id}
                  number={i + 1}
                  title={service.name}
                  subtitle={service.description}
                  href="/services"
                  end={service.price ? <span className="hidden sm:inline">from Rs {service.price.toLocaleString()}</span> : null}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Studio stats ───────────────────────────────────────────── */}
      {statItems.length > 0 && (
        <section className="px-5 md:px-10 pt-32">
          <div className="max-w-7xl mx-auto rounded-[2rem] bg-paper-2 p-8 md:p-14">
            <div className={`grid gap-10 ${statItems.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              {statItems.map((s) => (
                <div key={s.label}>
                  <p className="display text-[clamp(4rem,9vw,7.5rem)]">{s.value}<span className="text-smoke">+</span></p>
                  <p className="eyebrow mt-3">{s.label}</p>
                  <p className="text-sm text-smoke mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
            <Waveform seed={23} progress={0.62} className="h-14 w-full mt-12 text-ink/20" playedClassName="fill-ink" />
          </div>
        </section>
      )}

      {/* ── The band: featured contributors ────────────────────────── */}
      {featuredProfiles.length > 0 && (
        <section className="px-5 md:px-10 pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <Reveal>
                <SectionLabel>The band</SectionLabel>
                <h2 className="display text-[clamp(3rem,7vw,6rem)] mt-5">Meet the people<br />behind the sound.</h2>
              </Reveal>
              <PillLink href="/contributors" variant="outline">{tNav('contributors')}</PillLink>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {featuredProfiles.map((profile, i) => (
                <Reveal key={profile.id} delay={(i % 6) * 0.06}>
                  <Link href={`/contributors/${profile.slug}`} className="group block text-center">
                    <span className="relative block aspect-square rounded-full overflow-hidden bg-ink ring-4 ring-transparent group-hover:ring-lime transition-all">
                      {profile.imageUrl ? (
                        <Image src={profile.imageUrl} alt={profile.name} fill sizes="200px" className="object-cover grayscale group-hover:grayscale-0 transition duration-500" />
                      ) : (
                        <span className="absolute inset-3"><Vinyl label={profile.name.charAt(0)} /></span>
                      )}
                    </span>
                    <span className="block font-display font-bold text-lg mt-4 leading-tight">{profile.name}</span>
                    {profile.mainRole && <span className="block text-xs text-smoke mt-1">{profile.mainRole}</span>}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Music Arcade ───────────────────────────────────────────── */}
      <section className="px-5 md:px-10 pt-32">
        <Reveal>
          <div className="max-w-7xl mx-auto rounded-[2rem] bg-ink text-paper overflow-hidden relative">
            <div className="grid lg:grid-cols-2 gap-10 p-8 md:p-14 relative">
              <div>
                <SectionLabel tone="paper">Bonus track</SectionLabel>
                <h2 className="display text-[clamp(3rem,7vw,6rem)] mt-5">The Music<br /><span className="text-lime">Arcade.</span></h2>
                <p className="mt-6 text-paper/70 max-w-md leading-relaxed">
                  Five mini-games for music lovers. Play once a month, climb the leaderboard and win studio prizes.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <PillLink href="/games" variant="lime" icon={Gamepad2}>Play now</PillLink>
                  <PillLink href="/games/leaderboards" variant="light" icon={Trophy}>Leaderboards</PillLink>
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-3 self-center">
                {['SL Music IQ', 'Pitch Match', 'Name That Tune', 'Theory Master', 'Rhythm Tap'].map((game, i) => (
                  <li key={game} className={`rounded-2xl p-5 ${i === 0 ? 'col-span-2 bg-lime text-ink' : 'bg-ink-2'}`}>
                    <Equalizer bars={i + 2} className="h-5" />
                    <span className="block font-display font-bold text-xl mt-6">{game}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {(settings?.displayClientReviews ?? true) && <TestimonialsSection />}
    </div>
  );
}
