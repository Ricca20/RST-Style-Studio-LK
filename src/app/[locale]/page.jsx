import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/db';
import { t } from '@/lib/t';
import Scroll3DWrapper from '@/components/ui/Scroll3DWrapper';
import TiltCard from '@/components/ui/TiltCard';
import Hero3DObject from '@/components/3d/Hero3DObject';
import MagneticButton from '@/components/ui/MagneticButton';
import * as motion from 'framer-motion/client';

export default async function HomePage({ params }) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'Hero' });
  const tStats = await getTranslations({ locale, namespace: 'Stats' });

  // Fetch data from Prisma — fallback gracefully if DB is unavailable
  let featuredSongs = [];
  let featuredProjects = [];
  let services = [];
  try {
    featuredSongs = await prisma.song.findMany({
      where: { isFeatured: true },
      take: 6,
      include: { contributions: { include: { contributor: true } } },
    });
    featuredProjects = await prisma.project.findMany({
      where: { isFeatured: true },
      take: 3,
    });
    services = await prisma.service.findMany({
      where: { isActive: true },
      take: 4,
    });
  } catch (e) {}

  const firstFeatured = featuredSongs[0];

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Full-Screen Video Background
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        {/* Optional hero-specific gradient if needed */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/60" />
        </div>

        {/* 3D Overlay Object (Removed as requested) */}
        {/* <Hero3DObject /> */}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 
        ═══════════════════════════════════════════════════════════
        REST OF HOME PAGE CONTENT (Temporarily removed as requested)
        ═══════════════════════════════════════════════════════════ 
      */}
      {/* 
      {firstFeatured && (
        <section className="py-24 px-6 md:px-20 bg-transparent overflow-hidden relative z-10">
          ...
      )}
      */}
    </div>
  );
}
