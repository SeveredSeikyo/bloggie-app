'use client';
import { PostForm } from '@/components/PostForm';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blogs/${params.id}`);
        if (!res.ok) {
          throw new Error('Post not found');
        }
        const data = await res.json();
        setPost(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </main>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-2xl font-bold">Post not found</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-headline font-bold mb-6 text-card-foreground">Edit Post</h1>
          {post && <PostForm post={post} />}
        </div>
      </main>
    </div>
  );
}
