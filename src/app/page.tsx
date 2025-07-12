
"use client";

import { useState, useEffect, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { QuestionItem } from '@/components/questions/question-item';
import type { Question } from '@/lib/types';
import { getSearchedQuestions } from './actions';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuestion } from '@/context/question-context';

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`?${params.toString()}`);
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
  const { questions: allQuestions, loading: questionsLoading } = useQuestion();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [sortBy, setSortBy] = useState('recent');
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
            setFilteredQuestions([]); 
          }
        });
      } else {
        setFilteredQuestions(allQuestions);
      }
    };

    performSearch();
  }, [query, toast, allQuestions]);
  

  useEffect(() => {
    if (!query) {
      setFilteredQuestions(allQuestions);
    }
  }, [allQuestions, query]);


  const sortedQuestions = useMemo(() => {
    const sorted = [...filteredQuestions];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'upvoted':
        return sorted.sort((a, b) => b.votes - a.votes);
      case 'answered':
        return sorted.sort((a, b) => b.answers.length - a.answers.length);
      default:
        return sorted;
    }
  }, [filteredQuestions, sortBy]);


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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <SearchBar />
        </div>
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="upvoted">Most Upvoted</SelectItem>
              <SelectItem value="answered">Most Answered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
       {isSearching || questionsLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">{isSearching ? 'Gemini is searching...' : 'Loading questions...'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedQuestions.length > 0 ? (
            sortedQuestions.map((question) => (
              <QuestionItem key={question._id} question={question} />
            ))
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold">No questions found</h2>
              <p className="text-muted-foreground mt-2">
                {query ? 'Try a different search query.' : 'Be the first to ask a question!'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
