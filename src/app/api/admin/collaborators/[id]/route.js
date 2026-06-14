import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function checkAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { profileId, role, price, isActive } = body;

    if (!profileId || !role || price == null) {
      return NextResponse.json({ error: 'Profile, role, and price are required' }, { status: 400 });
    }

    const collaborator = await prisma.collaborator.update({
      where: { id },
      data: {
        profileId,
        role,
        price: parseFloat(price),
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
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.collaborator.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collaborator:', error);
    return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 });
  }
}
