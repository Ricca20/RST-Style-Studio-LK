import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { t } from '@/lib/t';

export default async function ProjectDetailPage({ params }) {
  const { slug, locale } = await params;

  const project = await prisma.project.findUnique({
    where: { slug }
  });

  if (!project) return notFound();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Project Hero Header */}
      <div className="bg-gray-900 w-full lg:h-[60vh] h-[50vh] relative flex items-end">
        {project.thumbnail ? (
          <div className="absolute inset-0">
            <img src={project.thumbnail} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-blue-900/80"></div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-wider mb-4">
            {project.type}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white max-w-3xl leading-tight">
            {t(project, 'title', locale)}
          </h1>
          {project.clientName && (
            <p className="mt-4 text-xl text-gray-300">Client: <span className="font-semibold text-white">{project.clientName}</span></p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none">
          {t(project, 'description', locale) ? (
            <div dangerouslySetInnerHTML={{ __html: t(project, 'description', locale) }} />
          ) : (
            <p>No detailed description available.</p>
          )}
        </div>

        {/* Gallery Support (Basic Placeholder structure based on schema any images field) */}
        {project.images && Array.isArray(project.images) && project.images.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Project Gallery</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((imgUrl, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <img src={imgUrl} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  
