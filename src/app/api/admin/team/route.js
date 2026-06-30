import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';

export async function GET(request) {
  try {
    // Only SUPER_ADMIN and ADMIN can view team members
    const authContext = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authContext.authorized) {
      return NextResponse.json({ error: authContext.error }, { status: authContext.status });
    }

    const team = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Only SUPER_ADMIN can modify roles
    const authContext = await requireRole(['SUPER_ADMIN']);
    if (!authContext.authorized) {
      return NextResponse.json({ error: 'Only Super Admins can change roles' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
    }

    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Prevent removing the last SUPER_ADMIN
    if (role !== 'SUPER_ADMIN') {
      const superAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
      const targetUser = await prisma.user.findUnique({ where: { id: userId } });
      if (superAdmins <= 1 && targetUser?.role === 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Cannot demote the last Super Admin' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating team role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
