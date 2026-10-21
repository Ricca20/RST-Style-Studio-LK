'use client';

import { usePathname } from '@/i18n/routing';
import { Wrench } from 'lucide-react';

// Pages that must stay reachable during maintenance so staff can sign in.
const ALWAYS_AVAILABLE = ['/login'];

/**
 * Replaces page content with a maintenance notice when StudioSettings.maintenanceMode
 * is on. The layout passes `active={false}` for signed-in staff.
 */
export default function MaintenanceGate({ active, studioName, children }) {
  const pathname = usePathname();

  if (!active || ALWAYS_AVAILABLE.some((path) => pathname.startsWith(path))) {
    return children;
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
      <div className="w-16 h-16 rounded-full bg-rst-accent/20 border border-rst-accent/40 flex items-center justify-center mb-6">
        <Wrench className="text-white" size={28} />
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">We&apos;ll be right back</h1>
      <p className="text-white/60 max-w-md">
        {studioName || 'RST Style Studio LK'} is undergoing scheduled maintenance. Please check back soon.
      </p>
    </div>
  );
}
