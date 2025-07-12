import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import QuestionModel from '@/models/question';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = params;
        
        const question = await QuestionModel.findById(id)
            .populate('author', 'name avatarUrl _id')
            .populate({
                path: 'answers',
                populate: {
                    path: 'author',
                    select: 'name avatarUrl _id'
                },
                options: { sort: { createdAt: -1 } }
            })
            .lean();

        if (!question) {
            return NextResponse.json({ message: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json({ question: JSON.parse(JSON.stringify(question)) }, { status: 200 });

    } catch (error) {
        console.error('Error fetching question:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}