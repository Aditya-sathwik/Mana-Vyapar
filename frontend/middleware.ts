import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('role')?.value;

  // 1. Merchant Route Protection
  if (pathname.startsWith('/merchant')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (role !== 'Merchant') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // 2. Admin Route Protection
  if (pathname.startsWith('/admin')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (role !== 'Admin' && role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // 3. Auth Page Protection (Direct away from login if already logged in)
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    if (accessToken && role) {
      if (role === 'Merchant') {
        return NextResponse.redirect(new URL('/merchant/dashboard', request.url));
      }
      if (role === 'Admin' || role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/merchant/:path*',
    '/auth/:path*',
  ],
};
