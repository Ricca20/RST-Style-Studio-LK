import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';

export async function PUT(request, { params }) {
  try {
    const authResult = await requireRole(['ADMIN', 'SUPER_ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const id = params.id;
    const body = await request.json();
    
    const mention = await prisma.honoraryMention.update({
      where: { id },
      data: {
        name: body.name,
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        awardedAt: body.awardedAt ? new Date(body.awardedAt) : undefined,
      }
    });

    return NextResponse.json(mention);
  } catch (error) {
    console.error('Error updating honorary mention:', error);
    return NextResponse.json({ error: 'Failed to update honorary mention' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requireRole(['ADMIN', 'SUPER_ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const id = params.id;
    
    // Soft delete
    const mention = await prisma.honoraryMention.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json(mention);
  } catch (error) {
    console.error('Error deleting honorary mention:', error);
    return NextResponse.json({ error: 'Failed to delete honorary mention' }, { status: 500 });
  }
}
