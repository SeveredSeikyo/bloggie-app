
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookie = cookies().get('auth_token');
  if (!cookie) {
    return NextResponse.json({ user: null });
  }

  try {
    const [username] = atob(cookie.value).split(':');
    return NextResponse.json({ user: { username } });
  } catch (error) {
    // Invalid token
    return NextResponse.json({ user: null });
  }
}
