'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export function PostForm({ post }: { post?: BlogPost }) {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{title?: string[], content?: string[], image?: string[]}>({});
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(post?.imageUrl || null);
    }
  };
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const url = post ? `/api/blogs/${post.id}` : '/api/blogs';
    const method = post ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        throw new Error(errorData.message || 'Failed to save the post.');
      }
      
      toast({
        title: 'Success!',
        description: `Post has been ${post ? 'updated' : 'created'}.`,
      });

      // To see the changes we need to navigate back and have the page re-fetch
      router.push('/');
      router.refresh();

    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
       toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={post?.title}
                placeholder="Your amazing blog post title"
                required
                className="text-lg"
              />
              {errors?.title && <p className="text-sm text-destructive">{errors.title.join(', ')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={post?.content}
                placeholder="Write your heart out..."
                className="min-h-[300px]"
                required
              />
              {errors?.content && <p className="text-sm text-destructive">{errors.content.join(', ')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
              <Input id="image" name="image" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} />
              {post?.imageUrl && <input type="hidden" name="existingImageUrl" value={post.imageUrl} />}
              {imagePreview && (
                <div className="mt-4 relative w-full aspect-video rounded-md overflow-hidden border">
                    <Image src={imagePreview} alt="Image preview" fill className="object-cover" data-ai-hint="image preview" />
                </div>
              )}
              {errors?.image && <p className="text-sm text-destructive">{errors.image.join(', ')}</p>}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup name="status" defaultValue={post?.status || 'draft'} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="draft" />
                  <Label htmlFor="draft">Draft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="posted" id="posted" />
                  <Label htmlFor="posted">Posted</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-end pt-4">
               <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Saving...' : 'Save Post'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
