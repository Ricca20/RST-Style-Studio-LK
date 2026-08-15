import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendContactEmail } from '@/lib/services/sendEmail';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      artistName,
      email,
      phone,
      service = 'Recording & Mixing',
      preferredDate,
      notes
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required.' },
        { status: 400 }
      );
    }

    // Fetch studio settings for target email address
    const settings = await prisma.studioSettings.findFirst({
      select: {
        adminAlertEmail: true,
        email: true,
      }
    });
    const targetEmail = settings?.adminAlertEmail || settings?.email || 'hello@rststylestudiolk.com';

    // Send email alert
    await sendContactEmail(
      {
        name,
        artistName,
        email,
        phone,
        service,
        preferredDate,
        notes,
      },
      targetEmail
    );

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been transmitted successfully.'
    });
  } catch (error) {
    console.error('Error processing contact inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry. Please try again or contact via WhatsApp.' },
      { status: 500 }
    );
  }
}
