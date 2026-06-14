import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import { Globe, Camera, PlaySquare, Link as LinkIcon } from 'lucide-react';

export default async function ProfilePage({ params }) {
  const { slug, locale } = await params;

  const profile = await prisma.profile.findUnique({
    where: { slug },
    include: {
      credits: {
        include: {
          song: true
        },
        orderBy: {
          song: { releaseYear: 'desc' }
        }
      }
    }
  });

  if (!profile || !profile.isActive) return notFound();

  // Deduplicate songs since a person might have multiple credits on the same song
  // e.g., Lyrics and Melody on the same song.
  const uniqueSongsMap = new Map();
  profile.credits.forEach(credit => {
    if (credit.song && !credit.song.isDraft) {
      if (!uniqueSongsMap.has(credit.song.id)) {
        uniqueSongsMap.set(credit.song.id, {
          song: credit.song,
          roles: [credit.role]
        });
      } else {
        uniqueSongsMap.get(credit.song.id).roles.push(credit.role);
      }
    }
  });

  const projects = Array.from(uniqueSongsMap.values());
  // Sort projects by release year descending
  projects.sort((a, b) => (b.song.releaseYear || 0) - (a.song.releaseYear || 0));

  return (
    <div className="min-h-screen bg-[#1a1022] pt-24 pb-20">
      <main className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-12">
          <Link href="/" className="hover:text-[#9d2bee] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-white">Profiles</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-white">{profile.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Profile Info */}
          <div className="lg:col-span-4">
            <div className="bg-[#2a1d35]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 sticky top-32 text-center shadow-xl shadow-black/20">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-[#9d2bee]/30 shadow-lg shadow-[#9d2bee]/20">
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#9d2bee] to-indigo-600 flex items-center justify-center">
                    <span className="text-5xl text-white font-bold">{profile.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
              {profile.mainRole && (
                <p className="text-[#9d2bee] font-medium tracking-widest uppercase text-sm mb-4">
                  {profile.mainRole}
                </p>
              )}
              
              <div className="flex justify-center gap-3 mt-6 mb-8">
                {profile.socialLinks?.facebook && (
                  <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#1877F2] transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#E4405F] transition-colors">
                    <Camera className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.youtube && (
                  <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#FF0000] transition-colors">
                    <PlaySquare className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.spotify && (
                  <a href={profile.socialLinks.spotify} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#1DB954] transition-colors">
                    <LinkIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

              {profile.bio && (
                <div className="text-white/70 text-sm leading-relaxed text-left border-t border-white/10 pt-6">
                  {profile.bio}
                </div>
              )}
            </div>
          </div>

          {/* Right: Credits / Projects */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-white">Selected Works</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(({ song, roles }) => (
                  <Link href={`/songs/${song.slug}`} key={song.id} className="group block bg-[#2a1d35]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#2a1d35] transition-colors">
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black/40 relative">
                        {song.coverImage ? (
                          <img src={song.coverImage} alt={song.titleEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/20 text-3xl">music_note</span>
                          </div>
                        )}
                        {song.projectType === 'MUSIC_VIDEO' && (
                          <div className="absolute top-1 right-1 bg-black/70 rounded p-1">
                            <span className="material-symbols-outlined text-white text-[10px]">movie</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h3 className="font-bold text-white text-lg truncate group-hover:text-[#9d2bee] transition-colors">{song.titleEn}</h3>
                        {song.releaseYear && <p className="text-white/40 text-xs mb-2">{song.releaseYear}</p>}
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {roles.map(r => (
                            <span key={r} className="text-[10px] uppercase tracking-wider font-bold bg-[#9d2bee]/20 text-[#d8a1ff] px-2 py-0.5 rounded-full border border-[#9d2bee]/30">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-[#2a1d35]/20 border border-dashed border-white/10 rounded-3xl p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-white/20 mb-4">album</span>
                <p className="text-white/50 text-lg">No credited works available yet.</p>
              </div>
            )}

            {/* Gallery */}
            {profile.galleryImages && profile.galleryImages.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bold text-white">Gallery</h2>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {profile.galleryImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-white/5 relative group bg-black/40 cursor-pointer">
                      <img src={img} alt={`${profile.name} gallery image ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
