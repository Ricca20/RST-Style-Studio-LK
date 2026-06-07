import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { t } from '@/lib/t';
import { Link } from '@/i18n/routing';

export default async function ProjectDetailPage({ params }) {
  const { slug, locale } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) return notFound();

  // Related projects
  let relatedProjects = [];
  try {
    relatedProjects = await prisma.project.findMany({
      where: { id: { not: project.id } },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {}

  return (
    <div className="min-h-screen bg-[#1a1022] pt-24">
      {/* Hero Header */}
      <div className="w-full lg:h-[60vh] h-[50vh] relative flex items-end">
        {project.thumbnail ? (
          <div className="absolute inset-0">
            <img
              src={project.thumbnail}
              alt={t(project, 'title', locale)}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1022] via-[#1a1022]/60 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1022] to-[#9d2bee]/10" />
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <span className="inline-block bg-[#9d2bee] text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-wider mb-4">
            {project.type}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white max-w-3xl leading-tight">
            {t(project, 'title', locale)}
          </h1>
          {project.clientName && (
            <p className="mt-4 text-xl text-gray-300">
              Client: <span className="font-semibold text-white">{project.clientName}</span>
            </p>
          )}
          {project.completionDate && (
            <p className="mt-2 text-gray-400">
              Completed: {new Date(project.completionDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-white/70 text-lg leading-relaxed max-w-none">
          {t(project, 'description', locale) ? (
            <div dangerouslySetInnerHTML={{ __html: t(project, 'description', locale) }} />
          ) : (
            <p className="text-white/40">No detailed description available.</p>
          )}
        </div>

        {/* Gallery */}
        {project.images && Array.isArray(project.images) && project.images.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">Project Gallery</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((imgUrl, i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#2a1d35] rounded-xl overflow-hidden border border-white/5 hover:border-[#9d2bee]/30 transition-all"
                >
                  <img
                    src={imgUrl}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#2a1d35] border border-white/5 mt-16">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#9d2bee]/20 to-transparent" />
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-bold text-white mb-3">Have a similar project?</h3>
              <p className="text-white/60 text-lg">
                We bring the same level of detail and passion to every project.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-white text-[#1a1022] text-base font-bold px-8 py-4 rounded-full transition-all hover:bg-[#9d2bee] hover:text-white hover:scale-105 flex items-center gap-2"
            >
              Start a Project
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">More Projects</h3>
            <Link
              href="/projects"
              className="text-[#9d2bee] hover:text-white transition-colors text-sm font-bold flex items-center gap-1"
            >
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((rp) => (
              <Link key={rp.id} href={`/projects/${rp.slug}`} className="group cursor-pointer">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-[#2a1d35]">
                  {rp.thumbnail ? (
                    <img
                      src={rp.thumbnail}
                      alt={t(rp, 'title', locale)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2a1d35] to-[#322839] flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-white/10">movie</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute bottom-4 left-4 bg-[#9d2bee]/90 text-white text-xs font-bold px-2 py-1 rounded">
                    {rp.type}
                  </div>
                </div>
                <h4 className="text-white font-bold text-lg group-hover:text-[#9d2bee] transition-colors">
                  {t(rp, 'title', locale)}
                </h4>
                {rp.clientName && <p className="text-white/40 text-sm">{rp.clientName}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
