import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: 'Profiles | RST Studio',
    description: 'Meet the artists, producers, and engineers behind the sound.',
  };
}

export default async function ProfilesPage({ params }) {
  const { locale } = await params;

  let profiles = [];
  try {
    profiles = await prisma.profile.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error("Failed to fetch profiles", e);
  }

  return (
    <div className="min-h-screen bg-[#0f0b12] pt-24 pb-32">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#9d2bee] animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-widest text-white/90">
              The Collective
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight mb-6">
            MEET THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d2bee] to-purple-300">
              VISIONARIES
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto font-light">
            The producers, engineers, and artists shaping the modern soundscape at RST Studio.
          </p>
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-10">
        {profiles.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#1a1620]">
            <span className="material-symbols-outlined text-5xl text-white/10 mb-4 block">groups</span>
            <p className="text-white/40">No profiles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/profiles/${profile.slug}`}
                className="group relative flex flex-col bg-[#1a1620] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 shadow-xl"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#2a1d35]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1620] via-transparent to-transparent z-10 opacity-80" />
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-8xl text-white/5">person</span>
                    </div>
                  )}
                  
                  {/* Floating Action */}
                  <div className="absolute top-4 right-4 z-20 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#9d2bee] hover:border-[#9d2bee]">
                      <span className="material-symbols-outlined text-xl">arrow_outward</span>
                    </div>
                  </div>
                </div>

                {/* Info Content */}
                <div className="relative z-20 p-6 flex-1 flex flex-col justify-end transform -translate-y-6">
                  <div className="inline-block px-3 py-1 bg-[#9d2bee] text-white text-xs font-bold uppercase tracking-wider rounded-lg mb-3 shadow-[0_4px_14px_0_rgba(157,43,238,0.39)] self-start">
                    {profile.mainRole || 'Artist'}
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-1 group-hover:text-[#9d2bee] transition-colors">
                    {profile.name}
                  </h3>
                  {profile.bio && (
                    <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
