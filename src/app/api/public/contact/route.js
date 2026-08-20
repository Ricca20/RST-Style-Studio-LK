import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendContactEmail } from '@/lib/services/sendEmail';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  artistName: z.string().max(200).optional().nullable(),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(30),
  service: z.string().max(100).optional().default('Recording & Mixing'),
  preferredDate: z.string().max(100).optional().nullable(),
  notes: z.string().max(5000).optional().nullable()
});

export async function POST(request) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const rawBody = await request.json();
    let body;
    try {
      body = contactSchema.parse(rawBody);
    } catch (validationError) {
      return NextResponse.json({ error: 'Invalid submission data', details: validationError.errors }, { status: 400 });
    }

    const {
      name,
      artistName,
      email,
      phone,
      service,
      preferredDate,
      notes
    } = body;

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
