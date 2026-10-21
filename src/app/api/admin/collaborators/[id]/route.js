import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';
import { QUOTE_ROLE_KEYS } from '@/lib/quoteRoles';

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const { profileId, role, isActive } = body;
    const price = Number(body.price);

    if (!profileId || !QUOTE_ROLE_KEYS.includes(role) || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: 'A profile, a role from the list, and a non-negative price are required' }, { status: 400 });
    }

    const collaborator = await prisma.collaborator.update({
      where: { id },
      data: {
        profileId,
        role,
        price,
        isActive: isActive ?? true
      },
      include: { profile: true }
    });

    return NextResponse.json(collaborator);
  } catch (error) {
    console.error('Error updating collaborator:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This person already exists with this role.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update collaborator' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await prisma.collaborator.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collaborator:', error);
    return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 });
  }
}
