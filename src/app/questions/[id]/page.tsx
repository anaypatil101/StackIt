
"use client";

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

import type { Answer, Question } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { VoteButtons } from "@/components/shared/vote-buttons"
import { AnswerItem } from "@/components/answers/answer-item"
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { useAuth } from "@/context/auth-context";
import { useQuestion } from "@/context/question-context";
import { postAnswer } from "./actions";

async function getQuestionDetails(id: string): Promise<Question | null> {
    // This fetch should be replaced by a server action or direct db call in a server component
    const res = await fetch(`/api/questions/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        return null;
    }
    const data = await res.json();
    return data.question;
}


export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, startSubmitting] = useTransition();

  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [newAnswer, setNewAnswer] = useState("");
  
  useEffect(() => {
    getQuestionDetails(params.id)
        .then(data => {
            setQuestion(data);
        })
        .catch(err => console.error("Failed to fetch question details", err))
        .finally(() => setLoading(false));
  }, [params.id]);
  
  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ variant: "destructive", title: "Not logged in", description: "You must be logged in to post an answer." });
      return;
    }
    if (newAnswer.trim().length < 20) {
      toast({ variant: "destructive", title: "Answer is too short", description: "Your answer must be at least 20 characters long." });
      return;
    }
    
    startSubmitting(async () => {
        const result = await postAnswer({
            content: newAnswer,
            questionId: params.id,
            authorId: currentUser._id,
        });

        if (result.success && result.answer) {
            setQuestion(prev => prev ? { ...prev, answers: [...prev.answers, result.answer as Answer] } : null);
            setNewAnswer(""); // Clear the editor
            toast({ title: "Answer Posted!", description: "Your answer has been successfully submitted." });
        } else {
            toast({ variant: "destructive", title: "Failed to post answer", description: result.error || "An unknown error occurred." });
        }
    });
  };

  if (loading) {
    return (
       <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading Question...</p>
        </div>
    );
  }

  if (!question) {
    notFound();
  }

  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.isAccepted) return -1
    if (b.isAccepted) return 1
    return b.votes - a.votes
  });

  const isQuestionOwner = currentUser?._id === question.author._id;

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
                    <AvatarImage src={question.author.avatarUrl} alt={question.author.name} />
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
      <div className="my-8">
        <h2 className="text-2xl font-bold font-headline mb-4">
          {sortedAnswers.length} Answer{sortedAnswers.length !== 1 && "s"}
        </h2>
        <div className="space-y-6">
          {sortedAnswers.map(answer => (
            <AnswerItem key={answer._id} answer={answer} isQuestionOwner={isQuestionOwner} />
          ))}
        </div>
      </div>
       <div className="mt-12">
        <h2 className="text-2xl font-bold font-headline mb-4">Your Answer</h2>
        {currentUser ? (
          <form onSubmit={handlePostAnswer}>
            <RichTextEditor
              value={newAnswer} 
              onChange={setNewAnswer}
              placeholder="Describe your answer in detail..."
            />
            <Button type="submit" className="mt-4 bg-accent hover:bg-accent/90" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Your Answer
            </Button>
          </form>
        ) : (
          <div className="p-4 border rounded-md text-center bg-secondary/50">
            <p className="text-muted-foreground">You must be logged in to post an answer.</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/login">Login or Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
