import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, requireRole } from '@/lib/auth/server-auth';
import slugify from 'slugify';

export async function GET() {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const profiles = await prisma.profile.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

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
        isApproved: true, // Auto-approve since admin created it
      }
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
