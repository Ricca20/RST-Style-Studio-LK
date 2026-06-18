import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkAuth, logAuditAction } from '@/lib/server-auth';

// Helper to init supabase admin client
async function getSupabaseAdmin() {
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

export async function GET(request) {
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await getSupabaseAdmin();
    const { data, error } = await supabase.storage.from('media').list('', {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.error('Supabase storage list error:', error);
      return NextResponse.json({ error: 'Failed to fetch media list' }, { status: 500 });
    }

    // Filter out potential folder artifacts or empty files
    const files = data.filter(f => f.name !== '.emptyFolderPlaceholder' && f.id);

    // Attach public URLs
    const filesWithUrls = files.map(file => {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(file.name);
      return { ...file, publicUrl };
    });

    return NextResponse.json(filesWithUrls);
  } catch (error) {
    console.error('Error in media GET:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let fileNames = [];
    const file = searchParams.get('file');
    
    if (file) {
      fileNames.push(file);
    } else {
      try {
        const body = await request.json();
        if (body.files && Array.isArray(body.files)) {
          fileNames = body.files;
        }
      } catch (e) {
        // no body
      }
    }

    if (fileNames.length === 0) {
      return NextResponse.json({ error: 'File names required' }, { status: 400 });
    }

    const supabase = await getSupabaseAdmin();
    const { error } = await supabase.storage.from('media').remove(fileNames);

    if (error) {
      console.error('Supabase storage delete error:', error);
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }

    await logAuditAction(
      userContext.dbUser.id,
      'DELETE_MEDIA',
      'MediaBucket',
      fileNames.join(', '),
      { status: 'Success', count: fileNames.length },
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
