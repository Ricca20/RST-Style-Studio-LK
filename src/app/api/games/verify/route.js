import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json({ error: 'Missing token or email' }, { status: 400 });
    }

    const player = await prisma.gamePlayer.findUnique({
      where: { email: email }
    });

    if (!player || player.verificationToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Update player to verified
    await prisma.gamePlayer.update({
      where: { email: email },
      data: {
        verifiedAt: new Date(),
        verificationToken: null // One-time use
      }
    });

    // Set a simple game auth cookie
    // In production, you would sign a JWT here. For this lightweight implementation,
    // we set a secure cookie with the player ID that we'll read in other game API routes.
    const response = NextResponse.redirect(new URL('/games', request.url));
    
    // Setting cookie (30 days expiration)
    response.cookies.set({
      name: 'game_session',
      value: player.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, 
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Failed to verify' }, { status: 500 });
  }
}
