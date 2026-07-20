import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import ContactClient from '@/components/public/ContactClient';

export default async function ContactPage({ params }) {
  const { locale } = await params;

  let settings = null;
  try {
    settings = await prisma.studioSettings.findFirst();
  } catch (e) {
    console.error('Failed to fetch studio settings on contact page:', e);
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-36 lg:pt-44 pb-32 relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-[#0ea5e9]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-[#9d2bee]/10 rounded-full blur-[160px] pointer-events-none" />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-10 py-4 relative z-10">
        {/* Header Title */}
        <div className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#0ea5e9] text-xs font-mono font-bold uppercase tracking-widest mb-3 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              Master Control Desk • All Social Channels Online
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-tight">
              STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-white to-[#9d2bee]">BOOKINGS & CONTACT</span>
            </h1>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-light">
            Connect across all our official social media channels, reach our engineering desk, or transmit an instant email reservation request.
          </p>
        </div>

        {/* Client Interactive Contact Experience */}
        <ContactClient settings={settings} locale={locale} />
      </main>
    </div>
  );
}
