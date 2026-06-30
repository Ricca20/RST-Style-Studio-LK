import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { Toaster } from 'sonner';
import { checkAuth } from '@/lib/auth/server-auth';

export default async function AdminLayout({ children }) {
  const user = await checkAuth();

  if (!user || !user.dbUser) {
    redirect('/en/login');
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
