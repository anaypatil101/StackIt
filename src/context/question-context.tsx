
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Question, Answer } from '@/lib/types';
import { questions as initialQuestions } from '@/lib/mock-data';

interface QuestionContextType {
  questions: Question[];
  addQuestion: (question: Question) => void;
  addAnswer: (questionId: string, answer: Answer) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export function QuestionProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const addQuestion = (question: Question) => {
    setQuestions(prevQuestions => [question, ...prevQuestions]);
  };
  
  const addAnswer = (questionId: string, answer: Answer) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.id === questionId 
          ? { ...q, answers: [...q.answers, answer] }
          : q
      )
    );
  };

  const value = {
    questions,
    addQuestion,
    addAnswer,
  };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestion() {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error('useQuestion must be used within a QuestionProvider');
  }
  return context;
}
