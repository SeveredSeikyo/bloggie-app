import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    const basicAuth = req.headers.get('authorization');
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const adminUser = process.env.ADMIN_USERNAME;
      const adminPwd = process.env.ADMIN_PASSWORD;
      
      if (user === adminUser && pwd === adminPwd) {
        return NextResponse.next();
      }
    }
    
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/blogs/:path*', '/api/mark-posted'],
};
