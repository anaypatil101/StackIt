
"use server";

import { questions } from "@/lib/mock-data";
import { searchQuestions } from "@/ai/flows/search-questions";
import type { Question } from "@/lib/types";

export async function getSearchedQuestions(
  query: string
): Promise<{ success: boolean; questions?: Question[]; error?: string }> {
  try {
    const allQuestions = questions.map(q => ({ id: q.id, title: q.title, description: q.description, tags: q.tags }));
    const { questionIds } = await searchQuestions({ query, questions: allQuestions });
    
    // Filter the original questions array to maintain order and full data
    const foundQuestions = questionIds
      .map(id => questions.find(q => q.id === id))
      .filter((q): q is Question => q !== undefined);
      
    return { success: true, questions: foundQuestions };
  } catch (error) {
    console.error("Error searching questions:", error);
    return { success: false, error: "An unexpected error occurred during search." };
  }
}
