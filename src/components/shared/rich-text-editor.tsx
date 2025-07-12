"use client"

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Smile,
  Strikethrough,
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RichTextEditorProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <div className="rounded-md border">
      <TooltipProvider>
        <div className="p-2 border-b">
          <ToggleGroup type="multiple" className="flex-wrap justify-start">
             <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="bold" aria-label="Toggle bold">
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
                  <Strikethrough className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Strikethrough</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-8 mx-2" />
             <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="bullet" aria-label="Toggle bullet list">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="numbered" aria-label="Toggle numbered list">
                  <ListOrdered className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>
             <Separator orientation="vertical" className="h-8 mx-2" />
             <ToggleGroup type="single" defaultValue="left">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="left" aria-label="Align left">
                    <AlignLeft className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="center" aria-label="Align center">
                    <AlignCenter className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="right" aria-label="Align right">
                    <AlignRight className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>
            </ToggleGroup>
            <Separator orientation="vertical" className="h-8 mx-2" />
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="link" aria-label="Insert link">
                  <Link className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Hyperlink</TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="image" aria-label="Insert image">
                  <ImageIcon className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Image</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="emoji" aria-label="Insert emoji">
                  <Smile className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Emoji</TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
      </TooltipProvider>
      <Textarea
        placeholder="Describe your answer in detail..."
        className="h-48 w-full rounded-none border-0 resize-y focus-visible:ring-0"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
