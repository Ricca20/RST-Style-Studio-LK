import Image from 'next/image';
import { Play } from 'lucide-react';
import prisma from '@/lib/db';
import SectionLabel from '@/components/music/SectionLabel';

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
    <section className="px-5 md:px-10 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionLabel>On YouTube</SectionLabel>
            <h2 className="display text-[clamp(3rem,7vw,6rem)] mt-5">Latest videos.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map(({ id, snippet }) => {
            const thumb = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
            return (
              <a
                key={id.videoId}
                href={`https://www.youtube.com/watch?v=${id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-video rounded-[1.4rem] overflow-hidden bg-ink">
                  {thumb && (
                    <Image src={thumb} alt={snippet.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  )}
                  <span className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-lime text-ink flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </div>
                {/* YouTube returns titles HTML-escaped; React escapes again, so decode the common entities */}
                <h3 className="font-display font-bold text-lg leading-snug mt-4 line-clamp-2 group-hover:underline decoration-lime decoration-4 underline-offset-4">{decodeEntities(snippet.title)}</h3>
                {snippet.publishedAt && <p className="text-sm text-smoke mt-1">{new Date(snippet.publishedAt).toLocaleDateString()}</p>}
              </a>
            );
          })}
        </div>
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
