import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';

export async function GET(request) {
  try {
    const mentions = await prisma.honoraryMention.findMany({
      where: { deletedAt: null },
      orderBy: { awardedAt: 'desc' }
    });
    return NextResponse.json(mentions);
  } catch (error) {
    console.error('Error fetching honorary mentions:', error);
    return NextResponse.json({ error: 'Failed to fetch honorary mentions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authResult = await requireRole(['ADMIN', 'SUPER_ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    
    const mention = await prisma.honoraryMention.create({
      data: {
        name: body.name,
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        awardedAt: body.awardedAt ? new Date(body.awardedAt) : undefined,
      }
    });

    return NextResponse.json(mention);
  } catch (error) {
    console.error('Error creating honorary mention:', error);
    return NextResponse.json({ error: 'Failed to create honorary mention' }, { status: 500 });
  }
}
