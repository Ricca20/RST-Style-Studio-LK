import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/server-auth';
import prisma from '@/lib/db';

export async function POST(req) {
  try {
    const user = await checkAuth();
    if (!user || !user.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { songId, role, proof } = body;

    if (!songId || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure the user has a profile first
    const profile = await prisma.profile.findUnique({
      where: { userId: user.dbUser.id }
    });

    if (!profile) {
      return NextResponse.json({ error: 'You must create a profile before claiming a song' }, { status: 400 });
    }

    // Create the claim
    const claim = await prisma.claimRequest.create({
      data: {
        userId: user.dbUser.id,
        songId,
        role,
        proof,
        status: 'PENDING'
      },
      include: {
        song: { select: { titleEn: true } }
      }
    });

    return NextResponse.json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
