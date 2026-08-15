import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/auth/server-auth';
import { Resend } from 'resend';

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, sendEmail, sendWhatsApp } = body;

    if (!['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const quotation = await prisma.quotationRequest.findUnique({ where: { id } });
    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    // Update in database
    const updatedQuote = await prisma.quotationRequest.update({
      where: { id },
      data: { status }
    });

    // Handle automated email
    if (sendEmail && quotation.email) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        
        let subject = `Update on your Quotation Request - RST Style Studio`;
        let messageHtml = '';

        if (status === 'ACCEPTED') {
          subject = `Great News! Your Quotation has been ACCEPTED - RST Style Studio`;
          messageHtml = `
            <p>Hi <strong>${quotation.name}</strong>,</p>
            <p>We are thrilled to inform you that your quotation request for <strong>${quotation.genre || 'your project'}</strong> has been <strong>ACCEPTED</strong>.</p>
            <p>Our team will reach out to you shortly to discuss the next steps and get started on bringing your vision to life.</p>
            <p>If you have any immediate questions, feel free to reply directly to this email.</p>
          `;
        } else if (status === 'REJECTED') {
          subject = `Update on your Quotation Request - RST Style Studio`;
          messageHtml = `
            <p>Hi <strong>${quotation.name}</strong>,</p>
            <p>Thank you for reaching out to us with your project request.</p>
            <p>After careful review, we regret to inform you that we are unable to accept your project at this time. This is typically due to schedule constraints or budget mismatches.</p>
            <p>We appreciate your interest in RST Style Studio and wish you the best with your project.</p>
          `;
        } else if (status === 'REVIEWED') {
          messageHtml = `
            <p>Hi <strong>${quotation.name}</strong>,</p>
            <p>Just a quick update: Our team is currently reviewing your quotation request.</p>
            <p>We will be in touch with you shortly with a personalized response.</p>
          `;
        }

        if (messageHtml) {
          await resend.emails.send({
            from: `RST Style Studio <${fromEmail}>`,
            to: [quotation.email],
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">RST Style Studio</h1>
                </div>
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                  ${messageHtml}
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                  <p style="color: #9ca3af; font-size: 13px;">RST Style Studio Team</p>
                </div>
              </div>
            `
          });
        }
      }
    }

    let whatsappUrl = null;
    if (sendWhatsApp && quotation.phone) {
      let waMessage = '';
      if (status === 'ACCEPTED') waMessage = `Hi ${quotation.name},\n\nGreat news! Your quotation request has been ACCEPTED. We will reach out shortly to discuss the next steps.`;
      if (status === 'REJECTED') waMessage = `Hi ${quotation.name},\n\nThank you for reaching out. After careful review, we regret to inform you that we are unable to accept your project at this time.`;
      if (status === 'REVIEWED') waMessage = `Hi ${quotation.name},\n\nJust a quick update: Our team is currently reviewing your quotation request. We'll be in touch shortly!`;
      
      if (waMessage) {
        const phoneDigits = quotation.phone.replace(/\D/g, '');
        whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(waMessage)}`;
      }
    }

    return NextResponse.json({ ...updatedQuote, whatsappUrl });
  } catch (error) {
    console.error('Error updating quotation status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
