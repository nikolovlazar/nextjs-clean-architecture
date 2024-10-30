import { NextResponse, type NextRequest } from 'next/server';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';

export async function middleware(request: NextRequest) {
  const isAuthPath =
    request.nextUrl.pathname === '/sign-in' ||
    request.nextUrl.pathname === '/sign-up';

  if (!isAuthPath) {
    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    try {
      const authenticationService = getInjection('IAuthenticationService');
      await authenticationService.validateSession(sessionId);
    } catch (err) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
