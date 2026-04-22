import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { basePrice: 'asc' } });
    const pricingConfigs = await prisma.pricingConfig.findMany({ where: { isActive: true } });
    
    return NextResponse.json({ services, pricingConfigs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize quote data' }, { status: 500 });
  }
}
  
