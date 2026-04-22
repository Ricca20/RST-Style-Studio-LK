import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';
import { z } from 'zod';
import { createSlug } from '@/lib/slugify';

const projectSchema = z.object({
  titleEn: z.string().min(1),
  titleSi: z.string().min(1),
  titleIt: z.string().optional(),
  slug: z.string().optional(),
  descriptionEn: z.string().optional().nullable(),
  descriptionSi: z.string().optional().nullable(),
  descriptionIt: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  type: z.enum(['AUDIO', 'VIDEO', 'BRANDING', 'OTHER']).default('AUDIO'),
  isFeatured: z.boolean().default(false),
  clientName: z.string().optional().nullable(),
  completionDate: z.string().transform((str) => new Date(str)).optional(),
  images: z.array(z.string()).optional()
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined;
    const isFeatured = searchParams.get('isFeatured') === 'true' ? true : undefined;

    const projects = await prisma.project.findMany({
      where: isFeatured !== undefined ? { isFeatured } : undefined,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);
    
    const slug = validatedData.slug || createSlug(validatedData.titleEn);

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        slug,
        images: validatedData.images ? JSON.stringify(validatedData.images) : "[]"
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
