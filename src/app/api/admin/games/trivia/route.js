import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';
import { nullIfBlank, triviaQuestionSchema } from '@/lib/games/questionSchemas';

export async function GET() {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const questions = await prisma.triviaQuestion.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    return NextResponse.json({ error: 'Failed to fetch trivia questions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const data = triviaQuestionSchema.parse(await request.json());
    const question = await prisma.triviaQuestion.create({
      data: {
        ...data,
        questionSi: nullIfBlank(data.questionSi),
        questionIt: nullIfBlank(data.questionIt),
      }
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error creating trivia question:', error);
    return NextResponse.json({ error: 'Failed to create trivia question' }, { status: 500 });
  }
}
