import LegalPage from '@/components/public/LegalPage';
import { getPublicSettings } from '@/lib/settings';

export const metadata = {
  title: 'Privacy Policy | RST Style Studio LK',
  description: 'What personal information RST Style Studio LK collects, why, and how to contact us about it.',
};

export default async function PrivacyPage() {
  const settings = await getPublicSettings();
  const studio = settings?.name || 'RST Style Studio LK';
  const email = settings?.email;

  return (
    <LegalPage title="Privacy Policy" updated="21 October 2026">
      <section>
        <p>
          This policy explains what information {studio} (&ldquo;we&rdquo;) collects through this website, why we collect it,
          and the choices you have. We only collect what we need to respond to you and to run the site.
        </p>
      </section>

      <section>
        <h2>Information you give us</h2>
        <ul>
          <li><strong>Quotation requests:</strong> your name, phone number, optional email, genre, project description, the team you selected, links you attach, and the estimated budget.</li>
          <li><strong>Contact form:</strong> your name, artist or band name, email, phone number, the service you are interested in, a preferred date, and your notes.</li>
          <li><strong>Music Arcade:</strong> your email address, a username and your preferred language. Your username and scores appear on public leaderboards; your email never does.</li>
          <li><strong>Artist portal:</strong> if you sign in as a contributor, your account email, the profile details you enter, and any song credits you claim.</li>
          <li><strong>WhatsApp:</strong> if you choose to message us on WhatsApp, that conversation is handled by WhatsApp under its own privacy policy.</li>
        </ul>
      </section>

      <section>
        <h2>Information collected automatically</h2>
        <ul>
          <li><strong>IP address:</strong> used to limit how often forms can be submitted and, for the Music Arcade, stored with each score to prevent abuse of the monthly prize leaderboards.</li>
          <li><strong>Cookies:</strong> a sign-in cookie for the Music Arcade (kept for up to 30 days) and, for staff and contributors, a sign-in cookie for their account. These are needed for the site to work.</li>
          <li><strong>Analytics:</strong> if enabled, Google Analytics and the Meta (Facebook) Pixel collect information about how the site is used, such as pages visited and device type.</li>
        </ul>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To reply to your quotation request or inquiry and to plan your project.</li>
          <li>To run the Music Arcade, including verifying your email, showing leaderboards and contacting monthly winners about their prize.</li>
          <li>To keep the site secure and prevent spam and cheating.</li>
          <li>To understand how the site is used so we can improve it.</li>
        </ul>
        <p className="mt-3">We do not sell your personal information.</p>
      </section>

      <section>
        <h2>Services that process data for us</h2>
        <p>
          We rely on Supabase (database, file storage and sign-in), Vercel (website hosting), Resend and Gmail (sending email),
          and, where enabled, Google Analytics and Meta. Embedded YouTube and Spotify players are provided by those services
          and may set their own cookies when you play them.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <ul>
          <li>Quotation requests are kept while they are useful for your project and our records.</li>
          <li>Game scores older than three months may be deleted; leaderboard winners are kept as a record of prizes awarded.</li>
          <li>Rate-limiting records are deleted after one day.</li>
        </ul>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can ask us to see, correct or delete the personal information we hold about you
          {email ? <> by emailing <a href={`mailto:${email}`}>{email}</a></> : ' by contacting us through the Contact page'}.
          You can also block or delete cookies in your browser settings, though the Music Arcade and sign-in will not work without them.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>If we change this policy, we will update the date at the top of this page.</p>
      </section>
    </LegalPage>
  );
}
