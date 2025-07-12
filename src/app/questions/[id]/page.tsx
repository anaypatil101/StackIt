
import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VoteButtons } from "@/components/shared/vote-buttons"
import { getQuestionDetails } from "./data";
import { AnswerSection } from "./answer-section";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import type { DecodedUser } from "@/lib/types";

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
  const question = await getQuestionDetails(params.id);

  if (!question) {
    notFound();
  }

  const token = cookies().get('token')?.value;
  let currentUser: DecodedUser | null = null;
  if (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
        currentUser = { id: decoded.id, name: decoded.name, avatarUrl: decoded.avatarUrl };
    } catch (e) {
        // Invalid token
    }
  }

  const isQuestionOwner = currentUser?.id === question.author._id;

  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.isAccepted) return -1
    if (b.isAccepted) return 1
    // Using votes is not ideal since it's client-side state. Sorting by date is more reliable here.
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">{question.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground space-x-2 mb-4">
          <span>
            Asked{" "}
            <time dateTime={new Date(question.createdAt).toISOString()}>
              {format(new Date(question.createdAt), "MMM d, yyyy 'at' HH:mm")}
            </time>
          </span>
        </div>
        <Separator />
        <div className="flex gap-6 py-6">
          <div className="hidden sm:flex flex-col items-center">
            <VoteButtons initialVotes={question.votes} />
          </div>
          <div className="flex-1 space-y-6">
            <div 
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex justify-end">
              <Link href={`/profile/${encodeURIComponent(question.author.name)}`} className="group">
                <div className="flex items-center gap-2 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={question.author.avatarUrl} alt={question.author.name} data-ai-hint="avatar" />
                    <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-muted-foreground">asked by</div>
                    <div className="font-semibold text-primary group-hover:underline">{question.author.name}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      
      <AnswerSection 
        questionId={question._id}
        answers={sortedAnswers} 
        isQuestionOwner={isQuestionOwner}
      />
    </div>
  )
}
