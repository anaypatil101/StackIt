
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { HelpCircle, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User, Question } from "@/lib/types";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import QuestionModel from "@/models/question";
import AnswerModel from "@/models/answer";

interface ProfileData {
    user: User;
    questions: Question[];
    answerCount: number;
}

// Server-side function to fetch profile data
async function getProfileData(username: string): Promise<ProfileData | null> {
    try {
        await dbConnect();
        const user = await UserModel.findOne({ name: username }).lean();

        if (!user) {
            return null;
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

        return profileData;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username as string);
  const profileData = await getProfileData(username);

  if (!profileData) {
    notFound();
  }
  
  const { user, questions: userQuestions, answerCount: userAnswerCount } = profileData;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        <Avatar className="w-24 h-24 text-3xl">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="avatar" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-4xl font-bold font-headline">{user.name}</h1>
          <p className="text-muted-foreground mt-2">Member</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Asked</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userQuestions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Answers Provided</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAnswerCount}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Recent Questions</h2>
        <div className="space-y-4">
          {userQuestions.length > 0 ? (
            userQuestions.map(question => (
              <Card key={question._id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <Link href={`/questions/${question._id}`} className="group">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{question.title}</h3>
                  </Link>
                  <div className="flex flex-wrap gap-2 my-2">
                    {question.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">This user hasn't asked any questions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
