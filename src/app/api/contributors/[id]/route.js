import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';
import { z } from 'zod';

const contributorUpdateSchema = z.object({
  nameEn: z.string().min(1).optional(),
  nameSi: z.string().min(1).optional(),
  nameIt: z.string().optional(),
  image: z.string().optional().nullable(),
  bioEn: z.string().optional().nullable(),
  bioSi: z.string().optional().nullable(),
  bioIt: z.string().optional().nullable(),
});

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const contributor = await prisma.contributor.findUnique({
      where: { id },
      include: {
        contributions: {
          include: {
            song: true
          }
        }
      }
    });

    if (!contributor) {
      return NextResponse.json({ error: 'Contributor not found' }, { status: 404 });
    }

    return NextResponse.json(contributor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contributor' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = contributorUpdateSchema.parse(body);

    const contributor = await prisma.contributor.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(contributor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update contributor' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.contributor.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contributor' }, { status: 500 });
  }
}
