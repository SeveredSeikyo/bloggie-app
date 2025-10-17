import type { BlogPost } from './types';
import { PlaceHolderImages } from './placeholder-images';

let posts: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Digital Landscaping',
    content: "Creating stunning digital environments requires a blend of artistic vision and technical skill. This post explores the key principles of digital landscaping, from composition and lighting to texture and atmosphere. We'll delve into popular tools and techniques used by professionals to craft immersive worlds that captivate audiences. Whether you're a seasoned 3D artist or a beginner just starting, you'll find valuable insights to elevate your creations.",
    imageUrl: PlaceHolderImages.find(p => p.id === '1')?.imageUrl,
    status: 'posted',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'A Culinary Journey Through Spice Routes',
    content: "Embark on a flavorful adventure as we trace the ancient spice routes that shaped global cuisine. From the pungent aromas of cloves and nutmeg in the East Indies to the fiery chilies of the Americas, spices have been at the heart of trade, culture, and conflict for centuries. This post uncovers the stories behind the world's most coveted seasonings and offers recipes to bring their history to your kitchen.",
    imageUrl: PlaceHolderImages.find(p => p.id === '2')?.imageUrl,
    status: 'posted',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'The Future of Urban Mobility',
    content: "Our cities are on the move, and so are we. This post examines the revolutionary changes transforming urban transportation. We will look at the rise of electric vehicles, the promise of autonomous driving, and the integration of micro-mobility solutions like e-scooters and bike-sharing programs. Discover how smart infrastructure and data-driven planning are creating more sustainable, efficient, and livable cities for tomorrow.",
    imageUrl: PlaceHolderImages.find(p => p.id === '3')?.imageUrl,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
