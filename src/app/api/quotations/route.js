import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';

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
    const { name, phone, email, description, genre, selections, attachments, estimatedBudget } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const quotation = await prisma.quotationRequest.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        description: description?.trim() || null,
        genre: genre || null,
        selections: selections || [],
        attachments: attachments || [],
        estimatedBudget: parseFloat(estimatedBudget) || 0
      }
    });

    // Fetch settings to get the admin alert email in the background (non-blocking)
    prisma.studioSettings.findFirst({ select: { adminAlertEmail: true } })
      .then(settings => {
        if (settings?.adminAlertEmail) {
          // sendEmail helper handles Resend connection
          import('@/lib/sendEmail').then(({ sendAdminQuotationAlert }) => {
            sendAdminQuotationAlert(quotation, settings.adminAlertEmail);
          });
        }
      }).catch(err => console.error("Failed to process alert email:", err));

    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 });
  }
}
