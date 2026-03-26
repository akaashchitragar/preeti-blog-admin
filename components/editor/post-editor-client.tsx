"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import AiToolsPanel from "./ai-tools-panel";
import { slugify, estimateReadingTime } from "@/lib/utils";

function extractExcerpt(content: string): string {
  if (!content) return "";
  try {
    const blocks = JSON.parse(content);
    if (!Array.isArray(blocks)) return content.substring(0, 200);
    const text = blocks
      .flatMap((b: any) => b.content ?? [])
      .filter((i: any) => i.type === "text")
      .map((i: any) => i.text)
      .join(" ")
      .trim();
    return text.substring(0, 200);
  } catch {
    return content.substring(0, 200);
  }
}
import { useRouter } from "next/navigation";

// BlockNote must be loaded client-side only (uses browser APIs)
const BlockEditor = dynamic(() => import("./block-editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] bg-surface-container-lowest rounded-xl flex items-center justify-center">
      <div className="text-on-surface-variant text-sm animate-pulse">Loading editor...</div>
    </div>
  ),
});

interface PostEditorClientProps {
  initialData?: {
    _id?: string;
    title?: string;
    slug?: string;
    content?: string;
    coverImage?: string;
    category?: string;
    status?: "draft" | "published";
    featured?: boolean;
    excerpt?: string;
  };
}

export default function PostEditorClient({ initialData }: PostEditorClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "Lifestyle");
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status ?? "draft"
  );
  const [saving, setSaving] = useState(false);

  const handleContentChange = useCallback((val: string) => {
    setContent(val);
  }, []);

  async function save(overrideStatus?: "draft" | "published") {
    if (!title.trim()) {
      alert("Please add a title before saving.");
      return;
    }
    setSaving(true);
    const slug = initialData?.slug ?? slugify(title);
    const readingTime = estimateReadingTime(content);

    const payload = {
      title,
      slug,
      content,
      coverImage,
      category,
      status: overrideStatus ?? status,
      readingTime,
      excerpt: extractExcerpt(content),
    };

    try {
      const isEdit = !!initialData?._id;
      const res = await fetch(
        isEdit ? `/api/posts/${initialData.slug}` : "/api/posts",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Failed to save post.");
        return;
      }

      router.push("/posts");
    } catch (e) {
      console.error(e);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
      {/* Editor — left 70% */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <div className="bg-surface-container-lowest rounded-xl p-8 min-h-[700px]">
          {/* Title */}
          <div className="mb-8">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-extrabold tracking-tight border-none focus:outline-none placeholder:text-outline bg-transparent text-on-surface"
              placeholder="Post title..."
            />
          </div>

          {/* BlockNote editor */}
          <BlockEditor
            key={content === initialData?.content ? "initial" : undefined}
            initialContent={content || undefined}
            onChange={handleContentChange}
          />
        </div>
      </div>

      {/* Tools panel — right 30% */}
      <div className="col-span-12 lg:col-span-3">
        <AiToolsPanel
          onCoverImage={setCoverImage}
          coverImage={coverImage}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
          onPublish={() => save("published")}
          onSaveDraft={() => save("draft")}
          saving={saving}
          status={status}
          category={category}
        />
      </div>
    </div>
  );
}
