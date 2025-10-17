'use server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await db.getPosts();
  const draftPosts = posts.filter(post => post.status === 'draft');
  return NextResponse.json(draftPosts);
}
