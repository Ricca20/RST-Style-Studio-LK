import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, logAuditAction } from '@/lib/server-auth';

export async function PUT(request) {
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, items } = await request.json(); // type: 'SERVICE' | 'PROFILE', items: [{ id, sortOrder }]

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
    }

    const modelMap = {
      SERVICE: prisma.service,
      PROFILE: prisma.profile
    };

    const model = modelMap[type];
    if (!model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    // Prisma doesn't support bulk updates with different values efficiently out of the box
    // so we use a transaction
    await prisma.$transaction(
      items.map((item) =>
        model.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder }
        })
      )
    );

    await logAuditAction(
      userContext.dbUser.id,
      `REORDER_${type}`,
      type,
      'Multiple',
      { count: items.length },
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering items:', error);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}
