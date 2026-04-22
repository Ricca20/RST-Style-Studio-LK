import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { t } from '@/lib/t';
import { Link } from '@/i18n/routing';

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });
  
  let services = [];
  try {
    services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { nameEn: 'asc' } });
  } catch(e) {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-blue-600 to-blue-800 z-0 opacity-50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-black mb-6">{tNav('services')}</h1>
          <p className="text-xl text-blue-100">Professional audio and visual production services tailored to bring your vision to life.</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div key={svc.id} className="bg-white rounded-2xl p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 flex flex-col items-start">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center text-3xl mb-6 shadow-inner">
                {svc.icon || '🎧'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(svc, 'name', locale)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-8">
                {t(svc, 'description', locale) || 'Studio service offering.'}
              </p>
              <div className="w-full pt-6 border-t mt-auto flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Starting from</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">Rs {svc.basePrice?.toLocaleString() || 'Custom'}</span>
                </div>
                <Link href={`/quote?service=${svc.id}`} className="bg-gray-900 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-600 transition">
                  <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full text-center p-10 bg-white rounded-xl">
              <p className="text-gray-500">Service offerings are currently being updated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  
