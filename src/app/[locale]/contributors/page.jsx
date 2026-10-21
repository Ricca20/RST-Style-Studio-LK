import prisma from '@/lib/db';
import ContributorsShowcaseClient from '@/components/public/ContributorsShowcaseClient';

export async function generateMetadata() {
  return {
    title: 'Contributors & Studio Roster | RST Studio',
    description: 'Meet the master producers, acoustic engineers, vocalists, and composers behind RST Style Studio LK.',
  };
}

export default async function ContributorsPage() {
  let profiles = [];
  let extraContributors = [];

  try {
    // 1. Fetch full verified profiles with song credit counts
    const dbProfiles = await prisma.profile.findMany({
      // Artist-submitted profiles only appear once an admin approves them
      where: { isActive: true, isApproved: true, deletedAt: null },
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

    // 2. Also fetch any unlinked guest contributors credited on songs
    const rawContributions = await prisma.contribution.findMany({
      where: {
        profileId: null,
        song: { deletedAt: null, isDraft: false }
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
    console.error("Failed to fetch contributors data", e);
  }

  const combinedContributors = [...profiles, ...extraContributors];

  return <ContributorsShowcaseClient contributors={combinedContributors} />;
}
