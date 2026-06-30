import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/server-auth';
import prisma from '@/lib/db';

export async function GET(req) {
  try {
    const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const claims = await prisma.claimRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        song: true
      }
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
