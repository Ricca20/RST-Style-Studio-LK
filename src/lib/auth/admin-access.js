// Single source of truth for who can open which admin page. Used by the admin
// sidebar (to show links), the admin layout (to block direct URL access), and
// mirrored by the role lists the API routes pass to requireRole().
// Kept free of server-only imports so client components can use it.

export const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER'];
export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];
// Content editing (songs, videos, profiles, media) is open to editors.
export const CONTENT_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

export const ADMIN_ROUTES = [
  { href: '/admin', roles: STAFF_ROLES },
  { href: '/admin/notifications', roles: STAFF_ROLES },
  { href: '/admin/profiles', roles: CONTENT_ROLES },
  { href: '/admin/songs', roles: CONTENT_ROLES },
  { href: '/admin/videos', roles: CONTENT_ROLES },
  { href: '/admin/media', roles: CONTENT_ROLES },
  { href: '/admin/collaborators', roles: ADMIN_ROLES },
  { href: '/admin/claims', roles: ADMIN_ROLES },
  { href: '/admin/quotations', roles: ADMIN_ROLES },
  { href: '/admin/clients', roles: ADMIN_ROLES },
  { href: '/admin/honorary-mentions', roles: ADMIN_ROLES },
  { href: '/admin/testimonials', roles: ADMIN_ROLES },
  { href: '/admin/social-sync', roles: ADMIN_ROLES },
  { href: '/admin/trash', roles: ADMIN_ROLES },
  { href: '/admin/games', roles: ADMIN_ROLES },
  { href: '/admin/services', roles: ADMIN_ROLES },
  { href: '/admin/audit-logs', roles: ['SUPER_ADMIN'] },
  { href: '/admin/pricing', roles: ['SUPER_ADMIN'] },
  { href: '/admin/settings', roles: ['SUPER_ADMIN'] },
];

/** Roles allowed on an admin path, using the most specific matching route. */
export function rolesForAdminPath(pathname) {
  const match = ADMIN_ROUTES
    // '/admin' (the dashboard) matches only itself, not every admin page
    .filter(({ href }) => pathname === href || (href !== '/admin' && pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  // Unknown admin pages default to admins only.
  return match ? match.roles : ADMIN_ROLES;
}

export function canAccessAdminPath(pathname, role) {
  return rolesForAdminPath(pathname).includes(role);
}
