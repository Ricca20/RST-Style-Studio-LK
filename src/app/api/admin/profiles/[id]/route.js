import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, requireRole } from '@/lib/auth/server-auth';
import slugify from 'slugify';

export async function PUT(request, { params }) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const { id } = await params;
    const body = await request.json();
    const { name, mainRole, bio, imageUrl, galleryImages, socialLinks, isActive, isApproved } = body;

    const existing = await prisma.profile.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = { mainRole: mainRole !== undefined ? mainRole : null, bio, imageUrl, galleryImages: galleryImages || [], socialLinks, isActive };
    if (isApproved !== undefined) data.isApproved = isApproved;
    if (name) {
      data.name = name;
      if (name !== existing.name) {
        data.slug = slugify(name, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 1000);
      }
    }

    const profile = await prisma.profile.update({
      where: { id },
      data
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const { id } = await params;
    await prisma.profile.update({ where: { id }, data: { deletedAt: new Date() } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}
