import { Resend } from 'resend';

// Only initialize if the key exists to avoid crashing if it's not configured yet
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendAdminQuotationAlert(quotation, toEmail) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. Email alert skipped.');
    return;
  }
  if (!toEmail) return;

  try {
    await resend.emails.send({
      from: 'RST Style Studio <noreply@rststylestudiolk.com>', // Replace with your verified domain
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
