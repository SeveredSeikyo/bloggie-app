import type { BlogPost } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import DeletePostButton from './DeletePostButton';
import Image from 'next/image';
import { UpdateStatusButton } from './UpdateStatusButton';

interface PostListProps {
  posts: BlogPost[];
  onPostDeleted: (id: string) => void;
  onPostStatusChanged: (id: string, newStatus: 'draft' | 'posted') => void;
  isAuthenticated: boolean;
}

export function PostList({ posts, onPostDeleted, onPostStatusChanged, isAuthenticated }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-headline">No blog posts yet.</h2>
        {isAuthenticated && (
          <>
            <p className="text-muted-foreground mt-2">Why not create one?</p>
            <Button asChild className="mt-4">
              <Link href="/posts/new">Create New Post</Link>
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map(post => (
        <Card key={post.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            {post.imageUrl && (
              <div className="relative aspect-[16/9] w-full mb-4 rounded-md overflow-hidden">
                <Image src={post.imageUrl} alt={post.title} fill className="object-cover" data-ai-hint="blog post image" />
              </div>
            )}
            <CardTitle className="font-headline text-xl leading-tight">{post.title}</CardTitle>
            <div className="flex items-center justify-between pt-2">
                <CardDescription>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </CardDescription>
                <Badge variant={post.status === 'posted' ? 'default' : 'secondary'} className="capitalize">
                    {post.status}
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center gap-2 bg-muted/50 p-4">
            {isAuthenticated ? (
                <UpdateStatusButton id={post.id} status={post.status} onPostStatusChanged={onPostStatusChanged} />
            ) : <div/>}
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/posts/${post.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              {isAuthenticated && (
                <>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/posts/${post.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <DeletePostButton id={post.id} onPostDeleted={onPostDeleted} />
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
