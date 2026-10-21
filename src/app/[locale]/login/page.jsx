'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Vinyl from '@/components/music/Vinyl';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
      router.push('/admin');
    }
  };

  return (
    <section className="min-h-[85vh] px-5 md:px-10 pt-32 pb-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="hidden md:block">
          <p className="eyebrow text-smoke">Backstage</p>
          <h1 className="display text-[clamp(3.5rem,8vw,7rem)] mt-4">Studio<br />access.</h1>
          <p className="mt-6 text-lg text-smoke max-w-sm">For the RST team and credited artists. Sign in to manage the studio or your artist profile.</p>
          <div className="w-48 mt-10"><Vinyl spinning label="RST" /></div>
        </div>

        <div className="rounded-[2rem] bg-ink text-paper p-8 md:p-10">
          <h2 className="display text-4xl md:hidden mb-2">Studio access.</h2>
          <p className="eyebrow text-paper/50 mb-8">Sign in</p>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-500/15 text-red-200 px-4 py-3 text-sm">{error}</div>
            )}
            <label className="block">
              <span className="eyebrow block text-paper/60 mb-3">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl bg-ink-2 border border-paper/10 px-5 py-3.5 text-paper placeholder:text-paper/30 focus:outline-none focus:border-lime transition-colors"
              />
            </label>
            <label className="block">
              <span className="eyebrow block text-paper/60 mb-3">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl bg-ink-2 border border-paper/10 px-5 py-3.5 text-paper placeholder:text-paper/30 focus:outline-none focus:border-lime transition-colors"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-lime text-ink font-bold py-4 hover:brightness-95 transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <Link href="/" className="inline-block mt-8 text-sm text-paper/50 hover:text-paper transition-colors">← Back to the site</Link>
        </div>
      </div>
    </section>
  );
}
