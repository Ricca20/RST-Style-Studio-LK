import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { GAME_SESSION_COOKIE, GAME_SESSION_MAX_AGE, signGameSession } from '@/lib/games/session';

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

    const expired = player?.verificationExpiresAt && player.verificationExpiresAt < new Date();
    if (!player || !player.verificationToken || player.verificationToken !== token || expired) {
      return NextResponse.json({ error: 'This link is invalid or has expired. Please request a new one from the Music Arcade.' }, { status: 400 });
    }

    // Update player to verified
    await prisma.gamePlayer.update({
      where: { email: email },
      data: {
        verifiedAt: new Date(),
        verificationToken: null, // One-time use
        verificationExpiresAt: null
      }
    });

    // Signed so the player id in the cookie cannot be swapped for another player's
    // Back to the arcade in the player's language (Sinhala is the unprefixed default)
    const arcadePath = player.language && player.language !== 'si' ? `/${player.language}/games` : '/games';
    const response = NextResponse.redirect(new URL(arcadePath, request.url));
    response.cookies.set({
      name: GAME_SESSION_COOKIE,
      value: signGameSession(player.id),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: GAME_SESSION_MAX_AGE,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Failed to verify' }, { status: 500 });
  }
}
