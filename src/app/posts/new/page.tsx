import { PostForm } from '@/components/PostForm';
import Header from '@/components/Header';

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-headline font-bold mb-6 text-card-foreground">Create New Post</h1>
          <PostForm />
        </div>
      </main>
    </div>
  );
}
