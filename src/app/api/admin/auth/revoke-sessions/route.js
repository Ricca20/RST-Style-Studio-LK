import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkAuth, logAuditAction } from '@/lib/server-auth';

export async function POST(request) {
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    
    // We must use the service role key to revoke all sessions
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
       return NextResponse.json({ error: 'Service role key not configured. Cannot revoke global sessions.' }, { status: 500 });
    }

    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {}
        },
      }
    );

    // Sign out from all devices (global sign out)
    const { error } = await supabaseAdmin.auth.admin.signOut(userContext.dbUser.id, 'global');

    if (error) {
      console.error('Supabase global sign out error:', error);
      return NextResponse.json({ error: 'Failed to revoke sessions' }, { status: 500 });
    }

    await logAuditAction(
      userContext.dbUser.id, 
      'REVOKE_ALL_SESSIONS', 
      'User', 
      userContext.dbUser.id, 
      { status: 'Success' }, 
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revoking sessions:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
