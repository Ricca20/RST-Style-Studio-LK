import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import ServicesPageClient from '@/components/public/ServicesPageClient';

export default async function ServicesPage({ params }) {
  const { locale } = await params;

  let services = [];
  let pricing = [];
  let collaboratorsByRole = {};
  let settings = null;

  try {
    services = await prisma.service.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });

    pricing = await prisma.pricingConfig.findMany({
      orderBy: { price: 'asc' },
    });

    const collaborators = await prisma.collaborator.findMany({
      where: { isActive: true },
      orderBy: [{ role: 'asc' }],
      include: {
        profile: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    for (const collab of collaborators) {
      if (!collaboratorsByRole[collab.role]) {
        collaboratorsByRole[collab.role] = [];
      }
      collaboratorsByRole[collab.role].push({
        id: collab.id,
        role: collab.role,
        price: collab.price,
        name: collab.profile?.name || 'Unknown Artist',
        imageUrl: collab.profile?.imageUrl || null,
      });
    }

    settings = await prisma.studioSettings.findFirst();
  } catch (e) {
    console.error('Failed fetching services page data:', e);
  }

  // Fallback demo services if DB is empty
  if (services.length === 0) {
    services = [
      { id: 'rec', nameEn: 'Vocal & Instrument Tracking', descriptionEn: 'Acoustically isolated vocal booths equipped with Neumann U87 and AKG C414 microphones through tube preamps.', icon: 'mic', basePrice: 15000 },
      { id: 'mix', nameEn: 'Analog Summing & Mixing', descriptionEn: '24-channel analog summing console combined with surgical 64-bit digital dynamic EQs and harmonic saturation.', icon: 'mix', basePrice: 25000 },
      { id: 'master', nameEn: 'Stereo & Atmos Mastering', descriptionEn: 'Loudness optimized mastering for Spotify, Apple Music, and TIDAL with Dolby Atmos 7.1.4 spatial audio options.', icon: 'master', basePrice: 20000 },
      { id: 'prod', nameEn: 'Full Song Production & Scoring', descriptionEn: 'Complete musical arrangement, live instrumentation, synth programming, and vocal melody construction.', icon: 'default', basePrice: 50000 },
    ];
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-32 relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#0ea5e9]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-[500px] h-[500px] bg-[#9d2bee]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-10 pt-10 pb-12 border-b border-white/10 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-3 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
              19-Inch Rack Mount Systems • Live DB Tariffs
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase">
              STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-white to-[#9d2bee]">RACK & RATES</span>
            </h1>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-light">
            Explore our complete hardware capabilities, fixed itemized tariffs, and use our interactive live quotation builder to calculate your custom project estimate.
          </p>
        </div>
      </section>

      {/* Main Interactive Client Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-10">
        <ServicesPageClient
          services={services}
          pricing={pricing}
          collaboratorsByRole={collaboratorsByRole}
          settings={settings}
          locale={locale}
        />
      </main>
    </div>
  );
}
