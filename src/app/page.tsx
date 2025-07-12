import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { questions } from '@/lib/mock-data';
import { PlusCircle } from 'lucide-react';
import { QuestionItem } from '@/components/questions/question-item';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">All Questions</h1>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/ask">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ask Question
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionItem key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
