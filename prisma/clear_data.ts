import db from '../src/lib/db';
const prisma = db;

async function main() {
  console.log('Clearing dummy data from the database...');

  // Delete all relations first
  await prisma.contribution.deleteMany({});

  // Delete main entities
  await prisma.song.deleteMany({});
  await prisma.contributor.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.quotationRequest.deleteMany({});
  await prisma.socialCache.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.honoraryMention.deleteMany({});

  // We are purposely NOT deleting User, StudioSettings, and PricingConfig
  // because StudioSettings holds the site name and PricingConfig holds the calculator logic.

  console.log('Successfully cleared all dummy songs, projects, and contributors!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
