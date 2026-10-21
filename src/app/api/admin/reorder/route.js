import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logAuditAction, requireRole } from '@/lib/auth/server-auth';
import { ADMIN_ROLES, CONTENT_ROLES } from '@/lib/auth/admin-access';

export async function PUT(request) {
  try {
    const { type, items } = await request.json(); // type: 'SERVICE' | 'PROFILE', items: [{ id, sortOrder }]

    // Editors manage profiles; service ordering stays with admins
    const authResult = await requireRole(type === 'PROFILE' ? CONTENT_ROLES : ADMIN_ROLES);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userContext = authResult.user;

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
