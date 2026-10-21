import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';
import { QUOTE_ROLE_KEYS } from '@/lib/quoteRoles';

export async function GET() {
  try {
    const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const collaborators = await prisma.collaborator.findMany({
      include: { profile: true },
      orderBy: [{ role: 'asc' }]
    });
    return NextResponse.json(collaborators);
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return NextResponse.json({ error: 'Failed to fetch collaborators' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const { profileId, role, isActive } = body;
    const price = Number(body.price);

    if (!profileId || !QUOTE_ROLE_KEYS.includes(role) || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: 'A profile, a role from the list, and a non-negative price are required' }, { status: 400 });
    }

    const collaborator = await prisma.collaborator.create({
      data: {
        profileId,
        role,
        price,
        isActive: isActive ?? true
      },
      include: { profile: true }
    });

    return NextResponse.json(collaborator, { status: 201 });
  } catch (error) {
    console.error('Error creating collaborator:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This person already exists with this role.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create collaborator' }, { status: 500 });
  }
}
