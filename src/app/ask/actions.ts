
"use server";

import { suggestTags, SuggestTagsInput } from "@/ai/flows/suggest-tags";
import dbConnect from "@/lib/dbConnect";
import QuestionModel from "@/models/question";
import { revalidatePath } from "next/cache";

export async function getSuggestedTags(
  input: SuggestTagsInput
): Promise<{ success: boolean; tags?: string[]; error?: string }> {
  try {
    const { tags } = await suggestTags(input);
    return { success: true, tags };
  } catch (error) {
    console.error("Error suggesting tags:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}


interface CreateQuestionInput {
  title: string;
  description: string;
  tags: string[];
  authorId: string;
}

export async function createQuestion(
  input: CreateQuestionInput
): Promise<{ success: boolean; questionId?: string; error?: string; }> {
  try {
    await dbConnect();
    
    const newQuestion = await QuestionModel.create({
      title: input.title,
      description: input.description,
      tags: input.tags,
      author: input.authorId,
    });
    
    // Revalidate the home page to show the new question
    revalidatePath('/');
    
    return { success: true, questionId: newQuestion._id.toString() };
  } catch (error) {
    console.error("Error creating question:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
