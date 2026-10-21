import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth/server-auth';
import prisma from '@/lib/db';
import PortalClient from './PortalClient';
import SectionLabel from '@/components/music/SectionLabel';
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
    where: { deletedAt: null, isDraft: false },
    select: { id: true, titleEn: true, titleSi: true },
    orderBy: { titleEn: 'asc' }
  });

  return (
    <div className="px-5 md:px-10 pt-32 md:pt-40">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <SectionLabel>Artist portal</SectionLabel>
          <h1 className="display text-[clamp(3rem,8vw,6rem)] mt-5 mb-4">Your studio pass.</h1>
          <p className="text-smoke text-lg">Manage your profile and claim your credits on songs.</p>
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
