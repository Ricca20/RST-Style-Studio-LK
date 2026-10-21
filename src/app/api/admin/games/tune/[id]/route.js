import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';
import { nullIfBlank, tuneClipSchema } from '@/lib/games/questionSchemas';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const data = tuneClipSchema.parse(await request.json());
    const clip = await prisma.tuneClip.update({
      where: { id },
      data: {
        ...data,
        titleSi: nullIfBlank(data.titleSi),
        titleIt: nullIfBlank(data.titleIt),
      }
    });

    return NextResponse.json(clip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error updating tune clip:', error);
    return NextResponse.json({ error: 'Failed to update tune clip' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    await prisma.tuneClip.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tune clip:', error);
    return NextResponse.json({ error: 'Failed to delete tune clip' }, { status: 500 });
  }
}
