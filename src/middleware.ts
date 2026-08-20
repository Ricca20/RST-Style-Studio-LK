import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Do not run next-intl middleware for admin/api routes to prevent it from prepending locales
  let response;
  if (path.startsWith('/admin') || path.startsWith('/api/')) {
    response = NextResponse.next();
  } else {
    response = intlMiddleware(request);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAdminPage = path.startsWith('/admin') || routing.locales.some(locale => path.startsWith(`/${locale}/admin`));
  const isAdminApi = path.startsWith('/api/admin');

  if (isAdminPage && !user) {
    const locale = request.nextUrl.pathname.split('/')[1];
    const targetLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${targetLocale}/login`, request.url));
  }

  if (isAdminApi && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(si|en|it)/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
