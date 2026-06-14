'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireRole, logAuditAction } from '@/lib/server-auth';
import { revalidatePath } from 'next/cache';

async function getSupabaseAdmin() {
  // To bypass RLS on storage, we could use the service role key, or if the bucket is public, we can just use the normal client.
  // Assuming the `media` bucket is public for read but requires auth for write. We'll use the authenticated client.
  const cookieStore = await cookies();
  return createServerClient(
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
}

export async function listMediaFiles() {
  const { authorized } = await requireRole(['SUPER_ADMIN', 'ADMIN']);
  if (!authorized) throw new Error('Unauthorized');

  const supabase = await getSupabaseAdmin();
  
  const { data, error } = await supabase.storage
    .from('media')
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('Error fetching media:', error);
    return [];
  }

  // Get public URLs for each file
  const filesWithUrls = data.map(file => {
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(file.name);
    return { ...file, publicUrl };
  });

  return filesWithUrls;
}

export async function deleteMediaFile(fileName) {
  const { authorized, user } = await requireRole(['SUPER_ADMIN', 'ADMIN']);
  if (!authorized) throw new Error('Unauthorized');

  const supabase = await getSupabaseAdmin();
  
  const { error } = await supabase.storage
    .from('media')
    .remove([fileName]);

  if (error) {
    console.error('Error deleting media:', error);
    throw error;
  }

  await logAuditAction(
    user.dbUser.id, 
    'DELETE_MEDIA', 
    'MediaBucket', 
    null, 
    { fileName }
  );

  revalidatePath('/admin/media');
  return { success: true };
}
