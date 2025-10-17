import { getPost } from '@/lib/data';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <Badge variant={post.status === 'posted' ? 'default' : 'secondary'} className="capitalize">
              {post.status}
            </Badge>
            <Button asChild variant="outline" size="sm">
                <Link href={`/posts/${post.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
            </Button>
          </div>

          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 leading-tight text-card-foreground">{post.title}</h1>
          
          <p className="text-muted-foreground mb-6">
            Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>

          {post.imageUrl && (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <Image src={post.imageUrl} alt={post.title} fill className="object-cover" data-ai-hint="blog post image" />
            </div>
          )}

          <Separator className="my-8" />
          
          <div className="text-lg leading-relaxed space-y-6 whitespace-pre-wrap text-card-foreground">
            <p>{post.content}</p>
          </div>
        </article>
      </main>
    </div>
  );
}
