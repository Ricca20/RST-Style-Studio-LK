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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined;
    const isFeatured = searchParams.get('isFeatured') === 'true' ? true : undefined;

    const songs = await prisma.song.findMany({
      where: isFeatured !== undefined ? { isFeatured } : undefined,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        contributions: true
      }
    });
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = songSchema.parse(body);
    
    const slug = validatedData.slug || createSlug(validatedData.titleEn);

    const song = await prisma.song.create({
      data: {
        titleEn: validatedData.titleEn,
        titleSi: validatedData.titleSi,
        slug,
        description: validatedData.description,
        coverImage: validatedData.coverImage,
        youtubeUrl: validatedData.youtubeUrl,
        spotifyUrl: validatedData.spotifyUrl,
        facebookUrl: validatedData.facebookUrl,
        genres: validatedData.genres || [],
        releaseYear: validatedData.releaseYear,
        isFeatured: validatedData.isFeatured,
        contributions: validatedData.contributions ? {
          create: validatedData.contributions.map(c => ({
            name: c.name,
            role: c.role,
            imageUrl: c.imageUrl
          }))
        } : undefined
      }
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    console.error('Error creating song:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
  }
}
