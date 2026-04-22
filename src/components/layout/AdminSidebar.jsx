'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Music, 
  Users, 
  FileVideo, 
  MessageSquare,
  Settings,
  LogOut,
  Award,
  Share2
} from 'lucide-react';

export default function AdminSidebar({ user }) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Songs', href: '/admin/songs', icon: Music },
    { name: 'Contributors', href: '/admin/contributors', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: FileVideo },
    { name: 'Quotations', href: '/admin/quotations', icon: MessageSquare },
    { name: 'Honorary Mentions', href: '/admin/honorary', icon: Award },
    { name: 'Social Sync', href: '/admin/social', icon: Share2 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    // Standard server logout hook trigger or redirect to auth logic endpoint
    window.location.href = '/api/auth/logout'; // Will be defined later
  };

  return (
    <div className="w-64 bg-gray-900 h-full flex flex-col text-gray-300 shadow-xl z-10 shrink-0">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Studio Admin</h2>
          <p className="text-xs text-gray-400 mt-1 truncate" title={user?.email}>{user?.email?.split('@')[0] || 'User'}</p>
        </div>
      </div>
      <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1.5">
          {links.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5 opacity-80" />
          Log Out
        </button>
      </div>
    </div>
  );
}
  
