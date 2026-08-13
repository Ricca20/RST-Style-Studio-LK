import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/auth/server-auth';
import { z } from 'zod';
import { createSlug } from '@/lib/utils/slugify';

const songSchema = z.object({
  titleEn: z.string().min(1),
  titleSi: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  spotifyUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  genres: z.array(z.string()).optional(),
  releaseYear: z.number().int().optional().nullable(),
  isFeatured: z.boolean().default(false),
  contributions: z.array(z.object({
    name: z.string(),
    role: z.string(),
    imageUrl: z.string().optional().nullable()
  })).optional()
});

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        contributions: true
      }
    });
    if (!song) return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = songSchema.parse(body);

    const song = await prisma.$transaction(async (tx) => {
      if (validatedData.contributions) {
        await tx.contribution.deleteMany({ where: { songId: id } });
      }

      return await tx.song.update({
        where: { id },
        data: {
          titleEn: validatedData.titleEn,
          titleSi: validatedData.titleSi,
          slug: validatedData.slug || undefined,
          description: validatedData.description,
          coverImage: validatedData.coverImage,
          youtubeUrl: validatedData.youtubeUrl,
          spotifyUrl: validatedData.spotifyUrl,
          facebookUrl: validatedData.facebookUrl,
          genres: validatedData.genres || [],
          releaseYear: validatedData.releaseYear,
          isFeatured: validatedData.isFeatured,
          ...(validatedData.contributions && {
            contributions: {
              create: validatedData.contributions.map(c => ({
                name: c.name,
                role: c.role,
                imageUrl: c.imageUrl
              }))
            }
          })
        }
      });
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error('Error updating song:', error);
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
    // Soft delete — set deletedAt timestamp instead of permanent deletion
    await prisma.song.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}
