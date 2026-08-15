import prisma from '@/lib/db';
import ContributorsShowcaseClient from '@/components/public/ContributorsShowcaseClient';

export async function generateMetadata() {
  return {
    title: 'Sound Architects & Contributors | RST Studio',
    description: 'Meet the master producers, acoustic engineers, and vocalists behind the RST sound collective.',
  };
}

export default async function ProfilesPage() {
  let profiles = [];
  let extraContributors = [];

  try {
    const dbProfiles = await prisma.profile.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        _count: {
          select: { credits: true }
        }
      },
      orderBy: { sortOrder: 'asc' },
    });

    profiles = dbProfiles.map(p => ({
      id: p.id,
      name: p.name,
      mainRole: p.mainRole || 'Studio Artist',
      bio: p.bio,
      imageUrl: p.imageUrl,
      slug: p.slug,
      isApproved: p.isApproved,
      creditsCount: p._count?.credits || 0
    }));

    const rawContributions = await prisma.contribution.findMany({
      where: {
        profileId: null
      },
      select: {
        name: true,
        role: true,
        imageUrl: true,
      }
    });

    const existingNames = new Set(profiles.map(p => p.name.toLowerCase()));
    const unlinkedMap = new Map();

    rawContributions.forEach(contrib => {
      const lower = contrib.name.toLowerCase();
      if (!existingNames.has(lower)) {
        if (!unlinkedMap.has(lower)) {
          unlinkedMap.set(lower, {
            id: `guest-${lower}`,
            name: contrib.name,
            mainRole: contrib.role || 'Guest Contributor',
            bio: `Credited studio contributor on RST Style Studio LK productions.`,
            imageUrl: contrib.imageUrl || null,
            slug: null,
            isApproved: false,
            creditsCount: 1
          });
        } else {
          unlinkedMap.get(lower).creditsCount += 1;
        }
      }
    });

    extraContributors = Array.from(unlinkedMap.values());
  } catch (e) {
    console.error("Failed to fetch profiles data", e);
  }

  let combinedContributors = [...profiles, ...extraContributors];
  if (combinedContributors.length === 0) {
    combinedContributors = [
      { id: '1', name: 'RST Studio', mainRole: 'Lead Sound Engineer & Founder', bio: 'Mastering engineer with over a decade of analog recording and acoustic sculpture experience.', imageUrl: '/logo.png', slug: 'rst-studio', isApproved: true, creditsCount: 12 },
      { id: '2', name: 'Kasun De Silva', mainRole: 'Senior Producer & Arranger', bio: 'Specialist in modern synthwave, orchestral film scoring, and vocal harmony arrangements.', imageUrl: null, slug: 'kasun', isApproved: true, creditsCount: 8 },
      { id: '3', name: 'Thilini Perera', mainRole: 'Vocalist & Vocal Coach', bio: 'Classical and pop vocal trainer helping artists deliver emotionally resonant performances.', imageUrl: null, slug: 'thilini', isApproved: true, creditsCount: 6 },
      { id: '4', name: 'Amila Fernando', mainRole: 'Mixing & Mastering Engineer', bio: 'Dolby Atmos certified mix engineer specializing in deep bass and panoramic stereo imaging.', imageUrl: null, slug: 'amila', isApproved: true, creditsCount: 5 },
    ];
  }

  return <ContributorsShowcaseClient contributors={combinedContributors} />;
}
