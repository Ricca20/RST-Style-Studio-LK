import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { t } from '@/lib/t';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function SongDetailPage({ params }) {
  const { slug, locale } = await params;
  const tSongs = await getTranslations({ locale, namespace: 'Songs' });

  const song = await prisma.song.findUnique({
    where: { slug },
    include: {
      contributions: { include: { contributor: true } },
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
    <div className="min-h-screen bg-[#1a1022] pt-24">
      <main className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
          <Link href="/songs" className="hover:text-[#9d2bee] transition-colors">
            Portfolio
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          {song.genre && (
            <>
              <span className="hover:text-[#9d2bee] transition-colors">{song.genre}</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </>
          )}
          <span className="text-white">{t(song, 'title', locale)}</span>
        </div>

        {/* Project Hero — 2 Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Left: Album Art */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative group aspect-square w-full rounded-2xl overflow-hidden shadow-2xl shadow-[#9d2bee]/10 border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1022]/80 to-transparent opacity-60 z-10" />
              {song.coverImage ? (
                <img
                  src={song.coverImage}
                  alt={t(song, 'title', locale)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1e1823] to-[#322839] flex items-center justify-center">
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
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
                {t(song, 'title', locale)}
              </h1>
              {song.contributions.length > 0 && (
                <div className="flex items-center gap-3 text-xl text-white/60 font-light">
                  <span className="material-symbols-outlined">mic_external_on</span>
                  <span>
                    {song.contributions.map((c) => t(c.contributor, 'name', locale)).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Role Chips */}
            <div className="flex flex-wrap gap-3 mb-10">
              {song.contributions.map((c) => (
                <div
                  key={c.id}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    c.role === 'PRODUCER'
                      ? 'bg-[#9d2bee]/20 border border-[#9d2bee]/30 text-[#9d2bee] font-bold uppercase tracking-wide'
                      : 'bg-[#2a1d35] border border-white/10 text-white/80'
                  }`}
                >
                  {c.role.replace('_', ' ')}
                </div>
              ))}
              {song.genre && (
                <div className="px-4 py-1.5 rounded-full bg-[#2a1d35] border border-white/10 text-white/80 text-sm font-medium">
                  {song.genre}
                </div>
              )}
            </div>

            {/* Audio Player (visual + embeds) */}
            <div className="bg-[#2a1d35]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-10 shadow-xl">
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
                  <div className="shrink-0 w-16 h-16 rounded-full bg-[#9d2bee] flex items-center justify-center text-white shadow-lg shadow-[#9d2bee]/30">
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
                            height: `${20 + Math.random() * 80}%`,
                            backgroundColor: i < 10 ? '#9d2bee' : 'rgba(255,255,255,0.15)',
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
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{tSongs('genre')}</p>
                <p className="text-white font-medium">{song.genre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{tSongs('releaseYear')}</p>
                <p className="text-white font-medium">{song.releaseYear || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Credits</p>
                <p className="text-white font-medium">{song.contributions.length} contributors</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Status</p>
                <p className="text-white font-medium">{song.isFeatured ? 'Featured' : 'Released'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#2a1d35] border border-white/5 mb-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#9d2bee]/20 to-transparent" />
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-bold text-white mb-3">Ready to shape your sound?</h3>
              <p className="text-white/60 text-lg">
                We bring the same level of detail and passion to every project.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-white text-[#1a1022] text-base font-bold px-8 py-4 rounded-full transition-all hover:bg-[#9d2bee] hover:text-white hover:scale-105 flex items-center gap-2"
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
                className="text-[#9d2bee] hover:text-white transition-colors text-sm font-bold flex items-center gap-1"
              >
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedSongs.map((rs) => (
                <Link key={rs.id} href={`/songs/${rs.slug}`} className="group cursor-pointer">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-[#2a1d35]">
                    {rs.coverImage ? (
                      <img
                        src={rs.coverImage}
                        alt={t(rs, 'title', locale)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#2a1d35] to-[#322839] flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-white/10">music_note</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors" />
                    {rs.genre && (
                      <div className="absolute bottom-4 left-4 bg-[#9d2bee]/90 text-white text-xs font-bold px-2 py-1 rounded">
                        {rs.genre}
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-bold text-lg group-hover:text-[#9d2bee] transition-colors">
                    {t(rs, 'title', locale)}
                  </h4>
                  <p className="text-white/40 text-sm">{rs.genre || 'Original'}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
