
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { Answer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AnswerItem } from "@/components/answers/answer-item";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { useAuth } from "@/context/auth-context";
import { postAnswer } from "./actions";

interface AnswerSectionProps {
    questionId: string;
    answers: Answer[];
    isQuestionOwner: boolean;
}

export function AnswerSection({ questionId, answers, isQuestionOwner }: AnswerSectionProps) {
  const [optimisticAnswers, setOptimisticAnswers] = useState<Answer[]>(answers);
  const [isSubmitting, startSubmitting] = useTransition();

  const { toast } = useToast();
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [newAnswerContent, setNewAnswerContent] = useState("");
  
  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ variant: "destructive", title: "Not logged in", description: "You must be logged in to post an answer." });
      return;
    }
    if (newAnswerContent.trim().length < 20) {
      toast({ variant: "destructive", title: "Answer is too short", description: "Your answer must be at least 20 characters long." });
      return;
    }
    
    startSubmitting(async () => {
        // Optimistically add the new answer to the list
        const tempId = Date.now().toString();
        const newAnswerForUI: Answer = {
            _id: tempId,
            content: newAnswerContent,
            author: { _id: currentUser._id, name: currentUser.name, avatarUrl: currentUser.avatarUrl },
            votes: 0,
            isAccepted: false,
            createdAt: new Date().toISOString(),
        };
        setOptimisticAnswers(prev => [...prev, newAnswerForUI]);
        setNewAnswerContent("");

        const result = await postAnswer({
            content: newAnswerContent,
            questionId: questionId,
            authorId: currentUser._id,
        });

        if (result.success && result.answer) {
            toast({ title: "Answer Posted!", description: "Your answer has been successfully submitted." });
            // The revalidatePath in the action will trigger a full refresh from the server,
            // ensuring data consistency, so we don't need to replace the temp answer.
        } else {
            toast({ variant: "destructive", title: "Failed to post answer", description: result.error || "An unknown error occurred." });
            // Rollback optimistic update on failure
            setOptimisticAnswers(prev => prev.filter(a => a._id !== tempId));
        }
    });
  };

  return (
    <>
      <div className="my-8">
        <h2 className="text-2xl font-bold font-headline mb-4">
          {optimisticAnswers.length} Answer{optimisticAnswers.length !== 1 && "s"}
        </h2>
        <div className="space-y-6">
          {optimisticAnswers.map(answer => (
            <AnswerItem key={answer._id} answer={answer} isQuestionOwner={isQuestionOwner} />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold font-headline mb-4">Your Answer</h2>
        {currentUser ? (
          <form onSubmit={handlePostAnswer}>
            <RichTextEditor
              value={newAnswerContent} 
              onChange={setNewAnswerContent}
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
    </>
  );
}
