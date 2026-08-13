import { Home } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function LocaleNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        {/* Giant 404 */}
        <div className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent select-none">
          404
        </div>

        <h1 className="text-2xl font-bold mb-3 -mt-4 text-white">Page Not Found</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0ea5e9]/80 rounded-xl font-semibold text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
