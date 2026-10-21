import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';
import { nullIfBlank, triviaQuestionSchema } from '@/lib/games/questionSchemas';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const data = triviaQuestionSchema.parse(await request.json());
    const question = await prisma.triviaQuestion.update({
      where: { id },
      data: {
        ...data,
        questionSi: nullIfBlank(data.questionSi),
        questionIt: nullIfBlank(data.questionIt),
      }
    });

    return NextResponse.json(question);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error updating trivia question:', error);
    return NextResponse.json({ error: 'Failed to update trivia question' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    await prisma.triviaQuestion.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trivia question:', error);
    return NextResponse.json({ error: 'Failed to delete trivia question' }, { status: 500 });
  }
}
