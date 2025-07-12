'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing a smart search for questions.
 *
 * - searchQuestions - A function that takes a search query and a list of questions, returning relevant question IDs.
 * - SearchQuestionsInput - The input type for the searchQuestions function.
 * - SearchQuestionsOutput - The return type for the searchQuestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionSchema = z.object({
  id: z.string().describe('The unique identifier for the question.'),
  title: z.string().describe('The title of the question.'),
  description: z.string().describe('The full description of the question.'),
  tags: z.array(z.string()).describe('A list of tags associated with the question.'),
});

const SearchQuestionsInputSchema = z.object({
  query: z.string().describe('The user\'s search query.'),
  questions: z.array(QuestionSchema).describe('The list of all available questions to search from.'),
});
export type SearchQuestionsInput = z.infer<typeof SearchQuestionsInputSchema>;

const SearchQuestionsOutputSchema = z.object({
  questionIds: z.array(z.string()).describe('An array of IDs of the questions that are most relevant to the search query.'),
});
export type SearchQuestionsOutput = z.infer<typeof SearchQuestionsOutputSchema>;

export async function searchQuestions(input: SearchQuestionsInput): Promise<SearchQuestionsOutput> {
  return searchQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchQuestionsPrompt',
  input: { schema: SearchQuestionsInputSchema },
  output: { schema: SearchQuestionsOutputSchema },
  prompt: `You are a powerful search engine for a question and answer forum.
  Your task is to find the most relevant questions from the provided list based on the user's search query.
  Analyze the query's intent and match it against the question's title, description, and tags.
  Return an array of question IDs, ordered by relevance from most to least.
  If no questions are relevant, return an empty array.

  User Query: {{{query}}}

  Available Questions (JSON format):
  {{{json questions}}}

  Return only the IDs of the relevant questions.`,
});

const searchQuestionsFlow = ai.defineFlow(
  {
    name: 'searchQuestionsFlow',
    inputSchema: SearchQuestionsInputSchema,
    outputSchema: SearchQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
