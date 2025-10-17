
import { NextResponse } from 'next/server';

export async function POST() {
  // With JWT, logout is primarily a client-side action (deleting the token).
  // This endpoint can be kept for consistency or future use (e.g., token blocklisting).
  return NextResponse.json({ success: true });
}
