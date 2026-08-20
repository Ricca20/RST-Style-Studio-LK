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
    const { itemKey, type, price, currency } = body;

    const newConfig = await prisma.pricingConfig.create({
      data: { itemKey, type, price, currency: currency || 'LKR' }
    });

    await logAuditAction(context.dbUser.id, 'CREATE_PRICING', 'PricingConfig', newConfig.id, { itemKey, price });

    return NextResponse.json(newConfig);
  } catch (error) {
    console.error('Error creating PricingConfig:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
