import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { protectedPaths } from '@/lib/constant/index';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getSession();
  const url = new URL(request.url);

  // Check for an authenticated session
  if (data.session) {
    // Redirect authenticated users from /auth to /home
    if (url.pathname === '/auth') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return response;
  } else {
    // Redirect unauthenticated users trying to access protected paths
    if (protectedPaths.includes(url.pathname)) {
      return NextResponse.redirect(new URL(`/auth?next=${url.pathname}`, request.url));
    }
  }

  return response;
}


// Configure middleware to match all paths except those for static assets, images, and favicon
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
