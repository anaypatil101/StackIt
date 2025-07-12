"use server";

import { suggestTags, SuggestTagsInput } from "@/ai/flows/suggest-tags";

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
