'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addPost, deletePost, getPost, updatePost } from '@/lib/data';
import { generateBlogPostIdeas } from '@/ai/flows/generate-blog-post-ideas';
import { generateBlogPostContent } from '@/ai/flows/generate-blog-post-content';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
  status: z.enum(['draft', 'posted']),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    image?: string[];
  };
};

export async function savePost(id: string | null, prevState: FormState, formData: FormData) {
  const validatedFields = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to save post. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, content, status } = validatedFields.data;
  let imageUrl = formData.get('existingImageUrl') as string | undefined;

  const imageFile = formData.get('image') as File;
  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > 4 * 1024 * 1024) {
      return { message: 'Image must be less than 4MB.', errors: { image: ['Image must be less than 4MB.'] } };
    }
    if (!imageFile.type.startsWith('image/')) {
        return { message: 'Only image files are allowed.', errors: { image: ['Only image files are allowed.'] } };
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
      return { message: 'Failed to save image.', errors: { image: ['Failed to save image.'] } };
    }
  }

  let newPostId: string | undefined;
  try {
    if (id) {
      const existingPost = await getPost(id);
      if (!existingPost) {
        return { message: 'Post not found.' };
      }
      await updatePost(id, { title, content, status, imageUrl });
      newPostId = id;
    } else {
      const newPost = await addPost({ title, content, status, imageUrl });
      newPostId = newPost.id;
    }
  } catch (error) {
    return { message: 'Database error: Failed to save post.' };
  }

  revalidatePath('/');
  revalidatePath(`/posts/${newPostId}`);
  redirect('/');
}

export async function deletePostAction(id: string) {
  try {
    await deletePost(id);
    revalidatePath('/');
  } catch (error) {
    return { message: 'Database Error: Failed to delete post.' };
  }
}

export async function updatePostStatusAction(id: string, status: 'draft' | 'posted') {
    try {
        await updatePost(id, { status });
        revalidatePath('/');
        revalidatePath(`/posts/${id}`);
    } catch (error) {
        return { message: 'Database Error: Failed to update status.' };
    }
}


export async function generateIdeasAction(topic: string) {
    if (!topic) {
        return { error: 'Topic is required.' };
    }
    try {
        const result = await generateBlogPostIdeas({ topic });
        return { ideas: result.ideas };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate ideas.' };
    }
}

export async function generateContentAction(title: string) {
    if (!title) {
        return { error: 'Title is required.' };
    }
    try {
        const result = await generateBlogPostContent({ title });
        return { content: result.content };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate content.' };
    }
}
