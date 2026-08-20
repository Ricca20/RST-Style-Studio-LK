import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, logAuditAction, requireRole } from '@/lib/auth/server-auth';

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const context = await checkAuth();
    if (!context || context.dbUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemKey, type, price, currency } = body;

    const updated = await prisma.pricingConfig.update({
      where: { id },
      data: { itemKey, type, price, currency }
    });

    await logAuditAction(context.dbUser.id, 'UPDATE_PRICING', 'PricingConfig', updated.id, { price });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating PricingConfig:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const context = await checkAuth();
    if (!context || context.dbUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.pricingConfig.delete({ where: { id } });
    await logAuditAction(context.dbUser.id, 'DELETE_PRICING', 'PricingConfig', id, {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting PricingConfig:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
