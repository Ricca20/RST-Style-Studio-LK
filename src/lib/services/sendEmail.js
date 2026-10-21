import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils/escapeHtml';

// Only initialize if the key exists to avoid crashing if it's not configured yet
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'RST Style Studio <noreply@rststylestudiolk.com>';

export async function sendAdminQuotationAlert(quotation, toEmail) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. Email alert skipped.');
    return;
  }
  if (!toEmail) return;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New Quotation Request: ${quotation.name}`,
      html: `
        <h2>New Quotation Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(quotation.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(quotation.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(quotation.email || 'N/A')}</p>
        <p><strong>Genre:</strong> ${escapeHtml(quotation.genre || 'N/A')}</p>
        <p><strong>Estimated Budget:</strong> LKR ${escapeHtml(quotation.estimatedBudget)}</p>
        <p><strong>Description:</strong></p>
        <p>${escapeHtml(quotation.description || 'N/A')}</p>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/quotations">View in Dashboard</a>
      `,
    });
  } catch (error) {
    console.error('Error sending email alert:', error);
  }
}

/** @returns {Promise<boolean>} true only if Resend accepted the email. */
export async function sendContactEmail(inquiry, toEmail) {
  if (!resend || !toEmail) {
    console.warn('RESEND_API_KEY or target email not configured. Contact email skipped.');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New Studio Inquiry: ${inquiry.name} [${inquiry.service}]`,
      html: `
        <h2>New Studio Contact Form Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
        <p><strong>Artist/Band:</strong> ${escapeHtml(inquiry.artistName || 'N/A')}</p>
        <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
        <p><strong>Phone / WhatsApp:</strong> ${escapeHtml(inquiry.phone)}</p>
        <p><strong>Service Requested:</strong> ${escapeHtml(inquiry.service)}</p>
        <p><strong>Preferred Session Date:</strong> ${escapeHtml(inquiry.preferredDate || 'Flexible')}</p>
        <p><strong>Notes / Specification:</strong></p>
        <p>${escapeHtml(inquiry.notes || 'N/A')}</p>
      `,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}

const GAME_NAMES = {
  TRIVIA: 'SL Music IQ (Trivia)',
  PITCH_MATCH: 'Pitch Match',
  THEORY: 'Theory Master',
  NAME_THAT_TUNE: 'Name That Tune',
  RHYTHM_TAP: 'Rhythm Tap',
};

/**
 * Notifies a Music Arcade player that they won a monthly leaderboard.
 * @returns {Promise<boolean>} true only if the email was accepted by Resend.
 */
export async function sendLeaderboardWinnerEmail({ email, username, gameType, month, year, score, prizeDetails }) {
  if (!resend || !email) {
    console.warn('RESEND_API_KEY not configured or player has no email. Winner email skipped.');
    return false;
  }

  const monthName = new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' });
  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `You won ${GAME_NAMES[gameType] || gameType} for ${monthName} ${year}! 🏆`,
      html: `
        <h2>Congratulations, ${escapeHtml(username)}!</h2>
        <p>You finished first in <strong>${escapeHtml(GAME_NAMES[gameType] || gameType)}</strong> for ${monthName} ${year} with a score of <strong>${escapeHtml(score ?? '')}</strong>.</p>
        ${prizeDetails ? `<p><strong>Your prize:</strong> ${escapeHtml(prizeDetails)}</p>` : ''}
        <p>Reply to this email and our team will arrange your prize.</p>
        <p>— RST Style Studio LK</p>
      `,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending winner email:', error);
    return false;
  }
}
