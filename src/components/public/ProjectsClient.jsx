'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Play, Video } from 'lucide-react';
import { t } from '@/lib/utils/t';

export default function ProjectsClient({ initialProjects, projectTypes, locale }) {
  const router = useRouter();
  const [activeType, setActiveType] = useState('ALL');

  const filteredProjects = initialProjects.filter(
    (p) => activeType === 'ALL' || p.projectType === activeType
  );

  const handlePlayProject = (e, project) => {
    e.preventDefault();
    router.push(`/${locale}/projects/${project.slug}`);
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveType('ALL')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold font-mono transition-all ${
            activeType === 'ALL'
              ? 'bg-[#0ea5e9] text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          ALL PROJECTS
        </button>
        {projectTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold font-mono transition-all uppercase ${
              activeType === type
                ? 'bg-[#0ea5e9] text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-white/40 mb-4">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
          <p className="text-white/60 text-sm max-w-sm mx-auto">
            We couldn't find any projects matching this filter. Try selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const title = t(project, 'title', locale) || project.titleEn || 'Untitled Project';

            return (
              <div
                key={project.id}
                onClick={(e) => handlePlayProject(e, project)}
                className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#0ea5e9]/50 transition-all cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              >
                {/* Cover Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-white/5">
                      <Video className="w-10 h-10 text-white/20 mb-3" />
                      <span className="text-xs font-mono font-bold text-white/30 tracking-widest uppercase">
                        NO THUMBNAIL
                      </span>
                    </div>
                  )}

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-10">
                    <div className="w-16 h-16 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shadow-[0_0_25px_#0ea5e9] transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-white/50 uppercase mb-2">
                      <span>{project.releaseYear || '2025'}</span>
                      <span className="text-[#0ea5e9] font-bold border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 px-2 py-0.5 rounded-full">
                        {project.projectType.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-white font-black text-xl tracking-tight leading-tight mb-2 group-hover:text-[#0ea5e9] transition-colors line-clamp-1">
                      {title}
                    </h4>
                    <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
                      {t(project, 'description', locale) || 'A creative project produced at RST Style Studio.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
