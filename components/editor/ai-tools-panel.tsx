"use client";

import { useState } from "react";
import {
  Sparkles,
  Upload,
  ImagePlus,
  Wand2,
  Globe,
  Clock,
  ChevronDown,
} from "lucide-react";

interface AiToolsPanelProps {
  onAiContent: (content: string) => void;
  onCoverImage: (url: string) => void;
  onInlineImage: (url: string) => void;
  coverImage: string;
  onStatusChange: (status: "draft" | "published") => void;
  onCategoryChange: (category: string) => void;
  onFeaturedChange: (featured: boolean) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  saving: boolean;
  status: string;
  category: string;
  featured: boolean;
}

const CATEGORIES = [
  "Lifestyle",
  "Travel",
  "Style",
  "Wellness",
  "Food",
  "Mindfulness",
  "Culture",
  "Personal",
];

export default function AiToolsPanel({
  onAiContent,
  onCoverImage,
  onInlineImage,
  coverImage,
  onStatusChange,
  onCategoryChange,
  onFeaturedChange,
  onPublish,
  onSaveDraft,
  saving,
  status,
  category,
  featured,
}: AiToolsPanelProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [coverPrompt, setCoverPrompt] = useState("");
  const [imageModel, setImageModel] = useState("nano-banana");
  const [generatingPost, setGeneratingPost] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [generatingInline, setGeneratingInline] = useState(false);

  async function handleGeneratePost() {
    if (!aiPrompt.trim()) return;
    setGeneratingPost(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.content) onAiContent(data.content);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingPost(false);
    }
  }

  async function handleEnhance() {
    if (!aiPrompt.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.content) onAiContent(data.content);
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancing(false);
    }
  }

  async function handleGenerateCover() {
    if (!coverPrompt.trim()) return;
    setGeneratingCover(true);
    try {
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: coverPrompt, model: imageModel }),
      });
      const data = await res.json();
      if (data.url) onCoverImage(data.url);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingCover(false);
    }
  }

  async function handleGenerateInline() {
    if (!imagePrompt.trim()) return;
    setGeneratingInline(true);
    try {
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await res.json();
      if (data.url) onInlineImage(data.url);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingInline(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Publish Card */}
      <section className="bg-surface-container-lowest rounded-xl p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center justify-between">
          Publish
          <Clock size={14} />
        </h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase">Status</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as "draft" | "published")}
              className="w-full bg-surface-container-low rounded-lg text-sm py-2.5 px-3 border-none focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase">Visibility</label>
            <div className="flex items-center gap-2 text-sm text-on-surface px-3 py-2.5 bg-surface-container-low rounded-lg">
              <Globe size={14} className="text-tertiary" />
              <span>Public</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-container-low rounded-lg">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => onFeaturedChange(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            <label htmlFor="featured" className="text-sm text-on-surface cursor-pointer">
              Featured post
            </label>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onPublish}
              disabled={saving}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3 rounded-lg font-bold text-sm disabled:opacity-60 hover:opacity-90 transition-opacity"
            >
              {saving ? "Saving..." : "Publish"}
            </button>
            <button
              onClick={onSaveDraft}
              disabled={saving}
              className="w-full bg-transparent border border-outline-variant/40 text-primary py-3 rounded-lg font-bold text-sm hover:bg-surface-container-low transition-colors disabled:opacity-60"
            >
              Save Draft
            </button>
          </div>
        </div>
      </section>

      {/* AI Writing Card */}
      <section className="bg-surface-container-lowest rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
            AI Writing Tools
            <Sparkles size={13} className="text-primary" />
          </h3>
          <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant text-[9px] font-bold rounded-full">
            Gemini 3.1 Pro
          </span>
        </div>
        <div className="space-y-3">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full h-24 bg-surface-container-low rounded-lg text-sm p-3 border-none focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none placeholder:text-on-surface-variant/50"
            placeholder="Describe the post topic, tone, or what to improve..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleGeneratePost}
              disabled={generatingPost || !aiPrompt.trim()}
              className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary py-2.5 rounded-lg font-bold text-xs disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {generatingPost ? "Generating..." : "Generate Post"}
            </button>
            <button
              onClick={handleEnhance}
              disabled={enhancing || !aiPrompt.trim()}
              className="flex-1 border border-outline-variant/40 text-on-surface-variant py-2.5 rounded-lg font-bold text-xs hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              {enhancing ? "Enhancing..." : "Enhance"}
            </button>
          </div>
        </div>
      </section>

      {/* Cover Image Card */}
      <section className="bg-surface-container-lowest rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Cover Image
          </h3>
          <select
            value={imageModel}
            onChange={(e) => setImageModel(e.target.value)}
            className="bg-secondary-container text-on-secondary-container text-[9px] font-bold rounded-full px-2 py-0.5 border-none focus:outline-none cursor-pointer"
          >
            <option value="nano-banana">Nano Banana</option>
            <option value="nano-banana-2">Nano Banana 2</option>
            <option value="nano-banana-pro">Nano Banana Pro</option>
          </select>
        </div>
        <div className="aspect-[16/10] w-full bg-surface-container-low rounded-lg border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center mb-3 overflow-hidden relative">
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <>
              <ImagePlus size={32} className="text-outline-variant" />
              <p className="text-[10px] text-on-surface-variant mt-2">
                Landscape recommended (1920×1080)
              </p>
            </>
          )}
        </div>
        <div className="space-y-2">
          <input
            value={coverPrompt}
            onChange={(e) => setCoverPrompt(e.target.value)}
            className="w-full bg-surface-container-low rounded-lg text-[11px] py-2.5 px-3 border-none focus:outline-none focus:ring-1 focus:ring-primary/20"
            placeholder="Describe the cover image..."
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleGenerateCover}
              disabled={generatingCover || !coverPrompt.trim()}
              className="bg-primary text-on-primary py-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              <Wand2 size={11} />
              {generatingCover ? "Generating..." : "Generate Cover"}
            </button>
            <label className="bg-surface-container-low text-on-surface-variant py-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer hover:bg-surface-container transition-colors">
              <Upload size={11} />
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const form = new FormData();
                  form.append("file", file);
                  form.append("folder", "/blog/covers");
                  try {
                    const res = await fetch("/api/imagekit/upload", { method: "POST", body: form });
                    const data = await res.json();
                    if (data.url) onCoverImage(data.url);
                  } catch {
                    // fallback to local preview if upload fails
                    onCoverImage(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>
        </div>
      </section>

      {/* Inline Image Gen */}
      <section className="bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/20">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Inline Image Gen
        </h3>
        <div className="space-y-2">
          <input
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            className="w-full bg-surface-container-lowest rounded-lg text-[11px] py-2.5 px-3 border-none focus:outline-none focus:ring-1 focus:ring-primary/20"
            placeholder="Describe image..."
          />
          <button
            onClick={handleGenerateInline}
            disabled={generatingInline || !imagePrompt.trim()}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-2 rounded-lg font-bold text-[10px] disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {generatingInline ? "Generating..." : "Generate & Insert Image"}
          </button>
          <div className="flex items-center gap-2 pt-1">
            <div className="w-2 h-2 rounded-full bg-tertiary flex-shrink-0" />
            <span className="text-[9px] text-on-surface-variant italic">
              Auto-inserts at cursor position
            </span>
          </div>
        </div>
      </section>

      {/* Post Settings */}
      <section className="bg-surface-container-lowest rounded-xl p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">
          Post Settings
        </h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full bg-surface-container-low rounded-lg text-sm py-2.5 px-3 border-none focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
