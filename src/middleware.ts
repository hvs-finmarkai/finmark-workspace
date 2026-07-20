import { auth } from './lib/auth';
import { NextResponse } from 'next/server';

const publicPaths = ['/', '/login', '/admin/login', '/api/auth', '/_next', '/favicon.ico'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const isAdminRoute = pathname.startsWith('/admin');
    const loginUrl = new URL(isAdminRoute ? '/admin/login' : '/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/admin')) {
    const role = req.auth.user?.role;

    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      const adminLoginUrl = new URL('/admin/login', req.nextUrl.origin);
      adminLoginUrl.searchParams.set('error', 'AccessDenied');
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
