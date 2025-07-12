"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface VoteButtonsProps {
  initialVotes: number
}

type VoteState = "up" | "down" | null

export function VoteButtons({ initialVotes }: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [voteState, setVoteState] = useState<VoteState>(null)

  const handleVote = (newVoteState: "up" | "down") => {
    setVoteState((currentState) => {
      // If clicking the same button again, unvote
      if (currentState === newVoteState) {
        setVotes(initialVotes)
        return null
      }
      
      // If switching vote
      if (currentState !== null) {
         setVotes(initialVotes + (newVoteState === 'up' ? 1 : -1));
      } else { // If new vote
        setVotes(votes + (newVoteState === 'up' ? 1 : -1));
      }
      
      return newVoteState
    })
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-full transition-transform active:scale-110",
          voteState === "up" && "text-accent bg-accent/10"
        )}
        onClick={() => handleVote("up")}
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
      <span className="text-lg font-bold w-8 text-center my-1">{votes}</span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-full transition-transform active:scale-110",
          voteState === "down" && "text-destructive bg-destructive/10"
        )}
        onClick={() => handleVote("down")}
      >
        <ArrowDown className="w-5 h-5" />
      </Button>
    </div>
  )
}
