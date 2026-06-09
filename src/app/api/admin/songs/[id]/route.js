import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  const { id } = await params;
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      titleEn, titleSi,
      description,
      genres, releaseYear, isFeatured,
      coverImage, youtubeUrl, spotifyUrl, facebookUrl,
      images,
      credits
    } = body;

    if (!titleEn || !titleSi) {
      return NextResponse.json({ error: 'Missing required titles' }, { status: 400 });
    }

    // We use a transaction to safely delete old credits and insert the new ones
    const updatedSong = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing contributions for this song
      await tx.contribution.deleteMany({
        where: { songId: id }
      });

      // 2. Prepare the new contributions array
      const contributions = credits && credits.length > 0 
        ? {
            create: credits.map(c => ({
              name: c.name,
              role: c.role,
              imageUrl: c.imageUrl || null
            }))
          }
        : undefined;

      // 3. Update the song
      return await tx.song.update({
        where: { id },
        data: {
          titleEn, titleSi,
          description,
          genres: genres || [], releaseYear, isFeatured,
          coverImage, youtubeUrl, spotifyUrl, facebookUrl,
          images: images || [],
          contributions
        }
      });
    });

    return NextResponse.json(updatedSong);
  } catch (error) {
    console.error('Error updating song:', error);
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
  }
}
