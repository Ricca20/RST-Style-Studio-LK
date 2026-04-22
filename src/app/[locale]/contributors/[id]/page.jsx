import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { t } from '@/lib/t';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function ContributorProfilePage({ params }) {
  const { id, locale } = await params;
  const tContribs = await getTranslations({ locale, namespace: 'Contributors' });

  const contributor = await prisma.contributor.findUnique({
    where: { id },
    include: {
      contributions: {
        include: { song: true }
      }
    }
  });

  if (!contributor) return notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white pt-24 pb-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-xl mb-8">
            {contributor.image ? (
              <img src={contributor.image} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-6xl">👤</div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{t(contributor, 'name', locale)}</h1>
          {t(contributor, 'bio', locale) && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{t(contributor, 'bio', locale)}</p>
          )}
        </div>
      </div>

      {/* Contributions Discography */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Discography & Contributions</h2>
        
        {contributor.contributions.length === 0 ? (
          <p className="text-center text-gray-500">No linked contributions yet.</p>
        ) : (
          <div className="space-y-6">
            {contributor.contributions.map((c) => (
              <Link key={c.id} href={`/songs/${c.song.slug}`} className="group block">
                <div className="bg-white border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {c.song.coverImage ? (
                      <img src={c.song.coverImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">🎵</div>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{t(c.song, 'title', locale)}</h3>
                    <p className="text-gray-500 mt-1">{c.song.genre}</p>
                  </div>
                  <div className="shrink-0 mt-4 sm:mt-0">
                    <span className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                      {c.role}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
  
