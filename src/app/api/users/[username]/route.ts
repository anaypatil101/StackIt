
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user';
import QuestionModel from '@/models/question';
import AnswerModel from '@/models/answer';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    try {
        await dbConnect();
        const { username } = params;

        const user = await UserModel.findOne({ name: username }).lean();

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const questions = await QuestionModel.find({ author: user._id })
            .sort({ createdAt: -1 })
            .lean();

        const answerCount = await AnswerModel.countDocuments({ author: user._id });
        
        const profileData = {
            user: {
                _id: user._id.toString(),
                name: user.name,
                avatarUrl: user.avatarUrl,
            },
            questions: JSON.parse(JSON.stringify(questions)),
            answerCount,
        };

        return NextResponse.json(profileData, { status: 200 });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
