import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/db';
import { t } from '@/lib/t';

export default async function HomePage({ params }) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'Hero' });
  const tStats = await getTranslations({ locale, namespace: 'Stats' });

  // Fallback to empty array during initial DB setups or no records
  let featuredSongs = [];
  let featuredProjects = [];
  try {
    featuredSongs = await prisma.song.findMany({ where: { isFeatured: true }, take: 4 });
    featuredProjects = await prisma.project.findMany({ where: { isFeatured: true }, take: 3 });
  } catch(e) {}

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden py-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in slide-in-from-bottom duration-700">
            {tHero('title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 animate-in slide-in-from-bottom duration-700 delay-150">
            {tHero('subtitle')}
          </p>
          <div className="animate-in slide-in-from-bottom duration-700 delay-300">
            <Link href="/quote" className="inline-block bg-blue-600 hover:bg-blue-500 transition-colors text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-blue-500/20 transform hover:-translate-y-1">
              {tHero('cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Songs */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b pb-4">
            <h2 className="text-3xl font-bold text-gray-900">Featured Tracks</h2>
            <Link href="/songs" className="text-blue-600 hover:text-blue-700 font-semibold">Explore All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredSongs.map((song) => (
              <div key={song.id} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100">
                <div className="h-56 bg-gray-100 relative overflow-hidden">
                  {song.coverImage ? (
                    <img src={song.coverImage} alt={t(song, 'title', locale)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  ) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                      <span className="text-6xl">🎵</span>
             </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
                    <Link href={`/songs/${song.slug}`} className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">Listen Now</Link>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{t(song, 'title', locale)}</h3>
                  <p className="text-blue-600 text-sm font-medium mt-1">{song.genre || 'Original Music'}</p>
                </div>
              </div>
            ))}
            {featuredSongs.length === 0 && (
              <p className="text-gray-500 col-span-full">No featured songs yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 bg-gray-900 text-white relative">
        <div className="absolute inset-0 bg-blue-600/10 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
          <div className="p-4"><div className="text-5xl font-extrabold mb-3 text-blue-500">50+</div><div className="text-gray-400 font-medium tracking-wide uppercase text-sm">{tStats('songs')}</div></div>
          <div className="p-4"><div className="text-5xl font-extrabold mb-3 text-blue-500">120+</div><div className="text-gray-400 font-medium tracking-wide uppercase text-sm">{tStats('projects')}</div></div>
          <div className="p-4"><div className="text-5xl font-extrabold mb-3 text-blue-500">30+</div><div className="text-gray-400 font-medium tracking-wide uppercase text-sm">{tStats('contributors')}</div></div>
          <div className="p-4"><div className="text-5xl font-extrabold mb-3 text-blue-500">10+</div><div className="text-gray-400 font-medium tracking-wide uppercase text-sm">{tStats('years')}</div></div>
        </div>
      </section>
    </div>
  );
}
  
