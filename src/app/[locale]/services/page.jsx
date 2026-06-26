import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { t } from '@/lib/t';
import { Link } from '@/i18n/routing';
import Scroll3DWrapper from '@/components/ui/Scroll3DWrapper';
import TiltCard from '@/components/ui/TiltCard';

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });

  let services = [];
  let pricing = [];
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });
    pricing = await prisma.pricingConfig.findMany({
      orderBy: { price: 'asc' },
    });
  } catch (e) {}

  // Map service icons to Material Symbols
  const iconMap = {
    mic: 'mic',
    mix: 'graphic_eq',
    master: 'album',
    video: 'videocam',
    brand: 'palette',
    default: 'music_note',
  };

  return (
    <div className="min-h-screen bg-transparent pt-20">
      {/* Hero */}
      <section className="relative">
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-4 md:p-8">
          <div className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center bg-[#0b1120]/30 backdrop-blur-sm">
            {/* Decorative background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0ea5e9]/10 via-transparent to-[#0b1120]" />
            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-4">
              <div className="mb-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm border border-white/10">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Now Accepting New Projects
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-6 text-glow">
                Sonic Excellence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                  Tailored to Vision
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mb-10 leading-relaxed">
                Professional recording, mixing, and production services designed to take your sound from concept to chart-topper.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <a
                  href="#services"
                  className="flex h-12 items-center justify-center rounded-full bg-[#0ea5e9] px-8 text-base font-bold text-white transition-all hover:bg-[#0ea5e9]/90 hover:scale-105 neon-glow"
                >
                  View Services
                </a>
                <Link
                  href="/songs"
                  className="flex h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <span className="material-symbols-outlined mr-2 text-xl">play_circle</span>
                  Hear Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="relative py-20 px-4 md:px-8">
        <Scroll3DWrapper intensity={0.4}>
          <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-[#0ea5e9] font-bold text-sm tracking-widest uppercase mb-2">
                Our Expertise
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Premium Services
              </h3>
            </div>
            <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
              We provide a full spectrum of audio services using state-of-the-art analog gear and industry-standard digital tools.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#241a2f]">
              <span className="material-symbols-outlined text-5xl text-white/10 mb-4 block">design_services</span>
              <p className="text-white/40">Service offerings are being updated.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc) => (
                <TiltCard key={svc.id}>
                  <div
                    className="group glass-panel rounded-[2rem] p-6 flex flex-col gap-4 transition-all duration-300 h-full hover:border-[#0ea5e9]/30 hover:shadow-[0_0_25px_rgba(14, 165, 233,0.15)] cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9] mb-2">
                      <span className="material-symbols-outlined text-2xl">
                        {svc.icon || iconMap.default}
                      </span>
                    </div>
                    <h4 className="text-white text-xl font-bold">{t(svc, 'name', locale)}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                      {t(svc, 'description', locale) || 'Professional studio service.'}
                    </p>
                    {svc.basePrice && (
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-white/40 block">Starting from</span>
                          <span className="text-white font-bold text-lg">
                            Rs {svc.basePrice.toLocaleString()}
                          </span>
                        </div>
                        <Link
                          href={`/quote?service=${svc.id}`}
                          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
        </Scroll3DWrapper>
      </section>

      {/* Pricing Section */}
      {pricing.length > 0 && (
        <section className="relative py-16 px-4 md:px-8 bg-[#241a2f]/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Invest in Your Sound
              </h2>
              <p className="text-gray-400">Transparent pricing for every stage of your career.</p>
            </div>

            <div className="w-full grid md:grid-cols-2 gap-4">
              {pricing.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-[#0b1120] hover:border-[#0ea5e9]/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0ea5e9]/20 text-[#0ea5e9] p-3 rounded-full">
                      <span className="material-symbols-outlined">
                        {item.type === 'SERVICE' ? 'mic_none' : 'star'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{item.itemKey}</h4>
                      <p className="text-gray-400 text-xs">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      {item.currency} {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0ea5e9]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto bg-[#241a2f] border border-white/5 rounded-3xl p-8 md:p-16 text-center shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Ready to Make Noise?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Let&apos;s discuss your project. Whether it&apos;s a single, an EP, or a full album, we&apos;re ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/quote"
              className="flex h-14 items-center justify-center rounded-full bg-[#0ea5e9] px-10 text-lg font-bold text-white transition-all hover:bg-[#0ea5e9]/90 neon-glow"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="flex h-14 items-center justify-center rounded-full bg-transparent border border-white/20 px-10 text-lg font-bold text-white transition-all hover:bg-white/5 hover:border-white/40"
            >
              Book a Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
