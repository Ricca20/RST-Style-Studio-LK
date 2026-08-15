import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/auth/server-auth';
import { z } from 'zod';

// Zod schema for quotation request validation
const quotationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  phone: z.string().min(5, 'Phone number must be at least 5 characters').max(30),
  email: z.string().email('Invalid email address').optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  genre: z.string().max(100).optional().nullable(),
  selections: z.array(z.any()).optional().default([]),
  attachments: z.array(z.any()).optional().default([]),
  estimatedBudget: z.coerce.number().min(0).default(0),
});

export async function GET(request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    
    const [quotations, totalCount] = await Promise.all([
      prisma.quotationRequest.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.quotationRequest.count({ where: { deletedAt: null } })
    ]);
    
    return NextResponse.json({ data: quotations, totalCount });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }
}

// Simple in-memory rate limiter (resets on serverless cold starts, but catches basic bursts)
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 5; // Max 5 requests per minute

  const requestData = rateLimitMap.get(ip) || { count: 0, startTime: now };
  
  if (now - requestData.startTime > windowMs) {
    requestData.count = 1;
    requestData.startTime = now;
  } else {
    requestData.count++;
  }
  
  rateLimitMap.set(ip, requestData);
  
  // Cleanup old entries randomly to prevent memory leak
  if (rateLimitMap.size > 1000) {
    rateLimitMap.clear();
  }
  
  return requestData.count > maxRequests;
}

export async function POST(request) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const validatedData = quotationSchema.parse(body);

    const quotation = await prisma.quotationRequest.create({
      data: {
        name: validatedData.name.trim(),
        phone: validatedData.phone.trim(),
        email: validatedData.email?.trim() || null,
        description: validatedData.description?.trim() || null,
        genre: validatedData.genre || null,
        selections: validatedData.selections,
        attachments: validatedData.attachments,
        estimatedBudget: validatedData.estimatedBudget,
      }
    });

    // Fetch settings to get the admin alert email in the background (non-blocking)
    prisma.studioSettings.findFirst({ select: { adminAlertEmail: true } })
      .then(settings => {
        if (settings?.adminAlertEmail) {
          // sendEmail helper handles Resend connection
          import('@/lib/services/sendEmail').then(({ sendAdminQuotationAlert }) => {
            sendAdminQuotationAlert(quotation, settings.adminAlertEmail);
          });
        }
      }).catch(err => console.error("Failed to process alert email:", err));

    // Send In-App Notification to Admins
    import('@/lib/services/notification').then(({ broadcastNotification }) => {
      broadcastNotification(['SUPER_ADMIN', 'ADMIN'], {
        title: 'New Quotation Request',
        message: `${validatedData.name} has submitted a new quotation request${validatedData.genre ? ` for ${validatedData.genre}` : ''}.`,
        type: 'QUOTATION',
        link: '/admin/quotations'
      });
    }).catch(err => console.error("Failed to send in-app notification:", err));

    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating quotation:', error);
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 });
  }
}
