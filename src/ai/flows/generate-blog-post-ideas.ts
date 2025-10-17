'use server';

/**
 * @fileOverview Generates blog post ideas based on a topic.
 *
 * - generateBlogPostIdeas - A function that generates blog post ideas.
 * - GenerateBlogPostIdeasInput - The input type for the generateBlogPostIdeas function.
 * - GenerateBlogPostIdeasOutput - The return type for the generateBlogPostIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostIdeasInputSchema = z.object({
  topic: z.string().describe('The topic to generate blog post ideas for.'),
});
export type GenerateBlogPostIdeasInput = z.infer<typeof GenerateBlogPostIdeasInputSchema>;

const GenerateBlogPostIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of blog post ideas.'),
});
export type GenerateBlogPostIdeasOutput = z.infer<typeof GenerateBlogPostIdeasOutputSchema>;

export async function generateBlogPostIdeas(input: GenerateBlogPostIdeasInput): Promise<GenerateBlogPostIdeasOutput> {
  return generateBlogPostIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostIdeasPrompt',
  input: {schema: GenerateBlogPostIdeasInputSchema},
  output: {schema: GenerateBlogPostIdeasOutputSchema},
  prompt: `You are a blog post idea generator. Generate 5 blog post ideas based on the following topic:\n\nTopic: {{{topic}}}`,
});

const generateBlogPostIdeasFlow = ai.defineFlow(
  {
    name: 'generateBlogPostIdeasFlow',
    inputSchema: GenerateBlogPostIdeasInputSchema,
    outputSchema: GenerateBlogPostIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
