
"use server"

import dbConnect from "@/lib/dbConnect";
import AnswerModel from "@/models/answer";
import QuestionModel from "@/models/question";
import { revalidatePath } from "next/cache";

interface PostAnswerInput {
    content: string;
    questionId: string;
    authorId: string;
}

export async function postAnswer(input: PostAnswerInput): Promise<{ success: boolean; answer?: any; error?: string; }> {
  try {
    await dbConnect();
    
    const newAnswer = new AnswerModel({
        content: input.content,
        question: input.questionId,
        author: input.authorId,
    });

    await newAnswer.save();

    // Add answer to the question's answers array
    await QuestionModel.findByIdAndUpdate(input.questionId, {
        $push: { answers: newAnswer._id }
    });

    const populatedAnswer = await AnswerModel.findById(newAnswer._id).populate('author', 'name avatarUrl').lean();
    
    revalidatePath(`/questions/${input.questionId}`);
    
    return { success: true, answer: JSON.parse(JSON.stringify(populatedAnswer)) };
  } catch (error) {
    console.error("Error posting answer:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
