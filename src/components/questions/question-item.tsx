import Link from "next/link"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { MessageSquare } from "lucide-react"

import type { Question } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { VoteButtons } from "@/components/shared/vote-buttons"

interface QuestionItemProps {
  question: Question
}

export function QuestionItem({ question }: QuestionItemProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4 flex gap-4">
        <div className="hidden sm:flex flex-col items-center gap-1">
          <VoteButtons initialVotes={question.votes} />
          <div className="flex flex-col items-center text-sm text-muted-foreground pt-2">
            <span className="font-semibold">{question.answers.length}</span>
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
        <div className="flex-grow">
          <Link href={`/questions/${question.id}`} className="group">
            <h2 className="text-xl font-headline font-medium group-hover:text-primary transition-colors">
              {question.title}
            </h2>
          </Link>
          <div className="flex flex-wrap gap-2 my-2">
            {question.tags.map((tag) => (
              <Link key={tag} href={`/?q=${encodeURIComponent(tag)}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.author.avatarUrl} alt={question.author.name} />
                <AvatarFallback>
                  {question.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{question.author.name}</span>
            </div>
            <span>
              asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
