"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Answer } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VoteButtons } from "@/components/shared/vote-buttons";
import { Separator } from "@/components/ui/separator";

interface AnswerItemProps {
  answer: Answer;
  isQuestionOwner: boolean;
}

export function AnswerItem({ answer, isQuestionOwner }: AnswerItemProps) {
  const [isAccepted, setIsAccepted] = useState(answer.isAccepted);

  const handleAccept = () => {
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
        >
          {answer.content}
        </div>
        <div className="flex items-center justify-end text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={answer.author.avatarUrl} alt={answer.author.name} />
              <AvatarFallback>
                {answer.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>
              {answer.author.name} answered{" "}
              {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
