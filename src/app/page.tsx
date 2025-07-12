
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { questions } from '@/lib/mock-data';
import { PlusCircle, Search } from 'lucide-react';
import { QuestionItem } from '@/components/questions/question-item';
import type { Question } from '@/lib/types';

function SearchBar() {
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
    window.history.pushState(null, '', `?${params.toString()}`);
    // Manually trigger a re-render by dispatching a popstate event
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search questions by keyword or tag..."
        className="pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

export default function Home() {
  const searchParams = useSearchParams();
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);

  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = questions.filter(
        (question) =>
          question.title.toLowerCase().includes(lowercasedQuery) ||
          question.description.toLowerCase().includes(lowercasedQuery) ||
          question.tags.some((tag) => tag.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions);
    }
  }, [query]);

  // This is a trick to re-listen to window events for client-side routing changes
  // because useSearchParams doesn't always trigger re-renders on pushState
  useEffect(() => {
    const handlePopState = () => {
      // The searchParams object will be updated, triggering the effect above
      // We just need to force a re-render to get the new searchParams
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
    </div>
  );
}
