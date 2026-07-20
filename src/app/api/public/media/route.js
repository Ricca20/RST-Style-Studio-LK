import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {}
      },
    }
  );
}

export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.storage.from('media').list('', {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error || !data) {
      console.error('Supabase storage list error:', error);
      return NextResponse.json([]);
    }

    // Filter valid image files and get their public URLs
    const files = data.filter(f => 
      f.name !== '.emptyFolderPlaceholder' && 
      f.id && 
      f.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)
    );

    const imageUrls = files.map(file => {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(file.name);
      return publicUrl;
    });

    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error('Error in public media GET:', error);
    return NextResponse.json([]);
  }
}
