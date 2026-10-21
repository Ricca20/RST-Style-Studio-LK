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
  Shield,
  Image as ImageIcon,
  Trash2,
  Gamepad2,
  DollarSign,
  HandCoins,
  CloudSync,
  Award,
  Wrench,
  Quote
} from 'lucide-react';
import { useState } from 'react';
import { canAccessAdminPath } from '@/lib/auth/admin-access';

const NAV_LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Profiles', href: '/admin/profiles', icon: Users },
  { name: 'Collaborators', href: '/admin/collaborators', icon: Users },
  { name: 'Claims', href: '/admin/claims', icon: HandCoins },
  { name: 'Songs', href: '/admin/songs', icon: Music },
  { name: 'Music Videos', href: '/admin/videos', icon: FileVideo },
  { name: 'Services', href: '/admin/services', icon: Wrench },
  { name: 'Quotations', href: '/admin/quotations', icon: MessageSquare },
  { name: 'Clients CRM', href: '/admin/clients', icon: Users },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Quote },
  { name: 'Honorary Mentions', href: '/admin/honorary-mentions', icon: Award },
  { name: 'Social Sync', href: '/admin/social-sync', icon: CloudSync },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: Shield },
  { name: 'Pricing Config', href: '/admin/pricing', icon: DollarSign },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Trash Bin', href: '/admin/trash', icon: Trash2 },
  { name: 'Arcade Games', href: '/admin/games', icon: Gamepad2 },
];

export default function AdminSidebar({ user, role = 'ADMIN' }) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Which links a role sees comes from the shared access map in lib/auth/admin-access.js
  const links = NAV_LINKS.filter((link) => canAccessAdminPath(link.href, role));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/en/login';
    }
  };

  return (
    <div className="w-64 bg-gray-900 h-full flex flex-col text-gray-300 shadow-xl z-10 shrink-0">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Studio Admin</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-gray-400 truncate" title={user?.email}>{user?.email?.split('@')[0] || 'User'}</p>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{role.replace('_', ' ')}</span>
          </div>
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
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5 opacity-80" />
          {isLoggingOut ? 'Logging out…' : 'Log Out'}
        </button>
      </div>
    </div>
  );
}
  
