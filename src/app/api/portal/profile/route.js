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
    const { name, bio, mainRole } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate a slug based on name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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
        slug: slug + '-' + Math.floor(Math.random() * 1000), // ensure uniqueness
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
