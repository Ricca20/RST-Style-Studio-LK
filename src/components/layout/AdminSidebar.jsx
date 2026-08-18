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
  Award
} from 'lucide-react';

export default function AdminSidebar({ user, role = 'ADMIN' }) {
  const pathname = usePathname();

  const allLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER'] },
    { name: 'Profiles', href: '/admin/profiles', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { name: 'Collaborators', href: '/admin/collaborators', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Claims', href: '/admin/claims', icon: HandCoins, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Songs', href: '/admin/songs', icon: Music, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { name: 'Music Videos', href: '/admin/videos', icon: FileVideo, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { name: 'Quotations', href: '/admin/quotations', icon: MessageSquare, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Clients CRM', href: '/admin/clients', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Honorary Mentions', href: '/admin/honorary-mentions', icon: Award, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Social Sync', href: '/admin/social-sync', icon: CloudSync, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: Shield, roles: ['SUPER_ADMIN'] },
    { name: 'Pricing Config', href: '/admin/pricing', icon: DollarSign, roles: ['SUPER_ADMIN'] },
    { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Trash Bin', href: '/admin/trash', icon: Trash2, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Arcade Games', href: '/admin/games', icon: Gamepad2, roles: ['SUPER_ADMIN', 'ADMIN'] },
  ];

  const links = allLinks.filter(link => link.roles.includes(role));

  const handleLogout = async () => {
    // Standard server logout hook trigger or redirect to auth logic endpoint
    window.location.href = '/api/auth/logout'; // Will be defined later
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
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5 opacity-80" />
          Log Out
        </button>
      </div>
    </div>
  );
}
  
