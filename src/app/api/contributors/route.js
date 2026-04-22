import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';
import { z } from 'zod';

const contributorSchema = z.object({
  nameEn: z.string().min(1),
  nameSi: z.string().min(1),
  nameIt: z.string().optional(),
  image: z.string().optional().nullable(),
  bioEn: z.string().optional().nullable(),
  bioSi: z.string().optional().nullable(),
  bioIt: z.string().optional().nullable(),
});

export async function GET(request) {
  try {
    const contributors = await prisma.contributor.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contributors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contributors' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = contributorSchema.parse(body);

    const contributor = await prisma.contributor.create({
      data: validatedData
    });

    return NextResponse.json(contributor, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create contributor' }, { status: 500 });
  }
}
