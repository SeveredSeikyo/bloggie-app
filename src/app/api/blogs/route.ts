'use server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
  status: z.enum(['draft', 'posted']),
});

export async function GET() {
  const posts = await db.getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const validatedFields = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return NextResponse.json({
        message: 'Failed to save post. Please check the fields.',
        errors: validatedFields.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  const { title, content, status } = validatedFields.data;
  let imageUrl: string | undefined;

  const imageFile = formData.get('image') as File | null;

  if (imageFile && imageFile.size > 0) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json({ message: 'Only JPG, PNG, and GIF images are allowed.' }, { status: 400 });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'Image must be less than 5MB.' }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageName = `${Date.now()}-${imageFile.name}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const imagePath = path.join(uploadDir, imageName);

    try {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${imageName}`;
    } catch (error) {
      console.error('Failed to save image:', error);
      return NextResponse.json({ message: 'Failed to save image.' }, { status: 500 });
    }
  }

  try {
    const newPost = await db.addPost({ title, content, status, imageUrl });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Database error: Failed to save post.' }, { status: 500 });
  }
}
