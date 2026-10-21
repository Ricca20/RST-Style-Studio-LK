'use client';

import { usePathname } from '@/i18n/routing';
import Vinyl from '@/components/music/Vinyl';

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
    <section className="min-h-[80vh] flex items-center px-5 md:px-10 pt-32 pb-20">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
          <p className="eyebrow text-smoke">Intermission</p>
          <h1 className="display text-[clamp(3.5rem,11vw,9rem)] mt-4">Back after<br />the break.</h1>
          <p className="mt-6 max-w-md text-lg text-smoke">
            {studioName || 'RST Style Studio LK'} is tuning up with some scheduled maintenance. Please check back soon.
          </p>
        </div>
        <div className="w-56 md:w-72 justify-self-center">
          <Vinyl spinning label="RST" />
        </div>
      </div>
    </section>
  );
}
