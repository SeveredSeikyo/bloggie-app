import { PostForm } from '@/components/PostForm';
import { getPost } from '@/lib/data';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-headline font-bold mb-6 text-card-foreground">Edit Post</h1>
          <PostForm post={post} />
        </div>
      </main>
    </div>
  );
}
