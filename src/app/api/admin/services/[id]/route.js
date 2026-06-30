import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, logAuditAction } from '@/lib/auth/server-auth';

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = await prisma.service.findUnique({ where: { id }, select: { nameEn: true } });

    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    if (service) {
      await logAuditAction(
        userContext.dbUser.id, 
        'DELETE_SERVICE', 
        'Service', 
        id, 
        { name: service.nameEn }, 
        request
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
