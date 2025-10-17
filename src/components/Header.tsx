'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, LogOut, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Header() {
  const { user, logout, loading, getAuthHeader } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPosting, setIsPosting] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handlePostBlogs = async () => {
    setIsPosting(true);
    try {
      const res = await fetch('/api/post-blogs', {
        method: 'POST',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        throw new Error('Failed to trigger post blogs webhook.');
      }
      toast({
        title: 'Success',
        description: 'Successfully triggered the post blogs webhook.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline font-bold text-primary">
          Bloggie
        </Link>
        <div className="flex items-center gap-4">
          {!loading && user && (
            <>
              <Button onClick={handlePostBlogs} disabled={isPosting}>
                {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isPosting ? 'Posting...' : 'Post Blogs'}
              </Button>
              <Button asChild>
                <Link href="/posts/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Post
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
