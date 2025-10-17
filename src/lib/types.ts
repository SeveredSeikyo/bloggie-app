export type BlogPost = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  status: 'draft' | 'posted';
  createdAt: string;
  updatedAt: string;
};
