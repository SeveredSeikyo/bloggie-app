
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  username: string;
  iat: number;
  exp: number;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not set');
    return NextResponse.json({ user: null });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ user: null });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    return NextResponse.json({ user: { username: decoded.username } });
  } catch (error) {
    // Invalid token (expired, malformed, etc.)
    return NextResponse.json({ user: null });
  }
}
