'use server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await db.getPosts();
  const postedPosts = posts.filter(post => post.status === 'posted');
  return NextResponse.json(postedPosts);
}
