import { getPublicSettings, safeExternalUrl } from '@/lib/settings';
import ContactClient from '@/components/public/ContactClient';
import PageHero from '@/components/music/PageHero';

export async function generateMetadata() {
  return {
    title: 'Contact | RST Style Studio LK',
    description: 'Book a session or get in touch with RST Style Studio LK.',
  };
}

export default async function ContactPage() {
  const settings = await getPublicSettings();

  // Only http(s) links are passed to the client
  const socials = [
    ['Instagram', settings?.instagramUrl],
    ['YouTube', settings?.youtubeUrl],
    ['Facebook', settings?.facebookUrl],
    ['Spotify', settings?.spotifyUrl],
    ['TikTok', settings?.tiktokUrl],
    ['X', settings?.xUrl],
  ].map(([label, url]) => ({ label, url: safeExternalUrl(url) })).filter((s) => s.url);

  return (
    <>
      <PageHero
        label="Get in touch"
        title={["Let's make", 'some noise.']}
        intro="Booking a session, planning a release or just have a question? Send a request and we'll get back to you, or reach us directly."
        seed={71}
      />
      <section className="px-5 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <ContactClient settings={settings} socials={socials} />
        </div>
      </section>
    </>
  );
}
