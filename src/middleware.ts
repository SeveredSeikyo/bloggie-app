import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.has('auth_token');
  const isLoginPage = req.nextUrl.pathname.startsWith('/login');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/');

  if (isApiRoute) {
    // Protect data-modifying API routes
    if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE') {
      if (!isAuthenticated) {
        return new NextResponse('Authentication required.', { status: 401 });
      }
    }
    // Allow GET requests and login/logout API calls to pass through
    return NextResponse.next();
  }

  // If user is on the login page
  if (isLoginPage) {
    if (isAuthenticated) {
      // Redirect to home if already logged in
      return NextResponse.redirect(new URL('/', req.url));
    }
    // Allow access to login page if not logged in
    return NextResponse.next();
  }

  // For all other pages
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow access if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/login
     * - api/logout
     * - api/blogs/posted
     * - api/blogs/draft
     * - api/blogs$ (to allow GET on /api/blogs but not POST)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/login|api/logout|api/blogs/posted|api/blogs/draft|uploads/).*)',
    // This matcher needs to be more specific to only protect POST/PATCH/DELETE
    // But since the logic is handled inside the middleware, we can be a bit broader
    // and then check the method.
    '/api/blogs/:path*',
    '/api/mark-posted',
  ],
};
