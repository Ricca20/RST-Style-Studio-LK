import LegalPage from '@/components/public/LegalPage';
import { getPublicSettings } from '@/lib/settings';

export const metadata = {
  title: 'Terms of Service | RST Style Studio LK',
  description: 'The terms for using the RST Style Studio LK website, quotation tool and Music Arcade.',
};

export default async function TermsPage() {
  const settings = await getPublicSettings();
  const studio = settings?.name || 'RST Style Studio LK';
  const email = settings?.email;

  return (
    <LegalPage title="Terms of Service" updated="21 October 2026">
      <section>
        <p>
          These terms apply to your use of the {studio} website. By using the site you agree to them.
          If you do not agree, please do not use the site.
        </p>
      </section>

      <section>
        <h2>Quotations and estimates</h2>
        <ul>
          <li>Prices shown in the quotation tool are estimates only. The range shown (plus or minus 15%, including any tax shown) is a guide, not an offer.</li>
          <li>A project is only confirmed once we have agreed the scope, price and schedule with you directly.</li>
          <li>Collaborator availability and prices can change. We will confirm the final team and price before work starts.</li>
        </ul>
      </section>

      <section>
        <h2>Music Arcade and prizes</h2>
        <ul>
          <li>Each player may register one account and play each game once per calendar month.</li>
          <li>Scores that appear to come from cheating, automated play or multiple accounts may be removed, and the player disqualified.</li>
          <li>Prizes are described on the leaderboard page. Winners are confirmed by the studio and contacted by email. Prizes have no cash value and cannot be transferred unless we agree otherwise.</li>
          <li>We may change, pause or end the games or prizes at any time.</li>
        </ul>
      </section>

      <section>
        <h2>Contributor profiles and credits</h2>
        <ul>
          <li>Artist profiles and credit claims are reviewed by the studio before they appear on the site.</li>
          <li>You must only claim credits for work you actually did. We may reject or remove claims and profiles at our discretion.</li>
        </ul>
      </section>

      <section>
        <h2>Content</h2>
        <p>
          The music, videos, images and text on this site belong to {studio} or the artists and rights holders credited.
          You may not copy, redistribute or use them commercially without permission.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>
          Do not misuse the site: for example, by sending spam through the forms, trying to access areas you are not
          authorised to, interfering with the site&apos;s operation, or submitting false information.
        </p>
      </section>

      <section>
        <h2>Liability</h2>
        <p>
          The site is provided as is. To the extent permitted by law, we are not liable for losses arising from use of the
          site, from estimates shown in the quotation tool, or from temporary unavailability of the site.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of Sri Lanka.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms?{' '}
          {email ? <a href={`mailto:${email}`}>{email}</a> : 'Please use the Contact page.'}
        </p>
      </section>
    </LegalPage>
  );
}
