import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireRole } from '@/lib/auth/server-auth';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
        },
      }
    );

    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const questions = await prisma.triviaQuestion.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trivia questions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
        },
      }
    );

    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const body = await request.json();
    const { difficulty, questionEn, questionSi, options, correctOption, isActive } = body;

    if (!questionEn || !options || !correctOption) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const question = await prisma.triviaQuestion.create({
      data: {
        difficulty,
        questionEn,
        questionSi: questionSi || null,
        options,
        correctOption,
        isActive
      }
    });

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create trivia question' }, { status: 500 });
  }
}
