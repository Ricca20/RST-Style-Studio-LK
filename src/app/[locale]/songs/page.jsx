import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/t';

export default async function SongsPage({ params }) {
  const { locale } = await params;
  const tSongs = await getTranslations({ locale, namespace: 'Songs' });
  
  let songs = [];
  try {
    songs = await prisma.song.findMany({ orderBy: { createdAt: 'desc' } });
  } catch(e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">{tSongs('title')}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">Discover our library of original productions.</p>
      </div>
      
      {songs.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">{tSongs('noSongs')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {songs.map(song => (
            <Link key={song.id} href={`/songs/${song.slug}`} className="group block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {song.coverImage ? (
                    <img src={song.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-50 bg-gradient-to-br from-gray-100 to-gray-200">🎵</div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-300 z-10"></div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{t(song, 'title', locale)}</h3>
                    <p className="text-sm font-medium text-blue-500 mt-1">{song.genre || 'Genre'}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t text-sm text-gray-400 flex justify-between items-center">
                    <span>{tSongs('releaseYear')}:</span>
                    <span className="font-semibold text-gray-600">{song.releaseYear || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
  
