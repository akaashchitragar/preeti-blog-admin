"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect } from "react";

interface BlockEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

export default function BlockEditor({ initialContent, onChange }: BlockEditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (() => {
          try {
            return JSON.parse(initialContent);
          } catch {
            return undefined;
          }
        })()
      : undefined,
  });

  useEffect(() => {
    const unsubscribe = editor.onChange(() => {
      const blocks = editor.document;
      onChange(JSON.stringify(blocks));
    });
    return unsubscribe;
  }, [editor, onChange]);

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      className="min-h-[500px]"
    />
  );
}
