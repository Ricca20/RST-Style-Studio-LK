import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireRole } from '@/lib/auth/server-auth';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;

    const body = await request.json();
    const {
      projectType,
      titleEn, titleSi, slug,
      description,
      genres, releaseYear, isFeatured,
      coverImage, youtubeUrl, spotifyUrl, facebookUrl,
      isDraft,
      credits
    } = body;

    if (!titleEn || !titleSi || !slug) {
      return NextResponse.json({ error: 'Missing required titles' }, { status: 400 });
    }

    // Prepare nested create for contributions
    const contributions = credits && credits.length > 0 
      ? {
          create: credits.map(c => ({
            name: c.name,
            role: c.role,
            imageUrl: c.imageUrl || null
          }))
        }
      : undefined;

    const song = await prisma.song.create({
      data: {
        projectType: projectType || 'SONG',
        titleEn, titleSi, slug,
        description,
        genres: genres || [], releaseYear, isFeatured, isDraft,
        coverImage, youtubeUrl, spotifyUrl, facebookUrl,
        contributions
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error('Error creating song:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: `A song with this title already exists. Please choose a different title.` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
  }
}
