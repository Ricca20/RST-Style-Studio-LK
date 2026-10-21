import Image from 'next/image';
import { Play } from 'lucide-react';
import prisma from '@/lib/db';

/**
 * Latest channel uploads from the YouTube sync (SocialCache). Renders nothing
 * until the first successful sync, so the page never shows an empty section.
 */
export default async function LatestVideosSection({ limit = 6 }) {
  let videos = [];
  try {
    const cache = await prisma.socialCache.findUnique({ where: { platform: 'YOUTUBE' } });
    videos = (Array.isArray(cache?.data) ? cache.data : [])
      .filter((item) => item?.id?.videoId && item?.snippet)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to load cached YouTube videos:', error);
  }

  if (videos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 pt-16">
      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase mb-6">
        Latest on <span className="text-red-500">YouTube</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(({ id, snippet }) => {
          const thumb = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
          return (
            <a
              key={id.videoId}
              href={`https://www.youtube.com/watch?v=${id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-black/60 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/60 transition-colors"
            >
              <div className="relative aspect-video bg-black">
                {thumb && (
                  <Image src={thumb} alt={snippet.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </span>
                </div>
              </div>
              <div className="p-4">
                {/* YouTube returns titles HTML-escaped; React escapes again, so decode the common entities */}
                <h3 className="text-sm font-bold text-white line-clamp-2">{decodeEntities(snippet.title)}</h3>
                {snippet.publishedAt && (
                  <p className="text-xs text-white/40 mt-1">{new Date(snippet.publishedAt).toLocaleDateString()}</p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function decodeEntities(text = '') {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
