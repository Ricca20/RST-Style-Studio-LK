import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const collaborators = await prisma.collaborator.findMany({
      where: { isActive: true },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        role: true,
        price: true,
        imageUrl: true
      }
    });

    // Group collaborators by role
    const grouped = {};
    for (const collab of collaborators) {
      if (!grouped[collab.role]) {
        grouped[collab.role] = [];
      }
      grouped[collab.role].push(collab);
    }

    // Fetch studio settings for contact info
    const settings = await prisma.studioSettings.findFirst();

    return NextResponse.json({
      collaborators: grouped,
      settings: settings ? {
        whatsapp: settings.whatsapp,
        email: settings.email,
        phone: settings.phone
      } : null
    });
  } catch (error) {
    console.error('Error fetching quote init data:', error);
    return NextResponse.json({ collaborators: {}, settings: null });
  }
}
