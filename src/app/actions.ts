
"use server";

import dbConnect from "@/lib/dbConnect";
import QuestionModel from "@/models/question";
import { searchQuestions } from "@/ai/flows/search-questions";
import type { Question } from "@/lib/types";

// This function now fetches all questions from the database
export async function getAllQuestions(): Promise<{ success: boolean; questions?: Question[]; error?: string }> {
  try {
    await dbConnect();
    const questions = await QuestionModel.find({})
      .populate('author', 'name avatarUrl')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'name avatarUrl'
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, questions: JSON.parse(JSON.stringify(questions)) };
  } catch (error) {
    console.error("Error fetching all questions:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
}


export async function getSearchedQuestions(
  query: string
): Promise<{ success: boolean; questions?: Question[]; error?: string }> {
  try {
    await dbConnect();
    // A simple text search using MongoDB's text index for initial filtering
    const initialFilter = await QuestionModel.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).limit(50).lean();

    if (initialFilter.length === 0) {
      return { success: true, questions: [] };
    }
    
    const allQuestions = initialFilter.map(q => ({ 
      id: q._id.toString(), 
      title: q.title, 
      description: q.description, 
      tags: q.tags 
    }));

    const { questionIds } = await searchQuestions({ query, questions: allQuestions });
    
    // Fetch the full question objects for the IDs returned by Gemini
    const foundQuestions = await QuestionModel.find({ '_id': { $in: questionIds }})
      .populate('author', 'name avatarUrl')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'name avatarUrl'
        }
      })
      .lean();

    // Preserve the order from Gemini's response
    const orderedQuestions = questionIds
      .map(id => foundQuestions.find(q => q._id.toString() === id))
      .filter((q): q is any => q !== undefined);
      
    return { success: true, questions: JSON.parse(JSON.stringify(orderedQuestions)) };
  } catch (error) {
    console.error("Error searching questions:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
