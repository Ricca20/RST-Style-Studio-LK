import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { t } from '@/lib/t';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PlayCircle, Film, MonitorPlay } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const song = await prisma.song.findUnique({ where: { slug } });
  
  if (!song) return {};
  
  const title = t(song, 'title', locale);
  const description = song.description || `Listen to ${title} on RST Style Studio LK.`;
  const image = song.coverImage || '/images/og-default.jpg';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
  };
}

export default async function SongDetailPage({ params }) {
  const { slug, locale } = await params;
  const tSongs = await getTranslations({ locale, namespace: 'Songs' });

  const song = await prisma.song.findUnique({
    where: { slug },
    include: {
      contributions: {
        include: { profile: true }
      },
    },
  });

  if (!song) return notFound();

  // Fetch related songs (same genre or just the latest)
  let relatedSongs = [];
  try {
    relatedSongs = await prisma.song.findMany({
      where: { id: { not: song.id } },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {}

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <main className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
          <Link href="/songs" className="hover:text-[#0ea5e9] transition-colors">
            Portfolio
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          {song.genres && song.genres.length > 0 && (
            <>
              <span className="hover:text-[#0ea5e9] transition-colors">{song.genres[0]}</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </>
          )}
          <span className="text-white">{t(song, 'title', locale)}</span>
        </div>

        {/* Project Hero — 2 Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Left: Album Art */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative group aspect-square w-full rounded-2xl overflow-hidden shadow-2xl shadow-[#0ea5e9]/10 border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/80 to-transparent opacity-60 z-10" />
              {song.coverImage ? (
                <img
                  src={song.coverImage}
                  alt={t(song, 'title', locale)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1e293b] to-[#334155] flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-white/10">album</span>
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Released</span>
              </div>
            </div>
          </div>

          {/* Right: Details & Player */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Title & Type */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-white uppercase tracking-wider">
                  {song.projectType === 'MUSIC_VIDEO' ? <Film className="w-4 h-4 text-pink-400" /> : 
                   song.projectType === 'COMMERCIAL' ? <MonitorPlay className="w-4 h-4 text-blue-400" /> : 
                   <PlayCircle className="w-4 h-4 text-[#0ea5e9]" />}
                  {song.projectType === 'MUSIC_VIDEO' ? 'Music Video' : song.projectType === 'COMMERCIAL' ? 'Commercial' : 'Audio Track'}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
                {t(song, 'title', locale)}
              </h1>
            </div>

            {/* Genre Chip */}
            <div className="flex flex-wrap gap-3 mb-8">
              {song.genres && song.genres.map(g => (
                <div key={g} className="px-4 py-1.5 rounded-full bg-[#1e293b] border border-white/10 text-white/80 text-sm font-medium">
                  {g}
                </div>
              ))}
            </div>
            
            {/* Description */}
            {song.description && (
              <div className="mb-10 text-white/70 text-lg leading-relaxed whitespace-pre-wrap">
                {song.description}
              </div>
            )}

            {/* Audio Player (visual + embeds) */}
            <div className="bg-[#1e293b]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-10 shadow-xl">
              {song.youtubeUrl ? (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${song.youtubeUrl.split('v=')[1] || song.youtubeUrl.split('/').pop()}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="shrink-0 w-16 h-16 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white shadow-lg shadow-[#0ea5e9]/30">
                    <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    {/* Decorative Waveform */}
                    <div className="h-10 flex items-center gap-[2px] opacity-60">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full"
                          style={{
                            height: `${20 + ((i * 17) % 80)}%`,
                            backgroundColor: i < 10 ? '#0ea5e9' : 'rgba(255,255,255,0.15)',
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs font-mono text-white/40">
                      <span>0:00</span>
                      <span>--:--</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* External Links */}
            <div className="flex flex-wrap gap-3 mb-10">
              {song.spotifyUrl && (
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 h-12 px-6 bg-[#1DB954] text-white font-bold rounded-full transition-all hover:bg-green-600"
                >
                  Open Spotify
                </a>
              )}
              {song.youtubeUrl && (
                <a
                  href={song.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 h-12 px-6 bg-red-600 text-white font-bold rounded-full transition-all hover:bg-red-700"
                >
                  Watch on YouTube
                </a>
              )}
              {song.facebookUrl && (
                <a
                  href={song.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 h-12 px-6 bg-blue-600 text-white font-bold rounded-full transition-all hover:bg-blue-700"
                >
                  Watch on Facebook
                </a>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{tSongs('genre')}</p>
                <p className="text-white font-medium">{song.genres && song.genres.length > 0 ? song.genres.join(', ') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{tSongs('releaseYear')}</p>
                <p className="text-white font-medium">{song.releaseYear || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Status</p>
                <p className="text-white font-medium">{song.isFeatured ? 'Featured' : 'Released'}</p>
              </div>
            </div>

            {/* Full Credits Section */}
            {song.contributions.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/5">
                <h3 className="text-2xl font-bold text-white mb-6">Full Credits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {song.contributions.map((c) => {
                    const profileLink = c.profile ? `/profiles/${c.profile.slug}` : null;
                    const avatarUrl = c.profile?.imageUrl || c.imageUrl;
                    const displayName = c.profile?.name || c.name;

                    const Content = (
                      <div className="flex items-center gap-4 bg-[#1e293b]/30 p-3 rounded-xl border border-white/5 hover:bg-[#1e293b] transition-colors h-full">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-full object-cover shadow-md" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#0b1120] flex items-center justify-center shadow-md">
                            <span className="material-symbols-outlined text-white/30 text-xl">person</span>
                          </div>
                        )}
                        <div>
                          <p className={`font-bold text-base ${profileLink ? 'text-white group-hover:text-[#0ea5e9] transition-colors underline decoration-[#0ea5e9]/50 underline-offset-4' : 'text-white'}`}>
                            {displayName}
                            {profileLink && <span className="material-symbols-outlined text-sm ml-1 align-middle text-[#0ea5e9] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>}
                          </p>
                          <p className="text-[#0ea5e9] text-sm font-medium tracking-wide">{c.role}</p>
                        </div>
                      </div>
                    );

                    if (profileLink) {
                      return (
                        <Link key={c.id} href={profileLink} className="group block">
                          {Content}
                        </Link>
                      );
                    }
                    return <div key={c.id} className="block">{Content}</div>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#1e293b] border border-white/5 mb-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0ea5e9]/20 to-transparent" />
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-bold text-white mb-3">Ready to shape your sound?</h3>
              <p className="text-white/60 text-lg">
                We bring the same level of detail and passion to every project.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-white text-[#0b1120] text-base font-bold px-8 py-4 rounded-full transition-all hover:bg-[#0ea5e9] hover:text-white hover:scale-105 flex items-center gap-2"
            >
              Start a Project
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Related Songs */}
        {relatedSongs.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">More from the Portfolio</h3>
              <Link
                href="/songs"
                className="text-[#0ea5e9] hover:text-white transition-colors text-sm font-bold flex items-center gap-1"
              >
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedSongs.map((rs) => (
                <Link key={rs.id} href={`/songs/${rs.slug}`} className="group cursor-pointer">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-[#1e293b]">
                    {rs.coverImage ? (
                      <img
                        src={rs.coverImage}
                        alt={t(rs, 'title', locale)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1e293b] to-[#334155] flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-white/10">music_note</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors" />
                    {rs.genres && rs.genres.length > 0 && (
                      <div className="absolute bottom-4 left-4 bg-[#0ea5e9]/90 text-white text-xs font-bold px-2 py-1 rounded">
                        {rs.genres[0]}
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-bold text-lg group-hover:text-[#0ea5e9] transition-colors">
                    {t(rs, 'title', locale)}
                  </h4>
                  <p className="text-white/40 text-sm">{rs.genres && rs.genres.length > 0 ? rs.genres.join(', ') : 'Original'}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
