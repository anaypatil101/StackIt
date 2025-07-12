
"use client"

import { useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Link2, Image as ImageIcon, Smile,
  AlignLeft, AlignCenter, AlignRight, Quote, Code
} from "lucide-react"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"

import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EditorToolbar = ({ editor }: { editor: any }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])
  
  const onEmojiClick = (emojiData: EmojiClickData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run()
  };

  if (!editor) {
    return null
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-2 flex flex-wrap items-center gap-2">
      <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-8" />
      <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Toggle>
       <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </Toggle>
       <Toggle size="sm" pressed={editor.isActive('codeBlock')} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-8" />
       <Toggle size="sm" onPressedChange={() => editor.chain().focus().setTextAlign('left').run()} pressed={editor.isActive({ textAlign: 'left' })}>
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onPressedChange={() => editor.chain().focus().setTextAlign('center').run()} pressed={editor.isActive({ textAlign: 'center' })}>
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onPressedChange={() => editor.chain().focus().setTextAlign('right').run()} pressed={editor.isActive({ textAlign: 'right' })}>
        <AlignRight className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-8" />
      <Button variant="ghost" size="icon" onClick={setLink} className="h-8 w-8">
        <Link2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={addImage} className="h-8 w-8">
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
           <Button variant="ghost" size="icon" className="h-8 w-8">
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto border-none">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </PopoverContent>
      </Popover>
    </div>
  )
}


export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
            HTMLAttributes: {
                class: 'bg-muted text-muted-foreground rounded-sm p-2 text-sm',
            },
        },
        blockquote: {
            HTMLAttributes: {
                class: 'border-l-4 border-primary pl-4 italic',
            },
        }
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        inline: false
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert min-h-[150px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
  });

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  )
}
