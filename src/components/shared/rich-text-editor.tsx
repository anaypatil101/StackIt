"use client"

import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  return (
    <Textarea
      placeholder={placeholder || "Describe in detail..."}
      className={className || "h-48"}
      value={value}
      onChange={onChange}
    />
  )
}
