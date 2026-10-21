import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, logAuditAction, requireRole } from '@/lib/auth/server-auth';

export async function GET() {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const context = authResult.user;

    const configs = await prisma.pricingConfig.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(configs);
  } catch (error) {
    console.error('Error fetching PricingConfigs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const context = await checkAuth();
    if (!context || context.dbUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemKey, type, currency } = body;
    const price = Number(body.price);

    if (typeof itemKey !== 'string' || !itemKey.trim() || !['SERVICE', 'OPTION'].includes(type) || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: 'A key, a type (SERVICE or OPTION) and a non-negative price are required' }, { status: 400 });
    }

    const newConfig = await prisma.pricingConfig.create({
      data: { itemKey: itemKey.trim(), type, price, currency: currency || 'LKR' }
    });

    await logAuditAction(context.dbUser.id, 'CREATE_PRICING', 'PricingConfig', newConfig.id, { itemKey, price });

    return NextResponse.json(newConfig);
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A pricing item with this key already exists' }, { status: 400 });
    }
    console.error('Error creating PricingConfig:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
