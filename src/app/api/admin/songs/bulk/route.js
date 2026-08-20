import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, logAuditAction, requireRole } from '@/lib/auth/server-auth';

export async function DELETE(request) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userContext = authResult.user;

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    await prisma.song.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() }
    });

    await logAuditAction(
      userContext.dbUser.id, 
      'BULK_DELETE_SONGS', 
      'Song', 
      'Multiple', 
      { count: ids.length }, 
      request
    );

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error('Error bulk deleting songs:', error);
    return NextResponse.json({ error: 'Failed to bulk delete' }, { status: 500 });
  }
}
