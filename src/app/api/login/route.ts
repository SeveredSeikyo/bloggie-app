
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPwd = process.env.ADMIN_PASSWORD;

  if (username === adminUser && password === adminPwd) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return NextResponse.json({ success: true, user: { username } });
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
