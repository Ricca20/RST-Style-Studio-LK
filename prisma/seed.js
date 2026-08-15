const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default Studio Settings
  const settings = await prisma.studioSettings.create({
    data: {
      name: 'RST Style Studio LK',
      email: 'info@rststylestudiolk.com',
      phone: '+94 77 123 4567',
      whatsapp: '+94 77 123 4567',
      adminAlertEmail: 'admin@rststylestudiolk.com',
      facebookUrl: 'https://facebook.com/rststylestudiolk',
      youtubeUrl: 'https://youtube.com/c/rststylestudiolk',
    }
  });
  console.log('Created Studio Settings');

  // Create default admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@rststylestudiolk.com',
      name: 'RST Admin',
      role: 'SUPER_ADMIN',
      supabaseId: 'admin-supabase-uuid-placeholder' // Needs to match actual supabase user
    }
  });
  console.log('Created Admin User');

  // Create a profile for the admin
  await prisma.profile.create({
    data: {
      userId: admin.id,
      name: 'RST Studio',
      slug: 'rst-studio',
      mainRole: 'Lead Sound Engineer & Founder',
      bio: 'Mastering engineer with over a decade of analog recording and acoustic sculpture experience.',
      imageUrl: '/logo.png',
      isActive: true,
    }
  });
  console.log('Created Admin Profile');

  // Create some default services
  await prisma.service.createMany({
    data: [
      { id: 'rec', nameEn: 'Vocal & Instrument Tracking', descriptionEn: 'Acoustically isolated vocal booths equipped with Neumann U87 and AKG C414 microphones through tube preamps.', icon: 'mic', basePrice: 15000, isActive: true },
      { id: 'mix', nameEn: 'Analog Summing & Mixing', descriptionEn: '24-channel analog summing console combined with surgical 64-bit digital dynamic EQs and harmonic saturation.', icon: 'mix', basePrice: 25000, isActive: true },
      { id: 'master', nameEn: 'Stereo & Atmos Mastering', descriptionEn: 'Loudness optimized mastering for Spotify, Apple Music, and TIDAL with Dolby Atmos 7.1.4 spatial audio options.', icon: 'master', basePrice: 20000, isActive: true },
      { id: 'prod', nameEn: 'Full Song Production & Scoring', descriptionEn: 'Complete musical arrangement, live instrumentation, synth programming, and vocal melody construction.', icon: 'default', basePrice: 50000, isActive: true },
    ],
    skipDuplicates: true
  });
  console.log('Created Services');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
