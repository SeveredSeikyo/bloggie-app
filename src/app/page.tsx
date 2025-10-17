import { getPosts } from '@/lib/data';
import { PostList } from '@/components/PostList';
import Header from '@/components/Header';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PostList posts={posts} />
      </main>
    </div>
  );
}
