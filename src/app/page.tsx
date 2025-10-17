
'use client';
import { useEffect, useState } from 'react';
import type { BlogPost } from '@/lib/types';
import { PostList } from '@/components/PostList';
import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // This endpoint is public
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
        fetchPosts();
    }
  }, [user]);

  const onPostDeleted = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
  }

  const onPostStatusChanged = (id: string, status: 'draft' | 'posted') => {
    setPosts(prevPosts => prevPosts.map(p => p.id === id ? {...p, status} : p));
  }
  
  const PageSkeleton = () => (
    <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[225px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    </div>
  );

  if (loading || authLoading) {
    return <PageSkeleton />;
  }
  
  if (!user) {
    // This is a temporary state while redirecting
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PostList posts={posts} onPostDeleted={onPostDeleted} onPostStatusChanged={onPostStatusChanged} isAuthenticated={!!user} />
      </main>
    </div>
  );
}
