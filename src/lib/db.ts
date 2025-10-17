import type { BlogPost } from './types';
import { promises as fs } from 'fs';
import path from 'path';

// Use a JSON file as a simple database
const dbPath = path.join(process.cwd(), 'src/lib/db.json');

async function readDb(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, it's the first run. Return an empty array.
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Error reading database file:', error);
    // In case of other errors, we'll proceed with an empty array to avoid crashing.
    return [];
  }
}

async function writeDb(posts: BlogPost[]): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(posts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
}

export const db = {
  getPosts: async (): Promise<BlogPost[]> => {
    const posts = await readDb();
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getPost: async (id: string): Promise<BlogPost | undefined> => {
    const posts = await readDb();
    return posts.find(post => post.id === id);
  },
  addPost: async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
    const posts = await readDb();
    const newPost: BlogPost = {
      ...post,
      id: (Math.random() + 1).toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    await writeDb(posts);
    return newPost;
  },
  updatePost: async (id: string, postData: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): Promise<BlogPost | undefined> => {
    let posts = await readDb();
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) return undefined;
    
    posts[postIndex] = {
      ...posts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString(),
    };
    await writeDb(posts);
    return posts[postIndex];
  },
  deletePost: async (id: string): Promise<void> => {
    let posts = await readDb();
    const updatedPosts = posts.filter(post => post.id !== id);
    await writeDb(updatedPosts);
  },
  markPostsAsPosted: async (ids: string[]): Promise<void> => {
    let posts = await readDb();
    const updatedPosts = posts.map(post => 
      ids.includes(post.id) ? { ...post, status: 'posted', updatedAt: new Date().toISOString() } : post
    );
    await writeDb(updatedPosts);
  }
};
