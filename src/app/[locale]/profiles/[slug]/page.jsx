import prisma from '@/lib/db';
import ExtendedContributorProfileClient from '@/components/public/ExtendedContributorProfileClient';

const DEMO_PROFILES = {
  'rst-studio': {
    name: 'RST Studio',
    mainRole: 'Lead Sound Engineer & Founder',
    bio: 'Mastering engineer with over a decade of analog recording and acoustic sculpture experience at RST Style Studio LK.',
    imageUrl: '/logo.PNG',
    slug: 'rst-studio',
    socialLinks: { instagram: 'https://instagram.com', spotify: 'https://spotify.com' }
  },
  'kasun': {
    name: 'Kasun De Silva',
    mainRole: 'Senior Producer & Arranger',
    bio: 'Specialist in modern synthwave, orchestral film scoring, and vocal harmony arrangements across top Sinhala & English releases.',
    imageUrl: null,
    slug: 'kasun',
    socialLinks: { instagram: 'https://instagram.com' }
  },
  'thilini': {
    name: 'Thilini Perera',
    mainRole: 'Vocalist & Vocal Coach',
    bio: 'Classical and pop vocal trainer helping artists deliver emotionally resonant performances.',
    imageUrl: null,
    slug: 'thilini',
    socialLinks: { youtube: 'https://youtube.com' }
  },
  'amila': {
    name: 'Amila Fernando',
    mainRole: 'Mixing & Mastering Engineer',
    bio: 'Dolby Atmos certified mix engineer specializing in deep bass and panoramic stereo imaging.',
    imageUrl: null,
    slug: 'amila',
    socialLinks: {}
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const profile = await prisma.profile.findUnique({ where: { slug } });
  const demo = DEMO_PROFILES[slug];
  const name = profile?.name || demo?.name || 'Studio Contributor';

  return {
    title: `${name} | Sound Architects | RST Studio`,
    description: profile?.bio || demo?.bio || `Explore ${name}'s studio productions and discography on RST Style Studio LK.`,
  };
}

export default async function ProfileDetailPage({ params }) {
  const { slug } = await params;

  let profile = null;
  let credits = [];

  try {
    const dbProfile = await prisma.profile.findUnique({
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

  // If not found in DB Profile table, check demo profiles or guest contributors
  if (!profile) {
    const demo = DEMO_PROFILES[slug];
    if (demo) {
      profile = demo;
    } else {
      // Decode slug into a human name (e.g., guest-saman-silva -> Saman Silva)
      const cleanName = slug
        .replace(/^guest-/, '')
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      profile = {
        name: cleanName || 'Studio Contributor',
        mainRole: 'Credited Studio Artist',
        bio: `Credited sound architect and contributor across RST Style Studio LK releases.`,
        imageUrl: null,
        slug: slug,
        galleryImages: [],
        socialLinks: {}
      };
    }
  }

  // Also query any song contributions matching this contributor's name or profile ID
  let allSongCredits = [];
  try {
    const matchingContributions = await prisma.contribution.findMany({
      where: {
        OR: [
          profile.id ? { profileId: profile.id } : {},
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
      if (credit.song && !credit.song.isDraft) {
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
