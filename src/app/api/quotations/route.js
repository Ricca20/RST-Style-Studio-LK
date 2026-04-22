import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';
import { z } from 'zod';

const quotationSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().nullable(),
  serviceType: z.string().min(1),
  isSinhala: z.boolean().default(false),
  needsMelody: z.boolean().default(false),
  needsInstruments: z.boolean().default(false),
  needsMusicVideo: z.boolean().default(false),
  estimatedBudget: z.number().min(0)
});

export async function GET(request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quotations = await prisma.quotationRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(quotations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = quotationSchema.parse(body);

    const quotation = await prisma.quotationRequest.create({
      data: validatedData
    });

    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 });
  }
}
