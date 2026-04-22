import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/t';

export default async function ContributorsPage({ params }) {
  const { locale } = await params;
  const tContribs = await getTranslations({ locale, namespace: 'Contributors' });
  
  let contributors = [];
  try {
    contributors = await prisma.contributor.findMany({ orderBy: { nameEn: 'asc' } });
  } catch(e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">{tContribs('title')}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">The incredible talent that makes our productions shine.</p>
      </div>

      {contributors.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">{tContribs('noContributors')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {contributors.map(person => (
            <Link key={person.id} href={`/contributors/${person.id}`} className="group block text-center">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-gray-50 shadow-inner">
                  {person.image ? (
                    <img src={person.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-500 text-4xl">👤</div>
                  )}
                </div>
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{t(person, 'name', locale)}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{t(person, 'bio', locale) || 'Studio Collaborator'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
  
