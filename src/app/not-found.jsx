import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060913] text-white px-6">
      <div className="max-w-md w-full text-center relative">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-b from-[#0ea5e9]/10 via-[#9d2bee]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          {/* Giant 404 */}
          <div className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent select-none">
            404
          </div>

          <h1 className="text-2xl font-bold mb-3 -mt-4">Page Not Found</h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0ea5e9]/80 rounded-xl font-semibold transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
