import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"

import { questions } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { VoteButtons } from "@/components/shared/vote-buttons"
import { AnswerItem } from "@/components/answers/answer-item"
import { RichTextEditor } from "@/components/shared/rich-text-editor"

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const question = questions.find((q) => q.id === params.id)

  if (!question) {
    notFound()
  }

  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.isAccepted) return -1
    if (b.isAccepted) return 1
    return b.votes - a.votes
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">{question.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground space-x-2 mb-4">
          <span>
            Asked{" "}
            <time dateTime={question.createdAt.toISOString()}>
              {format(question.createdAt, "MMM d, yyyy 'at' HH:mm")}
            </time>
          </span>
        </div>
        <Separator />
        <div className="flex gap-6 py-6">
          <div className="hidden sm:flex flex-col items-center">
            <VoteButtons initialVotes={question.votes} />
          </div>
          <div className="flex-1 space-y-6">
            <div className="prose prose-lg max-w-none text-foreground">{question.description}</div>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={question.author.avatarUrl} alt={question.author.name} />
                  <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-muted-foreground">asked by</div>
                  <div className="font-semibold text-primary">{question.author.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="my-8">
        <h2 className="text-2xl font-bold font-headline mb-4">
          {question.answers.length} Answer{question.answers.length !== 1 && "s"}
        </h2>
        <div className="space-y-6">
          {sortedAnswers.map(answer => (
            <AnswerItem key={answer.id} answer={answer} isQuestionOwner={true} />
          ))}
        </div>
      </div>
       <div className="mt-12">
        <h2 className="text-2xl font-bold font-headline mb-4">Your Answer</h2>
        <RichTextEditor />
        <Button className="mt-4 bg-accent hover:bg-accent/90">Post Your Answer</Button>
      </div>
    </div>
  )
}
