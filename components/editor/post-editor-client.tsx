"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import AiToolsPanel from "./ai-tools-panel";
import { slugify, estimateReadingTime } from "@/lib/utils";
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
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const inlineImageQueue = useRef<string[]>([]);

  const handleContentChange = useCallback((val: string) => {
    setContent(val);
  }, []);

  // AI generates JSON blocks string, set as new content
  const handleAiContent = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  // Inline image: queue it; BlockEditor will pick up on next render
  const handleInlineImage = useCallback((url: string) => {
    inlineImageQueue.current.push(url);
    // We insert as a BlockNote image block by updating content
    // This is a simplified approach — in production, use editor.insertBlocks
    alert(`Image generated: ${url}\nUse the URL to insert manually into the editor.`);
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
      featured,
      readingTime,
      excerpt: content ? content.substring(0, 200).replace(/[#*[\]]/g, "") : "",
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
    <div className="p-8 max-w-[1440px] mx-auto grid grid-cols-12 gap-8">
      {/* Editor — left 65% */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
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

      {/* Tools panel — right 35% */}
      <div className="col-span-12 lg:col-span-4">
        <AiToolsPanel
          onAiContent={handleAiContent}
          onCoverImage={setCoverImage}
          onInlineImage={handleInlineImage}
          coverImage={coverImage}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
          onFeaturedChange={setFeatured}
          onPublish={() => save("published")}
          onSaveDraft={() => save("draft")}
          saving={saving}
          status={status}
          category={category}
          featured={featured}
        />
      </div>
    </div>
  );
}
