import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import prisma from '@/lib/db'

export async function checkAuth() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null;

  // Fetch the full User record from Prisma to get the Role
  let dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });

  // Auto-provision user if they exist in Supabase but not in Prisma
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        supabaseId: user.id,
        email: user.email,
        name: user?.user_metadata?.full_name || user.email.split('@')[0],
        role: 'ADMIN' // Default to ADMIN for legitimate staff users
      }
    });
  }

  return { ...user, dbUser }; // Merge auth user with db user
}

export async function requireRole(allowedRoles = ['SUPER_ADMIN', 'ADMIN']) {
  const user = await checkAuth();
  if (!user || !user.dbUser) {
    return { authorized: false, error: 'Unauthorized', status: 401 };
  }
  
  if (!allowedRoles.includes(user.dbUser.role)) {
    return { authorized: false, error: 'Forbidden: Insufficient permissions', status: 403 };
  }

  return { authorized: true, user };
}

export async function logAuditAction(userId, action, entity, entityId = null, details = null, request = null) {
  try {
    let ipAddress = null;
    if (request) {
      ipAddress = request.ip || request.headers.get('x-forwarded-for') || null;
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
        ipAddress
      }
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
  }
}
