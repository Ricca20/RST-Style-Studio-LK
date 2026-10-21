import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth/server-auth';
import prisma from '@/lib/db';
import { createSlug } from '@/lib/utils/slugify';

export async function POST(req) {
  try {
    const user = await checkAuth();
    if (!user || !user.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, mainRole } = body;

    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (name.length > 120 || (bio && bio.length > 5000) || (mainRole && mainRole.length > 100)) {
      return NextResponse.json({ error: 'One or more fields are too long' }, { status: 400 });
    }

    // Slugs must be unique; append a short random suffix (8 hex chars) on create
    const slug = `${createSlug(name) || 'artist'}-${crypto.randomUUID().slice(0, 8)}`;

    // Upsert the profile
    const profile = await prisma.profile.upsert({
      where: { userId: user.dbUser.id },
      update: {
        name,
        bio,
        mainRole,
        // If they update their profile, you could optionally set isApproved to false again to require re-review
        // isApproved: false
      },
      create: {
        userId: user.dbUser.id,
        name,
        slug,
        bio,
        mainRole,
        isApproved: false, // Must be approved by admin
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error in portal profile update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
