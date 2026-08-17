import 'dotenv/config';
import prisma from '../src/lib/db';

async function main() {
  console.log('Seeding database with extensive Sri Lankan context...');

  // 1. Users (5 rows)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@rststylestudiolk.com' },
      update: {},
      create: { email: 'admin@rststylestudiolk.com', name: 'RST Admin', role: 'SUPER_ADMIN', supabaseId: 'uuid-admin' }
    }),
    prisma.user.upsert({
      where: { email: 'nimal@example.com' },
      update: {},
      create: { email: 'nimal@example.com', name: 'Nimal Perera', role: 'VIEWER', supabaseId: 'uuid-nimal' }
    }),
    prisma.user.upsert({
      where: { email: 'sunil@example.com' },
      update: {},
      create: { email: 'sunil@example.com', name: 'Sunil Shantha', role: 'VIEWER', supabaseId: 'uuid-sunil' }
    }),
    prisma.user.upsert({
      where: { email: 'kamal@example.com' },
      update: {},
      create: { email: 'kamal@example.com', name: 'Kamal Addararachchi', role: 'VIEWER', supabaseId: 'uuid-kamal' }
    }),
    prisma.user.upsert({
      where: { email: 'amara@example.com' },
      update: {},
      create: { email: 'amara@example.com', name: 'Amara Wijesinghe', role: 'VIEWER', supabaseId: 'uuid-amara' }
    })
  ]);
  console.log('Created 5 Users');

  // 2. StudioSettings (Singleton conceptually, but we ensure it exists)
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
  }
  console.log('Created Studio Settings');

  // 3. Profiles (5 rows)
  const profilesData = [
    { name: 'RST Studio', slug: 'rst-studio', mainRole: 'Lead Sound Engineer', bio: 'Mastering engineer with over a decade of analog recording.', userId: users[0].id },
    { name: 'Kasun Kalhara', slug: 'kasun-kalhara', mainRole: 'Music Director', bio: 'Renowned Sri Lankan music director and vocalist.' },
    { name: 'Nirosha Virajini', slug: 'nirosha-virajini', mainRole: 'Vocalist', bio: 'Award-winning playback singer in Sri Lanka.' },
    { name: 'Rookantha Gunathilake', slug: 'rookantha', mainRole: 'Composer', bio: 'Veteran Sri Lankan musician and composer.' },
    { name: 'Bathiya & Santhush', slug: 'bns', mainRole: 'Pop Duo', bio: 'Pioneers of the Sri Lankan pop music industry.' }
  ];

  const profiles = await Promise.all(profilesData.map(p => 
    prisma.profile.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, isActive: true, isApproved: true }
    })
  ));
  console.log('Created 5 Profiles');

  // 4. Collaborator (5 rows)
  const roles = ['MUSIC', 'VOCAL', 'LYRICS', 'MELODY', 'MIX_MASTER'];
  await Promise.all(profiles.map((p, index) => 
    prisma.collaborator.upsert({
      where: { profileId_role: { profileId: p.id, role: roles[index] } },
      update: {},
      create: { profileId: p.id, role: roles[index], price: (index + 1) * 10000, isActive: true }
    })
  ));
  console.log('Created 5 Collaborators');

  // 5. Service (5 rows)
  await prisma.service.createMany({
    data: [
      { id: 'rec', nameEn: 'Vocal & Instrument Tracking', nameSi: 'හඬ සහ වාදන පටිගත කිරීම', descriptionEn: 'Acoustically isolated vocal booths', icon: 'mic', basePrice: 15000, isActive: true },
      { id: 'mix', nameEn: 'Analog Summing & Mixing', nameSi: 'මික්සින්', descriptionEn: '24-channel analog summing console', icon: 'mix', basePrice: 25000, isActive: true },
      { id: 'master', nameEn: 'Stereo & Atmos Mastering', nameSi: 'මාස්ටරින්', descriptionEn: 'Loudness optimized mastering', icon: 'master', basePrice: 20000, isActive: true },
      { id: 'prod', nameEn: 'Full Song Production', nameSi: 'සම්පූර්ණ ගීත නිර්මාණය', descriptionEn: 'Complete musical arrangement', icon: 'default', basePrice: 50000, isActive: true },
      { id: 'live', nameEn: 'Live Band Recording', nameSi: 'සජීවී සංගීත කණ්ඩායම් පටිගත කිරීම', descriptionEn: 'Live band multitrack recording', icon: 'default', basePrice: 35000, isActive: true }
    ],
    skipDuplicates: true
  });
  console.log('Created 5 Services');

  // 6. PricingConfig (5 rows)
  const pricingConfigs = ['BASE_STUDIO_FEE', 'MIXING_HOURLY', 'MASTERING_FEE', 'VOCAL_TUNING', 'INSTRUMENT_RENTAL'];
  await Promise.all(pricingConfigs.map((key, i) => 
    prisma.pricingConfig.upsert({
      where: { itemKey: key },
      update: {},
      create: { itemKey: key, type: 'SERVICE', price: (i + 1) * 5000, currency: 'LKR' }
    })
  ));
  console.log('Created 5 PricingConfigs');

  // 7. Song (5 rows)
  const songsData = [
    { titleEn: 'Maha Wassanaya', titleSi: 'මහ වැස්සනය', slug: 'maha-wassanaya', projectType: 'SONG', releaseYear: 2023, genres: ['Sinhala Pop', 'Classical'] },
    { titleEn: 'Derana Dream Star', titleSi: 'දෙරණ ඩ්‍රීම් ස්ටාර්', slug: 'derana-dream-star', projectType: 'COMMERCIAL', releaseYear: 2024, genres: ['Commercial'] },
    { titleEn: 'Mata Aloke Genadevi', titleSi: 'මට ආලෝකේ ගෙනදේවි', slug: 'mata-aloke', projectType: 'SONG', releaseYear: 2022, genres: ['Classical'] },
    { titleEn: 'Manamali', titleSi: 'මනමාලි', slug: 'manamali', projectType: 'SONG', releaseYear: 2021, genres: ['Sinhala Pop'] },
    { titleEn: 'Surangana Veswala', titleSi: 'සුරඟන වෙස්වලා', slug: 'surangana', projectType: 'SONG', releaseYear: 2020, genres: ['Baila'] }
  ];
  const songs = await Promise.all(songsData.map((song, i) => 
    prisma.song.upsert({
      where: { slug: song.slug },
      update: {},
      create: { ...song, description: `A beautiful Sri Lankan ${song.genres[0]} track.` }
    })
  ));
  console.log('Created 5 Songs');

  // Ensure Contributions (5 rows)
  for (let i = 0; i < songs.length; i++) {
    await prisma.contribution.upsert({
      where: { songId_name_role: { songId: songs[i].id, name: profiles[i].name, role: roles[i] } },
      update: {},
      create: { songId: songs[i].id, name: profiles[i].name, role: roles[i], profileId: profiles[i].id }
    });
  }
  console.log('Created 5 Contributions');

  // 8. QuotationRequest (5 rows)
  await Promise.all([1, 2, 3, 4, 5].map(i => 
    prisma.quotationRequest.create({
      data: {
        name: `Customer ${i}`, phone: `071234567${i}`, email: `customer${i}@example.com`,
        genre: 'Sinhala Pop', description: `Need a new song ${i}`, estimatedBudget: 250000 + i * 10000, status: 'PENDING'
      }
    })
  ));
  console.log('Created 5 QuotationRequests');

  // 9. SocialCache (5 rows - mock platforms)
  const platforms = ['YOUTUBE', 'FACEBOOK', 'SPOTIFY', 'APPLE_MUSIC', 'INSTAGRAM'];
  await Promise.all(platforms.map(p => 
    prisma.socialCache.upsert({
      where: { platform: p },
      update: {},
      create: { platform: p, data: { followers: 10000, views: 50000 } }
    })
  ));
  console.log('Created 5 SocialCache rows');

  // 10. AuditLog (5 rows)
  await Promise.all([1, 2, 3, 4, 5].map(i => 
    prisma.auditLog.create({
      data: { userId: users[0].id, action: 'CREATE_SONG', entity: 'Song', entityId: songs[i-1].id, details: { attempt: i }, ipAddress: '127.0.0.1' }
    })
  ));
  console.log('Created 5 AuditLogs');

  // 11. Notification (5 rows)
  await Promise.all([1, 2, 3, 4, 5].map(i => 
    prisma.notification.create({
      data: { userId: users[0].id, title: `Alert ${i}`, message: `New notification ${i} for studio`, type: 'SYSTEM' }
    })
  ));
  console.log('Created 5 Notifications');

  // 12. ClaimRequest (5 rows)
  await Promise.all([1, 2, 3, 4, 5].map(i => 
    prisma.claimRequest.create({
      data: { userId: users[1].id, songId: songs[i-1].id, role: 'Lyricist', proof: `Link ${i}`, status: 'PENDING' }
    })
  ));
  console.log('Created 5 ClaimRequests');

  // 13. GamePlayer, GameScore, MonthlyLeaderboard (5 rows each)
  const players = await Promise.all([1, 2, 3, 4, 5].map(i => 
    prisma.gamePlayer.upsert({
      where: { email: `player${i}@example.com` },
      update: {},
      create: { email: `player${i}@example.com`, username: `MusicLoverLK_${i}`, language: 'si' }
    })
  ));
  
  await Promise.all(players.map((p, i) => 
    prisma.gameScore.upsert({
      where: { playerId_gameType_month_year: { playerId: p.id, gameType: 'TRIVIA', month: i + 1, year: 2026 } },
      update: { score: 1500 + i * 100 },
      create: { playerId: p.id, gameType: 'TRIVIA', month: i + 1, year: 2026, score: 1500 + i * 100 }
    })
  ));

  await Promise.all(players.map((p, i) => 
    prisma.monthlyLeaderboard.upsert({
      where: { gameType_month_year: { gameType: 'TRIVIA', month: i + 1, year: 2026 } },
      update: {},
      create: { gameType: 'TRIVIA', month: i + 1, year: 2026, prizeDetails: 'Studio Headphones', winnerId: p.id, winnerScore: 1500 + i * 100 }
    })
  ));
  console.log('Created 5 GamePlayers, Scores, Leaderboards');

  // 14. TriviaQuestion (5 rows)
  await prisma.triviaQuestion.createMany({
    data: [
      {
        difficulty: 'EASY', questionEn: 'Who is known as the Nightingale of Sri Lanka?', questionSi: 'ශ්‍රී ලංකාවේ කෝකිලාවිය ලෙස හැඳින්වෙන්නේ කවුද?',
        options: [{ id: '1', textEn: 'Nanda Malini', textSi: 'නන්දා මාලිනී' }, { id: '2', textEn: 'Latha Walpola', textSi: 'ලතා වල්පොල' }, { id: '3', textEn: 'Sujatha Aththanayake', textSi: 'සුජාතා අත්තනායක' }, { id: '4', textEn: 'Neela Wickramasinghe', textSi: 'නීලා වික්‍රමසිංහ' }],
        correctOption: '2'
      },
      {
        difficulty: 'MEDIUM', questionEn: 'Who composed the Sri Lankan National Anthem?', questionSi: 'ශ්‍රී ලංකා ජාතික ගීය රචනා කළේ කවුද?',
        options: [{ id: '1', textEn: 'Sunil Shantha', textSi: 'සුනිල් ශාන්ත' }, { id: '2', textEn: 'Ananda Samarakoon', textSi: 'ආනන්ද සමරකෝන්' }, { id: '3', textEn: 'W. D. Amaradeva', textSi: 'ඩබ්. ඩී. අමරදේව' }, { id: '4', textEn: 'Mahagama Sekara', textSi: 'මහගම සේකර' }],
        correctOption: '2'
      },
      {
        difficulty: 'EASY', questionEn: 'Which instrument is traditionally used in Sri Lankan baila music?', questionSi: 'ශ්‍රී ලාංකීය බයිලා සංගීතයේ සාම්ප්‍රදායිකව භාවිතා කරන භාණ්ඩය කුමක්ද?',
        options: [{ id: '1', textEn: 'Sitar', textSi: 'සිතාරය' }, { id: '2', textEn: 'Tabla', textSi: 'තබ්ලාව' }, { id: '3', textEn: 'Rabana', textSi: 'රබාන' }, { id: '4', textEn: 'Conga', textSi: 'කොන්ගා' }],
        correctOption: '3'
      },
      {
        difficulty: 'HARD', questionEn: 'Which Sri Lankan artist first performed at the Sydney Opera House?', questionSi: 'සිඩ්නි ඔපෙරා හවුස් හි ප්‍රථම වරට ගායනා කළ ශ්‍රී ලාංකික කලාකරුවා කවුද?',
        options: [{ id: '1', textEn: 'W. D. Amaradeva', textSi: 'ඩබ්. ඩී. අමරදේව' }, { id: '2', textEn: 'Sunil Santha', textSi: 'සුනිල් සාන්ත' }, { id: '3', textEn: 'Clarence Wijewardena', textSi: 'ක්ලැරන්ස් විජේවර්ධන' }, { id: '4', textEn: 'Victor Rathnayake', textSi: 'වික්ටර් රත්නායක' }],
        correctOption: '1'
      },
      {
        difficulty: 'MEDIUM', questionEn: 'Who is known as the father of Sri Lankan pop music?', questionSi: 'ශ්‍රී ලාංකේය පොප් සංගීතයේ පියා ලෙස හැඳින්වෙන්නේ කවුද?',
        options: [{ id: '1', textEn: 'Clarence Wijewardena', textSi: 'ක්ලැරන්ස් විජේවර්ධන' }, { id: '2', textEn: 'C. T. Fernando', textSi: 'සී. ටී. ප්‍රනාන්දු' }, { id: '3', textEn: 'H. R. Jothipala', textSi: 'එච්. ආර්. ජෝතිපාල' }, { id: '4', textEn: 'Milton Mallawarachchi', textSi: 'මිල්ටන් මල්ලවආරච්චි' }],
        correctOption: '1'
      }
    ]
  });
  console.log('Created 5 TriviaQuestions');

  // 15. HonoraryMention (5 rows)
  await prisma.honoraryMention.createMany({
    data: [
      { name: 'W. D. Amaradeva', title: 'Pandit', description: 'A Sri Lankan vocalist, violinist and composer.', imageUrl: '/amaradeva.jpg' },
      { name: 'Clarence Wijewardena', title: 'Pioneer', description: 'Pioneer of Sri Lankan pop music.', imageUrl: '/clarence.jpg' },
      { name: 'Nanda Malini', title: 'Veteran Singer', description: 'One of the best known and most respected singers of Sri Lanka.', imageUrl: '/nanda.jpg' },
      { name: 'H. R. Jothipala', title: 'Legendary Playback Singer', description: 'Legendary playback singer in Sinhala cinema.', imageUrl: '/jothipala.jpg' },
      { name: 'Sunil Shantha', title: 'Music Innovator', description: 'Pivotal figure in the development of Sinhala music.', imageUrl: '/sunil.jpg' }
    ]
  });
  console.log('Created 5 HonoraryMentions');

  console.log('Extensive Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
