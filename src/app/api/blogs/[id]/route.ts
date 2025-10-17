'use server';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const postPatchSchema = z.object({
  title: z.string().min(1, 'Title is required.').optional(),
  content: z.string().min(1, 'Content is required.').optional(),
  status: z.enum(['draft', 'posted']).optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const post = await db.getPost(params.id);
  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const post = await db.getPost(params.id);
  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  const formData = await request.formData();
  const updateData: { title?: string; content?: string; status?: 'draft' | 'posted', imageUrl?: string } = {};
  
  const title = formData.get('title');
  const content = formData.get('content');
  const status = formData.get('status');
  
  if (title) updateData.title = title as string;
  if (content) updateData.content = content as string;
  if (status) updateData.status = status as 'draft' | 'posted';

  const validatedFields = postPatchSchema.safeParse(updateData);

  if (!validatedFields.success) {
    return NextResponse.json({
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  updateData.imageUrl = formData.get('existingImageUrl') as string | undefined;
  
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
      updateData.imageUrl = `/uploads/${imageName}`;
    } catch (error) {
      console.error('Failed to save image:', error);
      return NextResponse.json({ message: 'Failed to save image.' }, { status: 500 });
    }
  }

  try {
    const updatedPost = await db.updatePost(params.id, updateData);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: 'Database error: Failed to update post.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.deletePost(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: 'Database error: Failed to delete post.' }, { status: 500 });
  }
}
