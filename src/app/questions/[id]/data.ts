
"use server";

import dbConnect from '@/lib/dbConnect';
import QuestionModel from '@/models/question';
import type { Question } from '@/lib/types';

export async function getQuestionDetails(id: string): Promise<Question | null> {
    try {
        await dbConnect();
        
        const question = await QuestionModel.findById(id)
            .populate('author', 'name avatarUrl _id')
            .populate({
                path: 'answers',
                populate: {
                    path: 'author',
                    select: 'name avatarUrl _id'
                },
                options: { sort: { votes: -1, createdAt: -1 } } 
            })
            .lean();

        if (!question) {
            return null;
        }

        return JSON.parse(JSON.stringify(question));

    } catch (error) {
        console.error('Error fetching question:', error);
        return null;
    }
}
