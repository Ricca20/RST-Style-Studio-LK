import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth/server-auth';
import prisma from '@/lib/db';

export async function POST(req) {
  try {
    const user = await checkAuth();
    if (!user || !user.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { songId, role, proof } = body;

    if (typeof songId !== 'string' || typeof role !== 'string' || !songId || !role.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (role.length > 100 || (proof && (typeof proof !== 'string' || proof.length > 2000))) {
      return NextResponse.json({ error: 'Role or proof is too long' }, { status: 400 });
    }

    const song = await prisma.song.findFirst({ where: { id: songId, deletedAt: null }, select: { id: true } });
    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    // Ensure the user has a profile first
    const profile = await prisma.profile.findUnique({
      where: { userId: user.dbUser.id }
    });

    if (!profile) {
      return NextResponse.json({ error: 'You must create a profile before claiming a song' }, { status: 400 });
    }

    const existingClaim = await prisma.claimRequest.findFirst({
      where: { userId: user.dbUser.id, songId, role: role.trim(), status: { in: ['PENDING', 'APPROVED'] } }
    });
    if (existingClaim) {
      return NextResponse.json({ error: 'You have already claimed this role on this song' }, { status: 409 });
    }

    // Create the claim
    const claim = await prisma.claimRequest.create({
      data: {
        userId: user.dbUser.id,
        songId,
        role: role.trim(),
        proof: proof || null,
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
