'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { savePost } from '@/lib/actions';
import type { BlogPost } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AiTools from './AiTools';
import Image from 'next/image';

const initialState = { message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {pending ? 'Saving...' : 'Save Post'}
    </Button>
  );
}

export function PostForm({ post }: { post?: BlogPost }) {
  const [formState, formAction] = useFormState(savePost.bind(null, post?.id ?? null), initialState);
  const { toast } = useToast();
  const [content, setContent] = useState(post?.content || '');
  const [title, setTitle] = useState(post?.title || '');
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.message && formState.errors) {
      toast({
        title: 'Error',
        description: formState.message,
        variant: 'destructive',
      });
    }
  }, [formState, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(post?.imageUrl || null);
    }
  };

  return (
    <div className="space-y-8">
      <AiTools setContent={setContent} setTitle={setTitle} currentTitle={title} />
      
      <form ref={formRef} action={formAction} className="space-y-6">
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your amazing blog post title"
                required
                className="text-lg"
              />
              {formState.errors?.title && <p className="text-sm text-destructive">{formState.errors.title.join(', ')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your heart out..."
                className="min-h-[300px]"
                required
              />
              {formState.errors?.content && <p className="text-sm text-destructive">{formState.errors.content.join(', ')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
              {post?.imageUrl && <input type="hidden" name="existingImageUrl" value={post.imageUrl} />}
              {imagePreview && (
                <div className="mt-4 relative w-full aspect-video rounded-md overflow-hidden border">
                    <Image src={imagePreview} alt="Image preview" fill className="object-cover" data-ai-hint="image preview" />
                </div>
              )}
              {formState.errors?.image && <p className="text-sm text-destructive">{formState.errors.image.join(', ')}</p>}
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
              <SubmitButton />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
