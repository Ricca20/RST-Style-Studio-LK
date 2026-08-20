import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireRole } from '@/lib/auth/server-auth';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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

    const question = await prisma.triviaQuestion.update({
      where: { id },
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
    return NextResponse.json({ error: 'Failed to update trivia question' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
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

    await prisma.triviaQuestion.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete trivia question' }, { status: 500 });
  }
}
