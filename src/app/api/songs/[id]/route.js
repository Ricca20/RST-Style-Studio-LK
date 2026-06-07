import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';
import { z } from 'zod';
import { createSlug } from '@/lib/slugify';

const songUpdateSchema = z.object({
  titleEn: z.string().min(1).optional(),
  titleSi: z.string().min(1).optional(),
  titleIt: z.string().optional(),
  slug: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  spotifyUrl: z.string().optional().nullable(),
  genre: z.string().optional().nullable(),
  releaseYear: z.number().int().optional().nullable(),
  isFeatured: z.boolean().optional(),
  contributions: z.array(z.object({
    contributorId: z.string(),
    role: z.string()
  })).optional()
});

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        contributions: {
          include: {
            contributor: true
          }
        }
      }
    });

    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 });
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
    const validatedData = songUpdateSchema.parse(body);

    const dataToUpdate = { ...validatedData };
    if (dataToUpdate.titleEn && !dataToUpdate.slug) {
      dataToUpdate.slug = createSlug(dataToUpdate.titleEn);
    }

    // Handle nested contributions if provided
    let contributionsUpdate;
    if (dataToUpdate.contributions) {
      const contributions = dataToUpdate.contributions;
      delete dataToUpdate.contributions;

      contributionsUpdate = {
        deleteMany: {}, // Delete existing relations
        create: contributions.map(c => ({
          contributorId: c.contributorId,
          role: c.role
        }))
      };
    }

    const song = await prisma.song.update({
      where: { id },
      data: {
        ...dataToUpdate,
        ...(contributionsUpdate && { contributions: contributionsUpdate })
      },
      include: {
        contributions: true
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.song.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}
