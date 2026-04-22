import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

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

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin') || routing.locales.some(locale => path.startsWith(`/${locale}/admin`));

  if (isAdminRoute && !user) {
    const locale = request.nextUrl.pathname.split('/')[1];
    const targetLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${targetLocale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(si|en|it)/:path*',
    '/admin/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
  
