'use server';

/**
 * @fileOverview Generates blog post content based on a title.
 *
 * - generateBlogPostContent - A function that handles the blog post content generation process.
 * - GenerateBlogPostContentInput - The input type for the generateBlogPostContent function.
 * - GenerateBlogPostContentOutput - The return type for the generateBlogPostContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostContentInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
});
export type GenerateBlogPostContentInput = z.infer<
  typeof GenerateBlogPostContentInputSchema
>;

const GenerateBlogPostContentOutputSchema = z.object({
  content: z.string().describe('The generated content of the blog post.'),
});
export type GenerateBlogPostContentOutput = z.infer<
  typeof GenerateBlogPostContentOutputSchema
>;

export async function generateBlogPostContent(
  input: GenerateBlogPostContentInput
): Promise<GenerateBlogPostContentOutput> {
  return generateBlogPostContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostContentPrompt',
  input: {schema: GenerateBlogPostContentInputSchema},
  output: {schema: GenerateBlogPostContentOutputSchema},
  prompt: `You are an expert blog post writer.

  Please generate a blog post based on the following title: {{{title}}}.`,
});

const generateBlogPostContentFlow = ai.defineFlow(
  {
    name: 'generateBlogPostContentFlow',
    inputSchema: GenerateBlogPostContentInputSchema,
    outputSchema: GenerateBlogPostContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
