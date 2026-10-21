import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { safeExternalUrl } from '@/lib/settings';
import { roleLabel } from '@/lib/quoteRoles';
import { t } from '@/lib/utils/t';
import Vinyl from '@/components/music/Vinyl';
import SectionLabel from '@/components/music/SectionLabel';
import TrackRow from '@/components/music/TrackRow';
import PillLink from '@/components/music/PillLink';
import Reveal from '@/components/music/Reveal';
import Waveform from '@/components/music/Waveform';

const SOCIALS = [['instagram', 'Instagram'], ['spotify', 'Spotify'], ['youtube', 'YouTube'], ['facebook', 'Facebook']];

/**
 * Public profile for a contributor (or a credited guest without a profile).
 * @param {Array} projects - [{ song, roles }] for published releases they're credited on
 */
export default function ContributorProfile({ profile, projects = [], locale }) {
  // Social links are entered by artists, so only http(s) URLs are rendered
  const socials = SOCIALS
    .map(([key, label]) => [label, safeExternalUrl(profile.socialLinks?.[key])])
    .filter(([, url]) => url);
  const years = projects.map((p) => p.song.releaseYear).filter(Boolean);
  const span = years.length ? (Math.min(...years) === Math.max(...years) ? `${Math.max(...years)}` : `${Math.min(...years)}–${Math.max(...years)}`) : null;

  return (
    <>
      <section className="relative pt-32 md:pt-40 px-5 md:px-10 grain">
        <div className="max-w-7xl mx-auto">
          <Link href="/contributors" className="inline-flex items-center gap-2 text-sm font-semibold text-smoke hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> The band
          </Link>

          <div className="grid lg:grid-cols-[minmax(0,24rem)_1fr] gap-12 lg:gap-20 items-end mt-10">
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-ink">
                  {profile.imageUrl ? (
                    <Image src={profile.imageUrl} alt={profile.name} fill sizes="(max-width: 1024px) 80vw, 400px" className="object-cover" priority />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-10"><Vinyl spinning label={profile.name.charAt(0)} /></div>
                  )}
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 md:w-28"><Vinyl spinning label="RST" /></div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <SectionLabel>{profile.mainRole || 'Credited artist'}</SectionLabel>
              <h1 className="display text-[clamp(3.25rem,9vw,7.5rem)] mt-6 break-words">{profile.name}</h1>
              {profile.bio && <p className="mt-8 text-lg text-ink/75 leading-relaxed max-w-xl whitespace-pre-line">{profile.bio}</p>}

              <dl className="flex flex-wrap gap-x-12 gap-y-4 mt-10">
                <div><dt className="eyebrow text-smoke">Credits</dt><dd className="display text-5xl mt-1">{projects.length}</dd></div>
                {span && <div><dt className="eyebrow text-smoke">Active</dt><dd className="display text-5xl mt-1">{span}</dd></div>}
              </dl>

              {socials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {socials.map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-ink hover:text-paper transition-colors">
                      {label} ↗
                    </a>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
          <Waveform seed={profile.name.length * 13} className="h-12 w-full mt-20 text-ink/15" />
        </div>
      </section>

      <section className="px-5 md:px-10 pt-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[22rem_1fr] gap-12">
          <Reveal>
            <SectionLabel>Discography</SectionLabel>
            <h2 className="display text-[clamp(2.75rem,6vw,4.5rem)] mt-5">On the<br />record.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            {projects.length === 0 ? (
              <p className="text-smoke text-lg">No published releases yet.</p>
            ) : (
              projects.map(({ song, roles }, i) => (
                <TrackRow
                  key={song.id}
                  number={i + 1}
                  title={t(song, 'title', locale) || song.titleEn}
                  subtitle={roles.map(roleLabel).join(' · ')}
                  href={`/${song.projectType === 'SONG' ? 'songs' : 'projects'}/${song.slug}`}
                  end={song.releaseYear ? <span className="hidden sm:inline tabular-nums">{song.releaseYear}</span> : null}
                />
              ))
            )}
          </Reveal>
        </div>
      </section>

      {profile.galleryImages?.length > 0 && (
        <section className="px-5 md:px-10 pt-28">
          <div className="max-w-7xl mx-auto">
            <h2 className="display text-[clamp(2.75rem,6vw,4.5rem)] mb-10">In session.</h2>
            <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4">
              {profile.galleryImages.map((img, i) => (
                <div key={img} className="relative rounded-[1.4rem] overflow-hidden bg-paper-2">
                  <Image src={img} alt={`${profile.name} in session ${i + 1}`} width={600} height={600} className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 md:px-10 pt-28">
        <div className="max-w-7xl mx-auto rounded-[2rem] bg-ink text-paper p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h2 className="display text-[clamp(2.5rem,5vw,4rem)]">Work with<br /><span className="text-lime">{profile.name}.</span></h2>
          <div className="flex flex-wrap gap-3">
            <PillLink href="/quote" variant="lime">Build a quote</PillLink>
            <PillLink href="/contact" variant="light">Get in touch</PillLink>
          </div>
        </div>
      </section>
    </>
  );
}
