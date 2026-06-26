import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/server-auth';
import prisma from '@/lib/db';
import PortalClient from './PortalClient';
import { getTranslations } from 'next-intl/server';

export default async function PortalPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Navigation' }); // or create a 'Portal' namespace

  const user = await checkAuth();
  if (!user || !user.dbUser) {
    redirect('/login');
  }

  // Fetch the user's profile
  let profile = await prisma.profile.findUnique({
    where: { userId: user.dbUser.id },
  });

  // Fetch their claims
  const claims = await prisma.claimRequest.findMany({
    where: { userId: user.dbUser.id },
    include: {
      song: { select: { titleEn: true, coverImage: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch available songs to claim
  const allSongs = await prisma.song.findMany({
    select: { id: true, titleEn: true, titleSi: true },
    orderBy: { titleEn: 'asc' }
  });

  return (
    <div className="min-h-screen bg-transparent pt-24 px-6 md:px-20 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Artist Portal</h1>
          <p className="text-white/60">Manage your profile and claim your contributions to songs.</p>
        </div>
        <PortalClient 
          initialProfile={profile} 
          claims={claims} 
          allSongs={allSongs} 
          userId={user.dbUser.id} 
        />
      </div>
    </div>
  );
}
