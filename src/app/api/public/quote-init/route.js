import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getPublicSettings } from '@/lib/settings';

export async function GET() {
  try {
    const collaborators = await prisma.collaborator.findMany({
      where: { isActive: true },
      orderBy: [{ role: 'asc' }],
      select: {
        id: true,
        role: true,
        price: true,
        profile: {
          select: {
            name: true,
            imageUrl: true
          }
        }
      }
    });

    // Group collaborators by role and format data
    const grouped = {};
    for (const collab of collaborators) {
      if (!grouped[collab.role]) {
        grouped[collab.role] = [];
      }
      grouped[collab.role].push({
        id: collab.id,
        role: collab.role,
        price: collab.price,
        name: collab.profile?.name || 'Unknown Artist',
        imageUrl: collab.profile?.imageUrl || null
      });
    }

    // Fetch studio settings for contact info and quotation rules
    const settings = await getPublicSettings();

    return NextResponse.json({
      collaborators: grouped,
      settings: settings ? {
        whatsapp: settings.whatsapp,
        email: settings.email,
        phone: settings.phone,
        bookingStatus: settings.bookingStatus,
        minimumQuotationBudget: settings.minimumQuotationBudget,
        taxRate: settings.taxRate,
      } : null
    });
  } catch (error) {
    console.error('Error fetching quote init data:', error);
    return NextResponse.json({ collaborators: {}, settings: null });
  }
}
