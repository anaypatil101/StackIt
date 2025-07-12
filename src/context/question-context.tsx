
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Question } from '@/lib/types';
import { getAllQuestions } from '@/app/actions'; // We'll use this to fetch initial data

interface QuestionContextType {
  questions: Question[];
  loading: boolean;
  refreshQuestions: () => Promise<void>;
  addOptimisticQuestion: (question: Question) => void;
  addOptimisticAnswer: (questionId: string, answer: any) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export function QuestionProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const result = await getAllQuestions();
    if (result.success && result.questions) {
      setQuestions(result.questions);
    } else {
      console.error("Failed to fetch questions:", result.error);
      // Handle error appropriately, maybe show a toast
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const addOptimisticQuestion = (question: Question) => {
    // Note: this is a simplified optimistic update.
    // The author object would need to be the full user object for it to work perfectly.
    // This is good for immediate UI feedback. The `refreshQuestions` call will fetch the source of truth.
    setQuestions(prevQuestions => [question, ...prevQuestions]);
  };
  
  const addOptimisticAnswer = (questionId: string, answer: any) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q._id === questionId 
          ? { ...q, answers: [...q.answers, answer] }
          : q
      )
    );
  };

  const value = {
    questions,
    loading,
    refreshQuestions: fetchQuestions,
    addOptimisticQuestion,
    addOptimisticAnswer
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
