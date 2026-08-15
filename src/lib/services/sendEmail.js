import { Resend } from 'resend';

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
        <p><strong>Name:</strong> ${quotation.name}</p>
        <p><strong>Phone:</strong> ${quotation.phone}</p>
        <p><strong>Email:</strong> ${quotation.email || 'N/A'}</p>
        <p><strong>Genre:</strong> ${quotation.genre || 'N/A'}</p>
        <p><strong>Estimated Budget:</strong> LKR ${quotation.estimatedBudget}</p>
        <p><strong>Description:</strong></p>
        <p>${quotation.description || 'N/A'}</p>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/quotations">View in Dashboard</a>
      `,
    });
  } catch (error) {
    console.error('Error sending email alert:', error);
  }
}

export async function sendContactEmail(inquiry, toEmail) {
  if (!resend || !toEmail) {
    console.warn('RESEND_API_KEY or target email not configured. Contact email alert logged.');
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New Studio Inquiry: ${inquiry.name} [${inquiry.service}]`,
      html: `
        <h2>New Studio Contact Form Inquiry</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Artist/Band:</strong> ${inquiry.artistName || 'N/A'}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone / WhatsApp:</strong> ${inquiry.phone}</p>
        <p><strong>Service Requested:</strong> ${inquiry.service}</p>
        <p><strong>Preferred Session Date:</strong> ${inquiry.preferredDate || 'Flexible'}</p>
        <p><strong>Notes / Specification:</strong></p>
        <p>${inquiry.notes || 'N/A'}</p>
      `,
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
  }
}
