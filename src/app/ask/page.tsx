
"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getSuggestedTags } from "./actions";
import { useAuth } from "@/context/auth-context";
import { useQuestion } from "@/context/question-context";
import type { Question } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
});

export default function AskQuestionPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { addQuestion } = useQuestion();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "" },
  });

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSuggestTags = () => {
    const { title, description } = form.getValues();
    if (!title || !description) {
      toast({
        variant: "destructive",
        title: "Title and Description needed",
        description: "Please fill out title and description to get AI suggestions.",
      });
      return;
    }

    startTransition(async () => {
      const result = await getSuggestedTags({ title, description });
      if (result.success && result.tags) {
        const newTags = result.tags.filter(t => !tags.includes(t));
        setTags(prev => [...prev, ...newTags]);
        toast({
          title: "Tags suggested!",
          description: "AI has added some tag suggestions for your question.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Suggestion failed",
          description: result.error || "Could not generate tag suggestions.",
        });
      }
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) return;

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      title: values.title,
      description: values.description,
      tags,
      author: currentUser,
      votes: 0,
      answers: [],
      createdAt: new Date(),
    }
    
    addQuestion(newQuestion);
    
    toast({
      title: "Question Posted!",
      description: "Your question has been successfully submitted.",
    });
    router.push("/");
  }

  if (!currentUser) {
    return (
       <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold font-headline mb-4">Ask a Public Question</h1>
        <p className="mb-6 text-muted-foreground">You must be logged in to ask a question.</p>
        <Button asChild>
          <Link href="/login">Login to Continue</Link>
        </Button>
      </div>
    )
  }


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-6">Ask a Public Question</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., How to center a div in CSS?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Describe your question in detail..."
                  />
                </FormControl>
                 {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="text-lg font-semibold">Tags</FormLabel>
            <div className="flex items-center gap-2">
              <Input
                placeholder="e.g., react, nextjs, typescript"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Suggest Tags
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm py-1">
                  {tag}
                  <button
                    type="button"
                    className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          </FormItem>

          <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90">
            Post Your Question
          </Button>
        </form>
      </Form>
    </div>
  );
}
