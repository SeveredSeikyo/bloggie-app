'use server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await db.getPosts();
  const postedPosts = posts.filter(post => post.status === 'posted').map(post => ({
    ...post,
    imageUrl: post.imageUrl || null,
  }));
  return NextResponse.json(postedPosts);
}
