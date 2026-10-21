import prisma from '@/lib/db';
import PageHero from '@/components/music/PageHero';
import CatalogClient from '@/components/public/CatalogClient';

export async function generateMetadata() {
  return {
    title: 'Projects | RST Style Studio LK',
    description: 'Music videos, film and commercial scores, and mixing and mastering projects by RST Style Studio LK.',
  };
}

export default async function ProjectsPage({ params }) {
  const { locale } = await params;

  let projects = [];
  try {
    projects = await prisma.song.findMany({
      where: { deletedAt: null, isDraft: false, projectType: { not: 'SONG' } },
      orderBy: [{ releaseYear: 'desc' }, { createdAt: 'desc' }],
      include: { contributions: { include: { profile: { select: { slug: true, name: true } } } } },
    });
  } catch (e) {
    console.error('Failed fetching projects:', e);
  }

  return (
    <>
      <PageHero
        side="B"
        label="Studio projects"
        title={['B-sides &', 'collabs.']}
        intro="Music videos, film and commercial scores, and the mixing and mastering we do for other artists."
        seed={29}
      />
      <section className="px-5 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <CatalogClient items={projects} locale={locale} filterBy="type" basePath="/projects" noun="project" />
        </div>
      </section>
    </>
  );
}
