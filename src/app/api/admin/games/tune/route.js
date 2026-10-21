import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';
import { nullIfBlank, tuneClipSchema } from '@/lib/games/questionSchemas';

export async function GET() {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const clips = await prisma.tuneClip.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(clips);
  } catch (error) {
    console.error('Error fetching tune clips:', error);
    return NextResponse.json({ error: 'Failed to fetch tune clips' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const data = tuneClipSchema.parse(await request.json());
    const clip = await prisma.tuneClip.create({
      data: {
        ...data,
        titleSi: nullIfBlank(data.titleSi),
        titleIt: nullIfBlank(data.titleIt),
      }
    });

    return NextResponse.json(clip, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error creating tune clip:', error);
    return NextResponse.json({ error: 'Failed to create tune clip' }, { status: 500 });
  }
}
