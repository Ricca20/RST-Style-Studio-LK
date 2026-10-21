import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { guestNameFromSlug, isGuestSlug, legacyGuestKey } from '@/lib/utils/guestSlug';
import ExtendedContributorProfileClient from '@/components/public/ExtendedContributorProfileClient';

const PUBLIC_PROFILE = { isActive: true, isApproved: true, deletedAt: null };

/** Finds the credited name for a guest slug, or null if nobody by that name is credited. */
async function findGuestName(slug) {
  const name = guestNameFromSlug(slug);
  const exact = await prisma.contribution.findFirst({
    where: { profileId: null, name: { equals: name, mode: 'insensitive' }, song: { deletedAt: null, isDraft: false } },
    select: { name: true },
  });
  if (exact) return exact.name;

  // Old links used a lossy Latin-only slug; match it against credited guest names
  const guests = await prisma.contribution.findMany({
    where: { profileId: null, song: { deletedAt: null, isDraft: false } },
    select: { name: true },
    distinct: ['name'],
  });
  return guests.find((g) => legacyGuestKey(g.name) === name.toLowerCase())?.name || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const profile = await prisma.profile.findFirst({ where: { slug, ...PUBLIC_PROFILE } });
  const name = profile?.name || (isGuestSlug(slug) ? await findGuestName(slug) : null);
  if (!name) return { title: 'Contributor not found | RST Studio' };

  const role = profile?.mainRole || 'Contributor';
  return {
    title: `${name} - ${role} | RST Studio`,
    description: profile?.bio || `View ${name}'s credits on RST Style Studio LK productions.`,
  };
}

export async function generateStaticParams() {
  const profiles = await prisma.profile.findMany({
    where: PUBLIC_PROFILE,
    select: { slug: true }
  });
  return profiles.map((p) => ({ slug: p.slug }));
}

export default async function ProfileDetailPage({ params }) {
  const { slug } = await params;

  let profile = null;
  let credits = [];

  try {
    const dbProfile = await prisma.profile.findFirst({
      where: { slug, ...PUBLIC_PROFILE },
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

    if (dbProfile) {
      profile = {
        id: dbProfile.id,
        name: dbProfile.name,
        mainRole: dbProfile.mainRole || 'Studio Architect & Contributor',
        bio: dbProfile.bio,
        imageUrl: dbProfile.imageUrl,
        slug: dbProfile.slug,
        galleryImages: dbProfile.galleryImages || [],
        socialLinks: dbProfile.socialLinks || {}
      };
      credits = dbProfile.credits || [];
    }
  } catch (e) {
    console.error("Failed to fetch profile by slug", e);
  }

  // Not a public profile: it may be a guest credited on songs without a profile
  if (!profile && isGuestSlug(slug)) {
    const guestName = await findGuestName(slug).catch(() => null);
    if (guestName) {
      profile = {
        name: guestName,
        mainRole: 'Credited Studio Artist',
        bio: 'Credited sound architect and contributor across RST Style Studio LK releases.',
        imageUrl: null,
        slug,
        galleryImages: [],
        socialLinks: {}
      };
    }
  }

  if (!profile) notFound();

  // Also query any song contributions matching this contributor's name or profile ID
  let allSongCredits = [];
  try {
    const matchingContributions = await prisma.contribution.findMany({
      where: {
        OR: [
          ...(profile.id ? [{ profileId: profile.id }] : []),
          { name: { equals: profile.name, mode: 'insensitive' } }
        ]
      },
      include: {
        song: true
      }
    });

    // Merge with credits
    const merged = [...credits, ...matchingContributions];
    const uniqueSongsMap = new Map();

    merged.forEach(credit => {
      if (credit.song && !credit.song.isDraft && !credit.song.deletedAt) {
        if (!uniqueSongsMap.has(credit.song.id)) {
          uniqueSongsMap.set(credit.song.id, {
            song: credit.song,
            roles: [credit.role]
          });
        } else if (!uniqueSongsMap.get(credit.song.id).roles.includes(credit.role)) {
          uniqueSongsMap.get(credit.song.id).roles.push(credit.role);
        }
      }
    });

    allSongCredits = Array.from(uniqueSongsMap.values());
    allSongCredits.sort((a, b) => (b.song.releaseYear || 0) - (a.song.releaseYear || 0));
  } catch (e) {
    console.error("Failed to fetch song contributions", e);
  }

  return (
    <ExtendedContributorProfileClient
      profile={profile}
      projects={allSongCredits}
    />
  );
}
