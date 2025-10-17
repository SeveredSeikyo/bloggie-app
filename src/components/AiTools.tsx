'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button';
import { Label } from "@/components/ui/label";
import { generateContentAction, generateIdeasAction } from '@/lib/actions';
import { Wand2, Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AiTools({ setContent, setTitle, currentTitle }: {
  setContent: (content: string) => void;
  setTitle: (title: string) => void;
  currentTitle: string;
}) {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isGeneratingIdeas, startIdeasTransition] = useTransition();
  const [isGeneratingContent, startContentTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateIdeas = () => {
    startIdeasTransition(async () => {
      const result = await generateIdeasAction(topic);
      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      } else if (result.ideas) {
        setIdeas(result.ideas);
      }
    });
  };

  const handleGenerateContent = (title: string) => {
    startContentTransition(async () => {
      const result = await generateContentAction(title);
      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      } else if (result.content) {
        setContent(result.content);
        if (title !== currentTitle) {
          setTitle(title);
        }
        toast({ title: 'Success', description: 'Content generated!' });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 className="text-accent" /> AI Content Tools
        </CardTitle>
        <CardDescription>Generate blog post ideas or draft content with AI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Blog Post Topic</Label>
          <div className="flex gap-2">
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The future of renewable energy"
            />
            <Button onClick={handleGenerateIdeas} disabled={isGeneratingIdeas || !topic}>
              {isGeneratingIdeas ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Get Ideas
            </Button>
          </div>
        </div>
        
        {ideas.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-card-foreground">Generated Ideas:</h4>
            <ul className="space-y-2">
              {ideas.map((idea, index) => (
                <li key={index} className="flex justify-between items-center p-2 rounded-md bg-secondary/50">
                  <span className="text-sm">{idea}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                        setTitle(idea);
                        handleGenerateContent(idea);
                    }}
                    disabled={isGeneratingContent}
                  >
                    {isGeneratingContent ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Write this'}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="border-t pt-4">
          <Button
            onClick={() => handleGenerateContent(currentTitle)}
            disabled={isGeneratingContent || !currentTitle}
            variant="outline"
            className="w-full"
          >
            {isGeneratingContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Content for Current Title
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
