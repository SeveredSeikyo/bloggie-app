import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // We only want to protect routes that modify data
  if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE') {
    const basicAuth = req.headers.get('authorization');
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      // The value is base64 encoded
      const [user, pwd] = atob(authValue).split(':');

      const adminUser = process.env.ADMIN_USERNAME;
      const adminPwd = process.env.ADMIN_PASSWORD;
      
      if (user === adminUser && pwd === adminPwd) {
        return NextResponse.next();
      }
    }
    
    // If we are here, authentication failed or was not provided
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  // Allow GET requests to pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/blogs/:path*', '/api/mark-posted'],
};
