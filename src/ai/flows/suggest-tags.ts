'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags for a question based on its title and description.
 *
 * - suggestTags - A function that takes a question title and description as input and returns a list of suggested tags.
 * - SuggestTagsInput - The input type for the suggestTags function.
 * - SuggestTagsOutput - The return type for the suggestTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  title: z.string().describe('The title of the question.'),
  description: z.string().describe('The description of the question.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the question.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an expert in categorizing questions for a Q&A forum.
  Given the title and description of a question, suggest a list of relevant tags.
  The tags should be concise and reflect the main topics covered in the question.

  Title: {{{title}}}
  Description: {{{description}}}

  Suggested Tags:`, // No need for JSON output, just comma separated values is expected
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Splits tags by commas, and trims each tag for whitespace.
    const tags = output!.tags;
    return { tags };
  }
);
