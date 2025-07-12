
"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Answer } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VoteButtons } from "@/components/shared/vote-buttons";

interface AnswerItemProps {
  answer: Answer;
  isQuestionOwner: boolean;
}

export function AnswerItem({ answer, isQuestionOwner }: AnswerItemProps) {
  const [isAccepted, setIsAccepted] = useState(answer.isAccepted);

  const handleAccept = () => {
    // In a real app, this would be an API call to the server
    setIsAccepted(!isAccepted);
  };

  return (
    <div className="flex gap-4">
      <div className="hidden sm:flex flex-col items-center">
        <VoteButtons initialVotes={answer.votes} />
        {isQuestionOwner && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "mt-2 w-8 h-8 rounded-full text-muted-foreground hover:text-accent",
              isAccepted && "text-accent bg-accent/10"
            )}
            onClick={handleAccept}
            aria-label="Accept answer"
          >
            <Check className="w-6 h-6" />
          </Button>
        )}
      </div>
      <div className="flex-1">
        <div
          className={cn(
            "prose max-w-none text-foreground p-4 rounded-md border border-transparent",
            isAccepted && "border-accent bg-accent/5"
          )}
          dangerouslySetInnerHTML={{ __html: answer.content }}
        />
        <div className="flex items-center justify-end text-sm text-muted-foreground mt-4">
          <Link href={`/profile/${encodeURIComponent(answer.author.name)}`} className="group">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={answer.author.avatarUrl} alt={answer.author.name} />
                <AvatarFallback>
                  {answer.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>
                <span className="group-hover:underline text-primary/80">{answer.author.name}</span> answered{" "}
                {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
