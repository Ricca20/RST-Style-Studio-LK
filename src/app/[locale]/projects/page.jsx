import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { Link } from '@/i18n/routing';
import { t } from '@/lib/t';

export default async function ProjectsPage({ params }) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });

  let projects = [];
  try {
    projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (e) {}

  // Extract unique types for filter
  const types = [...new Set(projects.map((p) => p.type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#0f0b12] pt-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
          <span className="h-2 w-2 rounded-full bg-[#9d2bee] animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-widest text-white/90">
            Studio Portfolio
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight mb-6">
          OUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d2bee] to-purple-300">
            PROJECTS
          </span>
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto font-light">
          Explore our portfolio of audio, video, and branding works.
        </p>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 pb-32">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h2 className="text-2xl font-bold text-white">{tNav('projects')}</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <button className="px-5 py-2 rounded-full bg-[#9d2bee] text-white text-sm font-medium shadow-lg shadow-[#9d2bee]/25">
              All
            </button>
            {types.map((type) => (
              <button
                key={type}
                className="px-5 py-2 rounded-full bg-[#322839] text-gray-300 hover:text-white hover:bg-[#322839]/80 text-sm font-medium transition-all"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#1a1620]">
            <span className="material-symbols-outlined text-5xl text-white/10 mb-4 block">folder_open</span>
            <p className="text-white/40">No projects available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <div className="bg-[#1a1620] rounded-2xl overflow-hidden border border-white/5 hover:border-[#9d2bee]/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(157,43,238,0.1)] h-full flex flex-col">
                  <div className="aspect-video bg-[#322839] relative overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={t(project, 'title', locale)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-white/10">movie</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[#9d2bee] px-3 py-1 text-xs font-bold rounded-full border border-white/10">
                      {project.type}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-white group-hover:text-[#9d2bee] transition-colors">
                        {t(project, 'title', locale)}
                      </h3>
                      {project.clientName && (
                        <p className="text-sm font-medium text-white/40 mt-2">
                          Client: {project.clientName}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 flex items-center gap-1 text-[#9d2bee] font-bold text-sm group-hover:translate-x-1 transition-transform">
                      View Project
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
