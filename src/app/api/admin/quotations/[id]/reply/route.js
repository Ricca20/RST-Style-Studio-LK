import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Resend } from 'resend';
import { requireRole } from '@/lib/auth/server-auth';

async function checkAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { method, message, subject } = body;

    // Fetch the quotation
    const quotation = await prisma.quotationRequest.findUnique({ where: { id } });
    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    if (method === 'email') {
      if (!quotation.email) {
        return NextResponse.json({ error: 'This user did not provide an email address.' }, { status: 400 });
      }

      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        return NextResponse.json({ error: 'Email service is not configured. Please add RESEND_API_KEY to .env' }, { status: 500 });
      }

      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      await resend.emails.send({
        from: `RST Style Studio <${fromEmail}>`,
        to: [quotation.email],
        subject: subject || `Re: Your Quotation Request - RST Style Studio`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">RST Style Studio</h1>
              <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0;">Quotation Response</p>
            </div>
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="color: #374151; font-size: 16px;">Hi <strong>${quotation.name}</strong>,</p>
              <div style="color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #9ca3af; font-size: 13px;">This email was sent from RST Style Studio regarding your quotation request.</p>
            </div>
          </div>
        `
      });

      // Update status to REVIEWED
      await prisma.quotationRequest.update({
        where: { id },
        data: { status: 'REVIEWED' }
      });

      return NextResponse.json({ success: true, method: 'email' });
    }

    if (method === 'whatsapp') {
      if (!quotation.phone) {
        return NextResponse.json({ error: 'This user did not provide a phone number.' }, { status: 400 });
      }

      // Update status to REVIEWED
      await prisma.quotationRequest.update({
        where: { id },
        data: { status: 'REVIEWED' }
      });

      // Build WhatsApp URL
      const phone = quotation.phone.replace(/\D/g, '');
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      return NextResponse.json({ success: true, method: 'whatsapp', whatsappUrl: waUrl });
    }

    return NextResponse.json({ error: 'Invalid method. Use "email" or "whatsapp".' }, { status: 400 });
  } catch (error) {
    console.error('Error replying to quotation:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
