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
      contributions: {
        include: { contributor: true }
      }
    }
  });

  if (!song) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Dynamic Header */}
      <div className="bg-gray-900 text-white pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-end">
            <div className="w-64 h-64 shadow-2xl rounded-lg overflow-hidden bg-gray-800 shrink-0 border-4 border-gray-700">
              {song.coverImage ? (
                <img src={song.coverImage} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🎶</div>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <span className="uppercase tracking-widest text-blue-400 text-sm font-bold mb-2 block">{song.genre || 'Single'}</span>
              <h1 className="text-4xl md:text-6xl font-black mb-4">{t(song, 'title', locale)}</h1>
              <p className="text-xl text-gray-400">Released: {song.releaseYear || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Embeds */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{tSongs('listenOn')}</h2>
              <div className="space-y-6">
                {song.youtubeUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                    <iframe 
                      src={`https://www.youtube.com/embed/${song.youtubeUrl.split('v=')[1] || song.youtubeUrl.split('/').pop()}`} 
                      className="w-full h-full" allowFullScreen>
                    </iframe>
                  </div>
                )}
                {song.spotifyUrl && (
                  <div>
                    <a href={song.spotifyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center px-6 py-3 bg-[#1DB954] text-white rounded-full hover:bg-green-600 transition font-bold">
                      Open in Spotify
                    </a>
                  </div>
                )}
                {!song.youtubeUrl && !song.spotifyUrl && (
                  <p className="text-gray-500">Audio embeddings are currently unavailable.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Credits */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Credits</h3>
              {song.contributions.length === 0 ? (
                <p className="text-gray-500 text-sm">No credits available.</p>
              ) : (
                <ul className="space-y-4">
                  {song.contributions.map(c => (
                    <li key={c.id} className="flex items-center justify-between">
                      <Link href={`/contributors/${c.contributor.id}`} className="font-semibold text-blue-600 hover:text-blue-800">
                        {t(c.contributor, 'name', locale)}
                      </Link>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md uppercase font-medium">{c.role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
  
