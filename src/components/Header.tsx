'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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
