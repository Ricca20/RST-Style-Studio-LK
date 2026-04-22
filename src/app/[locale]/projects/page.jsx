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
  } catch(e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">{tNav('projects')}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">Explore our portfolio of audio, video, and branding works.</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">No projects available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group block text-left">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-6xl opacity-40">🎬</div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-blue-600 px-3 py-1 text-xs font-bold rounded-full shadow-sm">
                    {project.type}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{t(project, 'title', locale)}</h3>
                    {project.clientName && (
                      <p className="text-sm font-medium text-gray-500 mt-2">Client: {project.clientName}</p>
                    )}
                  </div>
                  <div className="mt-6">
                    <span className="text-blue-600 font-semibold group-hover:tracking-wide transition-all">View Project →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
  
