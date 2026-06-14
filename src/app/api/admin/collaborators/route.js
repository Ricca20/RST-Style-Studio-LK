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

export async function GET() {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { profileId, role, price, isActive } = body;

    if (!profileId || !role || price == null) {
      return NextResponse.json({ error: 'Profile, role, and price are required' }, { status: 400 });
    }

    const collaborator = await prisma.collaborator.create({
      data: {
        profileId,
        role,
        price: parseFloat(price),
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
