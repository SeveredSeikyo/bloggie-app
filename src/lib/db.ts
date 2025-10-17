import type { BlogPost } from './types';
import { PlaceHolderImages } from './placeholder-images';

let posts: BlogPost[] = [];

export const db = {
  getPosts: async (): Promise<BlogPost[]> => {
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getPost: async (id: string): Promise<BlogPost | undefined> => {
    return posts.find(post => post.id === id);
  },
  addPost: async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
    const newPost: BlogPost = {
      ...post,
      id: (Math.random() + 1).toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    return newPost;
  },
  updatePost: async (id: string, postData: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): Promise<BlogPost | undefined> => {
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) return undefined;
    
    posts[postIndex] = {
      ...posts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString(),
    };
    return posts[postIndex];
  },
  deletePost: async (id: string): Promise<void> => {
    posts = posts.filter(post => post.id !== id);
  },
  markPostsAsPosted: async (ids: string[]): Promise<void> => {
    posts = posts.map(post => 
      ids.includes(post.id) ? { ...post, status: 'posted', updatedAt: new Date().toISOString() } : post
    );
  }
};
