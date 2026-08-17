import 'dotenv/config';
import prisma from '../src/lib/db';

async function main() {
  console.log('Seeding database with Sri Lankan context...');

  // 1. User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rststylestudiolk.com' },
    update: {},
    create: {
      email: 'admin@rststylestudiolk.com',
      name: 'RST Admin',
      role: 'SUPER_ADMIN',
      supabaseId: 'admin-supabase-uuid-placeholder'
    }
  });
  console.log('Created Admin User');

  // 2. StudioSettings
  const settings = await prisma.studioSettings.findFirst();
  if (!settings) {
    await prisma.studioSettings.create({
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
  }

  // 3. Profiles
  const profileAdmin = await prisma.profile.upsert({
    where: { slug: 'rst-studio' },
    update: {},
    create: {
      userId: admin.id,
      name: 'RST Studio',
      slug: 'rst-studio',
      mainRole: 'Lead Sound Engineer & Founder',
      bio: 'Mastering engineer with over a decade of analog recording and acoustic sculpture experience.',
      imageUrl: '/logo.png',
      isActive: true,
      isApproved: true
    }
  });

  const profileKasun = await prisma.profile.upsert({
    where: { slug: 'kasun-kalhara' },
    update: {},
    create: {
      name: 'Kasun Kalhara',
      slug: 'kasun-kalhara',
      mainRole: 'Music Director',
      bio: 'Renowned Sri Lankan music director and vocalist.',
      isActive: true,
      isApproved: true
    }
  });

  const profileNirosha = await prisma.profile.upsert({
    where: { slug: 'nirosha-virajini' },
    update: {},
    create: {
      name: 'Nirosha Virajini',
      slug: 'nirosha-virajini',
      mainRole: 'Vocalist',
      bio: 'Award-winning playback singer in Sri Lanka.',
      isActive: true,
      isApproved: true
    }
  });
  console.log('Created Profiles');

  // 4. Collaborator
  await prisma.collaborator.upsert({
    where: { profileId_role: { profileId: profileKasun.id, role: 'MUSIC' } },
    update: {},
    create: {
      profileId: profileKasun.id,
      role: 'MUSIC',
      price: 150000,
      isActive: true
    }
  });
  console.log('Created Collaborators');

  // 5. Service
  await prisma.service.createMany({
    data: [
      { id: 'rec', nameEn: 'Vocal & Instrument Tracking', nameSi: 'හඬ සහ වාදන පටිගත කිරීම', descriptionEn: 'Acoustically isolated vocal booths equipped with Neumann U87 and AKG C414 microphones through tube preamps.', icon: 'mic', basePrice: 15000, isActive: true },
      { id: 'mix', nameEn: 'Analog Summing & Mixing', nameSi: 'මික්සින්', descriptionEn: '24-channel analog summing console combined with surgical 64-bit digital dynamic EQs and harmonic saturation.', icon: 'mix', basePrice: 25000, isActive: true },
      { id: 'master', nameEn: 'Stereo & Atmos Mastering', nameSi: 'මාස්ටරින්', descriptionEn: 'Loudness optimized mastering for Spotify, Apple Music, and TIDAL with Dolby Atmos 7.1.4 spatial audio options.', icon: 'master', basePrice: 20000, isActive: true },
      { id: 'prod', nameEn: 'Full Song Production & Scoring', nameSi: 'සම්පූර්ණ ගීත නිර්මාණය', descriptionEn: 'Complete musical arrangement, live instrumentation, synth programming, and vocal melody construction.', icon: 'default', basePrice: 50000, isActive: true },
    ],
    skipDuplicates: true
  });
  console.log('Created Services');

  // 6. PricingConfig
  await prisma.pricingConfig.upsert({
    where: { itemKey: 'BASE_STUDIO_FEE' },
    update: {},
    create: {
      itemKey: 'BASE_STUDIO_FEE',
      type: 'SERVICE',
      price: 5000,
      currency: 'LKR'
    }
  });
  console.log('Created PricingConfig');

  // 7. Song & Contribution
  const songMahaWassanaya = await prisma.song.upsert({
    where: { slug: 'maha-wassanaya' },
    update: {},
    create: {
      projectType: 'SONG',
      titleEn: 'Maha Wassanaya',
      titleSi: 'මහ වැස්සනය',
      slug: 'maha-wassanaya',
      description: 'A beautiful classic Sri Lankan melody.',
      releaseYear: 2023,
      genres: ['Sinhala Pop', 'Classical'],
      contributions: {
        create: [
          { name: 'Kasun Kalhara', role: 'Vocalist', profileId: profileKasun.id },
          { name: 'RST Studio', role: 'Mix & Master', profileId: profileAdmin.id }
        ]
      }
    }
  });

  const songProject = await prisma.song.upsert({
    where: { slug: 'derana-dream-star-promo' },
    update: {},
    create: {
      projectType: 'COMMERCIAL',
      titleEn: 'Derana Dream Star Promo',
      titleSi: 'දෙරණ ඩ්‍රීම් ස්ටාර්',
      slug: 'derana-dream-star-promo',
      description: 'Audio production for TV commercial.',
      releaseYear: 2024,
      genres: ['Commercial'],
      contributions: {
        create: [
          { name: 'RST Studio', role: 'Audio Engineering', profileId: profileAdmin.id }
        ]
      }
    }
  });
  console.log('Created Songs and Contributions');

  // 8. QuotationRequest
  await prisma.quotationRequest.create({
    data: {
      name: 'Kamal Perera',
      phone: '0712345678',
      email: 'kamal@example.com',
      genre: 'Sinhala Pop',
      description: 'Need a new song for upcoming teledrama',
      estimatedBudget: 250000,
      status: 'PENDING'
    }
  });
  console.log('Created QuotationRequest');

  // 9. SocialCache
  await prisma.socialCache.upsert({
    where: { platform: 'YOUTUBE' },
    update: {},
    create: {
      platform: 'YOUTUBE',
      data: { subscribers: 15000, views: 2500000 }
    }
  });
  console.log('Created SocialCache');

  // 10. AuditLog
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'CREATE_SONG',
      entity: 'Song',
      entityId: songMahaWassanaya.id,
      details: { title: 'Maha Wassanaya' },
      ipAddress: '127.0.0.1'
    }
  });
  console.log('Created AuditLog');

  // 11. Notification
  await prisma.notification.create({
    data: {
      userId: admin.id,
      title: 'New Quotation Received',
      message: 'Kamal Perera has requested a quotation.',
      type: 'QUOTATION'
    }
  });
  console.log('Created Notification');

  // 12. ClaimRequest
  const guestUser = await prisma.user.upsert({
    where: { email: 'guest@rststylestudiolk.com' },
    update: {},
    create: {
      email: 'guest@rststylestudiolk.com',
      name: 'Sunil Shantha',
      role: 'VIEWER',
      supabaseId: 'guest-supabase-uuid'
    }
  });

  await prisma.claimRequest.create({
    data: {
      userId: guestUser.id,
      songId: songMahaWassanaya.id,
      role: 'Lyricist',
      proof: 'Link to lyrics page',
      status: 'PENDING'
    }
  });
  console.log('Created ClaimRequest');

  // 13. GamePlayer, GameScore, MonthlyLeaderboard
  const player1 = await prisma.gamePlayer.upsert({
    where: { email: 'player1@example.com' },
    update: {},
    create: {
      email: 'player1@example.com',
      username: 'MusicLoverLK',
      language: 'si',
    }
  });

  await prisma.gameScore.upsert({
    where: { playerId_gameType_month_year: { playerId: player1.id, gameType: 'TRIVIA', month: 8, year: 2026 } },
    update: { score: 1500 },
    create: {
      playerId: player1.id,
      gameType: 'TRIVIA',
      month: 8,
      year: 2026,
      score: 1500
    }
  });

  await prisma.monthlyLeaderboard.upsert({
    where: { gameType_month_year: { gameType: 'TRIVIA', month: 8, year: 2026 } },
    update: {},
    create: {
      gameType: 'TRIVIA',
      month: 8,
      year: 2026,
      prizeDetails: 'Studio Headphones',
      winnerId: player1.id,
      winnerScore: 1500
    }
  });
  console.log('Created Game Data');

  // 14. TriviaQuestion
  await prisma.triviaQuestion.create({
    data: {
      difficulty: 'EASY',
      questionEn: 'Who is known as the Nightingale of Sri Lanka?',
      questionSi: 'ශ්‍රී ලංකාවේ කෝකිලාවිය ලෙස හැඳින්වෙන්නේ කවුද?',
      options: [
        { id: '1', textEn: 'Nanda Malini', textSi: 'නන්දා මාලිනී' },
        { id: '2', textEn: 'Latha Walpola', textSi: 'ලතා වල්පොල' },
        { id: '3', textEn: 'Sujatha Aththanayake', textSi: 'සුජාතා අත්තනායක' },
        { id: '4', textEn: 'Neela Wickramasinghe', textSi: 'නීලා වික්‍රමසිංහ' }
      ],
      correctOption: '2'
    }
  });
  console.log('Created TriviaQuestion');

  // 15. HonoraryMention
  await prisma.honoraryMention.create({
    data: {
      name: 'W. D. Amaradeva',
      title: 'Pandit',
      description: 'A Sri Lankan vocalist, violinist and composer.',
      imageUrl: '/amaradeva.jpg'
    }
  });
  console.log('Created HonoraryMention');

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
