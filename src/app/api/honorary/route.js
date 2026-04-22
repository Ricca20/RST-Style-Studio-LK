import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';
import { z } from 'zod';

const honorarySchema = z.object({
  titleEn: z.string().min(1),
  titleSi: z.string().min(1),
  titleIt: z.string().optional(),
  descriptionEn: z.string().optional().nullable(),
  descriptionSi: z.string().optional().nullable(),
  descriptionIt: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  givenBy: z.string().optional().nullable(),
  date: z.string().transform((str) => new Date(str)).optional()
});

export async function GET(request) {
  try {
    const mentions = await prisma.honoraryMention.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(mentions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch honorary mentions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = honorarySchema.parse(body);

    const mention = await prisma.honoraryMention.create({
      data: validatedData
    });

    return NextResponse.json(mention, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create honorary mention' }, { status: 500 });
  }
}
