import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from "next/headers";
import { getSession } from './auth/index';

export async function middleware(req: NextRequest) {
  const session = await getSession(); // Get the session cookie

  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to login, static files, and API routes
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // Redirect to login if sessionid cookie is missing
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access if sessionid exists
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/mesadeentrada/:path*', '/another-protected-route'], // Add your protected routes
};
