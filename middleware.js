// TOPIC: Middleware and authentication - Route protection with role-based access control
import { NextResponse } from 'next/server';
import { verifySession } from './lib/auth';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from './lib/constants';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  let session = null;
  if (token) {
    session = await verifySession(token);
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/events', '/login', '/register', '/playground'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Routes that require authentication (user or organiser)
  const protectedRoutes = ['/my-registrations', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Routes that require organiser role
  const organiserRoutes = ['/organiser'];
  const isOrganiserRoute = organiserRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing organiser routes
  if (isOrganiserRoute) {
    if (!session) {
      // Not logged in - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== 'organiser') {
      // Logged in but not an organiser - redirect to home with error
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'organiser-only');
      return NextResponse.redirect(homeUrl);
    }
  }

  // If accessing protected routes (user or organiser)
  if (isProtectedRoute) {
    if (!session) {
      // Not logged in - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If accessing login/register while already logged in
  if ((pathname === '/login' || pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Add session info to response headers for debugging (optional)
  const response = NextResponse.next();
  if (session) {
    response.headers.set('x-user-role', session.role);
    response.headers.set('x-user-id', session.userId);
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|).*)',
  ],
};
