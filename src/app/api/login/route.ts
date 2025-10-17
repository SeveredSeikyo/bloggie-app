
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPwd = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not set');
    return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
  }

  if (username === adminUser && password === adminPwd) {
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '7d' });
    return NextResponse.json({ success: true, token, user: { username } });
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
