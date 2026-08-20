import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, requireRole } from '@/lib/auth/server-auth';
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isFeatured = searchParams.get('isFeatured') === 'true' ? true : undefined;

    // Always filter out soft-deleted and draft songs for public access
    const where = {
      deletedAt: null,
      isDraft: false,
      ...(isFeatured !== undefined && { isFeatured }),
    };

    const [songs, totalCount] = await Promise.all([
      prisma.song.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contributions: true
        }
      }),
      prisma.song.count({ where }),
    ]);

    return NextResponse.json({ data: songs, totalCount, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const user = authResult.user;

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
