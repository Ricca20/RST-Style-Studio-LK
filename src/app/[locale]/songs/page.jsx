import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/t';

export default async function SongsPage({ params }) {
  const { locale } = await params;
  const tSongs = await getTranslations({ locale, namespace: 'Songs' });

  let songs = [];
  try {
    songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' },
      include: { contributions: { include: { contributor: true } } },
    });
  } catch (e) {}

  // Extract unique genres for filter pills
  const genres = [...new Set(songs.map((s) => s.genre).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#0f0b12] pt-24">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#9d2bee] animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-widest text-white/90">
              Available for mixing
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight mb-6">
            AUDIO THAT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d2bee] to-purple-300">
              RESONATES
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto font-light">
            Award-winning production, mixing, and mastering for the modern artist.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 pb-32">
        {/* Filters + Title */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h2 className="text-2xl font-bold text-white">{tSongs('latest')}</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <button className="px-5 py-2 rounded-full bg-[#9d2bee] text-white text-sm font-medium shadow-lg shadow-[#9d2bee]/25">
              All Works
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                className="px-5 py-2 rounded-full bg-[#322839] text-gray-300 hover:text-white hover:bg-[#322839]/80 text-sm font-medium transition-all"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        {songs.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#1a1620]">
            <span className="material-symbols-outlined text-5xl text-white/10 mb-4 block">library_music</span>
            <p className="text-white/40">{tSongs('noSongs')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-[#1a1620]"
              >
                {/* Cover Image */}
                <div className="absolute inset-0">
                  {song.coverImage ? (
                    <img
                      src={song.coverImage}
                      alt={t(song, 'title', locale)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1620] to-[#322839] flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-white/10">music_note</span>
                    </div>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition-all duration-300 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col justify-between p-6">
                  <div className="self-end translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="material-symbols-outlined text-white">more_horiz</span>
                  </div>

                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#9d2bee] text-white hover:bg-white hover:text-[#9d2bee] transition-colors shadow-[0_0_30px_rgba(157,43,238,0.5)]">
                      <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-white text-xl font-bold leading-tight">
                          {t(song, 'title', locale)}
                        </h3>
                        <p className="text-[#9d2bee] text-sm font-medium mt-1">
                          {song.contributions?.[0]?.contributor
                            ? t(song.contributions[0].contributor, 'name', locale)
                            : song.genre || 'RST Studio'}
                        </p>
                      </div>
                      {/* Sound Wave Visual */}
                      <div className="flex gap-1 h-6 items-end pb-1">
                        <div className="sound-bar h-3" />
                        <div className="sound-bar h-5" />
                        <div className="sound-bar h-2" />
                        <div className="sound-bar h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Default Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 group-hover:opacity-0 transition-opacity">
                  <h4 className="text-white font-bold text-lg">{t(song, 'title', locale)}</h4>
                  <p className="text-white/50 text-sm">{song.genre || 'Original'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
