import { NextResponse } from 'next/server';
import { guardPlay } from '@/lib/games/guard';
import { createRoundToken } from '@/lib/games/rounds';
import { THEORY_QUESTIONS } from '@/lib/games/theoryQuestions';
import { getClientIp } from '@/lib/rate-limit';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get('track'); // 'western' or 'eastern'

    if (!track || !THEORY_QUESTIONS[track]) {
      return NextResponse.json({ error: 'Valid track parameter is required' }, { status: 400 });
    }

    const guard = await guardPlay('THEORY', { ip: getClientIp(request) });
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    // Never send which option is correct; answers are scored server-side.
    const questions = THEORY_QUESTIONS[track].map(q => ({
      ...q,
      options: q.options.map(o => ({ id: o.id, textEn: o.textEn }))
    }));

    const token = createRoundToken({ playerId: guard.player.id, gameType: 'THEORY', ids: questions.map(q => q.id), track });
    return NextResponse.json({ questions, token });
  } catch (error) {
    console.error('Error fetching theory questions:', error);
    return NextResponse.json({ error: 'Failed to fetch theory questions' }, { status: 500 });
  }
}
