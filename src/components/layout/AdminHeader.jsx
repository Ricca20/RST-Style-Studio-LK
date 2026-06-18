import NotificationPanel from '@/components/admin/NotificationPanel';

export default function AdminHeader({ user }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {/* We can add a mobile menu toggle here in the future if needed */}
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationPanel />
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.dbUser?.role?.replace('_', ' ').toLowerCase() || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
