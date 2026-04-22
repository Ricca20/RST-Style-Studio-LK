import { PrismaClient, ContribRole, ProjectType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // 1. Studio Settings
  await prisma.studioSettings.create({
    data: {
      name: 'RST Style Studio LK',
      email: 'info@rststylestudio.lk',
      phone: '+94 77 123 4567',
      whatsapp: '+94 77 123 4567',
      address: '123 Music Lane, Colombo, Sri Lanka',
      facebookUrl: 'https://facebook.com/rststylestudiolk',
      youtubeUrl: 'https://youtube.com/c/RSTStyleStudioLK',
      spotifyUrl: 'https://open.spotify.com/user/rststylestudiolk',
    }
  })

  // 2. Contributors
  const kasun = await prisma.contributor.create({
    data: {
      nameEn: 'Kasun Kalhara',
      nameSi: 'කසුන් කල්හාර',
      nameIt: 'Kasun Kalhara',
      bioEn: 'Famous Sri Lankan vocalist and music director.',
      bioSi: 'අති දක්ෂ ගායකයෙක් සහ සංගීත අධ්‍යක්ෂකවරයෙක්.',
      bioIt: 'Famoso cantante e direttore musicale cingalese.',
    }
  })

  const rokas = await prisma.contributor.create({
    data: {
      nameEn: 'Rookantha Gunathilake',
      nameSi: 'රූකාන්ත ගුණතිලක',
      bioEn: 'Legendary Sri Lankan artist.',
      bioSi: 'ශ්‍රී ලංකාවේ ජනප්‍රිය ගායකයෙකි.',
    }
  })

  const nadini = await prisma.contributor.create({
    data: {
      nameEn: 'Nadini Premadasa',
      nameSi: 'නදිනි ප්‍රේමදාස',
    }
  })

  // 3. Songs
  const song1 = await prisma.song.create({
    data: {
      titleEn: 'Sandawathi',
      titleSi: 'සඳවතී',
      slug: 'sandawathi',
      genre: 'Pop',
      releaseYear: 2023,
      isFeatured: true,
    }
  })

  const song2 = await prisma.song.create({
    data: {
      titleEn: 'Oba Wenuwen',
      titleSi: 'ඔබ වෙනුවෙන්',
      slug: 'oba-wenuwen',
      genre: 'Classical Pop',
      releaseYear: 2022,
      isFeatured: true,
    }
  })

  // 4. Contributions (Link Songs and Contributors)
  await prisma.contribution.create({
    data: {
      songId: song1.id,
      contributorId: kasun.id,
      role: ContribRole.VOCALIST,
    }
  })

  await prisma.contribution.create({
    data: {
      songId: song1.id,
      contributorId: rokas.id,
      role: ContribRole.COMPOSER,
    }
  })

  // 5. Projects
  await prisma.project.create({
    data: {
      titleEn: 'Symphony Concert 2023',
      titleSi: 'සිම්ෆනි ප්‍රසංගය 2023',
      slug: 'symphony-concert-2023',
      type: ProjectType.AUDIO,
      isFeatured: true,
      clientName: 'Symphony LK',
    }
  })

  // 6. Services
  await prisma.service.create({
    data: {
      nameEn: 'Audio Recording',
      nameSi: 'ශබ්ද පටිගත කිරීම',
      descriptionEn: 'High-quality multi-track recording for bands and solo artists.',
      basePrice: 5000,
    }
  })

  await prisma.service.create({
    data: {
      nameEn: 'Music Video Production',
      nameSi: 'සංගීත වීඩියෝ නිෂ්පාදනය',
      descriptionEn: 'Full 4k music video production.',
      basePrice: 50000,
    }
  })

  // 7. Pricing Configs
  await prisma.pricingConfig.create({
    data: { itemKey: 'BASE_AUDIO', type: 'SERVICE', price: 5000 }
  })
  await prisma.pricingConfig.create({
    data: { itemKey: 'MELODY_EXTRA', type: 'OPTION', price: 2000 }
  })
  await prisma.pricingConfig.create({
    data: { itemKey: 'VIDEO_BASIC', type: 'SERVICE', price: 50000 }
  })

  // 8. Honorary Mentions
  await prisma.honoraryMention.create({
    data: {
      titleEn: 'Best Music Studio 2022',
      titleSi: '2022 හොඳම කලාගාරය',
      givenBy: 'SL Music Awards',
    }
  })

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  
