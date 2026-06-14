import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';
import slugify from 'slugify';

export async function GET() {
  try {
    const user = await checkAuth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profiles = await prisma.profile.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await checkAuth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, mainRole, bio, imageUrl, galleryImages, socialLinks, isActive } = body;

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const slug = slugify(name, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 1000);

    const profile = await prisma.profile.create({
      data: {
        name,
        slug,
        mainRole: mainRole || null,
        bio: bio || null,
        imageUrl: imageUrl || null,
        galleryImages: galleryImages || [],
        socialLinks: socialLinks || null,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
