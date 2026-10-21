import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logAuditAction, requireRole } from '@/lib/auth/server-auth';

export async function POST(request) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userContext = authResult.user;

    // Signing out with the user's own session and scope 'global' revokes every
    // refresh token for this account (all devices), and clears this browser's cookies.
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          },
        },
      }
    );

    // Log before signing out, while the session is still valid.
    await logAuditAction(
      userContext.dbUser.id,
      'REVOKE_ALL_SESSIONS',
      'User',
      userContext.dbUser.id,
      { status: 'Success' },
      request
    );

    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.error('Supabase global sign out error:', error);
      return NextResponse.json({ error: 'Failed to revoke sessions' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revoking sessions:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
