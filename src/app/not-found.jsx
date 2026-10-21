import Link from 'next/link';

// Fallback for URLs outside the localized site (the localized 404 lives in [locale]/not-found.jsx)
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink px-6">
      <div className="max-w-xl text-center">
        <p className="eyebrow text-smoke">Error 404</p>
        <h1 className="display text-[clamp(3.5rem,12vw,8rem)] mt-4">Skipped a beat.</h1>
        <p className="mt-6 text-smoke">This page isn&apos;t on the record.</p>
        <Link href="/" className="inline-block mt-8 rounded-full bg-ink text-paper px-6 py-3.5 text-sm font-bold hover:bg-ink-2 transition-colors">
          Back to the start
        </Link>
      </div>
    </div>
  );
}
