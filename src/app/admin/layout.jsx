import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { Toaster } from 'sonner';
import { headers } from 'next/headers';
import { checkAuth } from '@/lib/auth/server-auth';
import { STAFF_ROLES, canAccessAdminPath } from '@/lib/auth/admin-access';

export default async function AdminLayout({ children }) {
  const user = await checkAuth();

  if (!user || !user.dbUser) {
    redirect('/en/login');
  }

  // Any signed-in Supabase user is auto-provisioned as CONTRIBUTOR, so being
  // logged in is not enough — only staff roles may enter the dashboard.
  if (!STAFF_ROLES.includes(user.dbUser.role)) {
    redirect('/portal');
  }

  // Per-page access (e.g. editors can't open Quotations by typing the URL).
  // x-pathname is set by src/proxy.ts for every /admin request.
  const pathname = (await headers()).get('x-pathname') || '/admin';
  if (!canAccessAdminPath(pathname, user.dbUser.role)) {
    redirect('/admin');
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <AdminSidebar user={user} role={user.dbUser.role} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
