import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';
import { z } from 'zod';
import { createSlug } from '@/lib/slugify';

const projectUpdateSchema = z.object({
  titleEn: z.string().min(1).optional(),
  titleSi: z.string().min(1).optional(),
  titleIt: z.string().optional(),
  slug: z.string().optional(),
  descriptionEn: z.string().optional().nullable(),
  descriptionSi: z.string().optional().nullable(),
  descriptionIt: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  type: z.enum(['AUDIO', 'VIDEO', 'BRANDING', 'OTHER']).optional(),
  isFeatured: z.boolean().optional(),
  clientName: z.string().optional().nullable(),
  completionDate: z.string().transform((str) => new Date(str)).optional().nullable(),
  images: z.array(z.string()).optional()
});

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
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
    const validatedData = projectUpdateSchema.parse(body);

    const dataToUpdate = { ...validatedData };
    if (dataToUpdate.titleEn && !dataToUpdate.slug) {
      dataToUpdate.slug = createSlug(dataToUpdate.titleEn);
    }
    
    if (dataToUpdate.images) {
      dataToUpdate.images = JSON.stringify(dataToUpdate.images);
    }

    const project = await prisma.project.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.project.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
