
"use client";

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { questions as allQuestions } from '@/lib/mock-data';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { QuestionItem } from '@/components/questions/question-item';
import type { Question } from '@/lib/types';
import { getSearchedQuestions } from './actions';
import { useToast } from '@/hooks/use-toast';

function SearchBar() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    // Using pushState and dispatching an event to ensure the page re-renders with the new query
    window.history.pushState(null, '', `?${params.toString()}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Ask Gemini to find questions..."
        className="pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

export default function Home() {
  const searchParams = useSearchParams();
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(allQuestions);
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();

  const query = searchParams.get('q');

  useEffect(() => {
    const performSearch = async () => {
      if (query) {
        startSearchTransition(async () => {
          const result = await getSearchedQuestions(query);
          if (result.success && result.questions) {
            setFilteredQuestions(result.questions);
          } else {
            toast({
              variant: 'destructive',
              title: 'Search Failed',
              description: result.error || 'Could not perform smart search.',
            });
            setFilteredQuestions(allQuestions); // Fallback to all questions on error
          }
        });
      } else {
        setFilteredQuestions(allQuestions);
      }
    };

    performSearch();
  }, [query, toast]);

  // Re-listen to window events for client-side routing changes
  useEffect(() => {
    const handlePopState = () => {
      // Force re-render to get new searchParams and trigger search
      setFilteredQuestions(prev => [...prev]);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold font-headline">All Questions</h1>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/ask">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ask Question
          </Link>
        </Button>
      </div>
      <div className="mb-6">
        <SearchBar />
      </div>
       {isSearching ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Gemini is searching...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <QuestionItem key={question.id} question={question} />
            ))
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold">No questions found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or ask a new question!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
