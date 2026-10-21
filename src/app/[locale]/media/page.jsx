import MediaGalleryClient from '@/components/public/MediaGalleryClient';
import LatestVideosSection from '@/components/public/LatestVideosSection';
import PageHero from '@/components/music/PageHero';

export const metadata = {
  title: 'Media | RST Style Studio LK',
  description: 'Photos from recording sessions, the studio and productions at RST Style Studio LK.',
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        label="Contact sheet"
        title={['Behind', 'the glass.']}
        intro="Sessions, gear and the people in the room. Tap a frame to see it full size."
        seed={97}
      />
      <section className="px-5 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <MediaGalleryClient />
        </div>
      </section>
      <LatestVideosSection />
    </>
  );
}
