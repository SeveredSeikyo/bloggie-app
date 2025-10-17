
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function verifyJWT(token: string, secret: Uint8Array): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;
  
  let isAuthenticated = false;
  if (token && jwtSecret) {
    const secret = new TextEncoder().encode(jwtSecret);
    isAuthenticated = await verifyJWT(token, secret);
  }

  const isApiRoute = req.nextUrl.pathname.startsWith('/api/');

  // Protect data-modifying API routes
  if (isApiRoute && ['POST', 'PATCH', 'DELETE'].includes(req.method)) {
     if (req.nextUrl.pathname.startsWith('/api/login')) {
      return NextResponse.next();
    }
    if (!isAuthenticated) {
      return new NextResponse('Authentication required.', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/blogs/:path*',
    '/api/blogs',
    '/api/mark-posted',
    '/api/user',
    '/api/logout',
  ],
};
