"use client";

import { useState } from "react";
import {
  Upload,
  ImagePlus,
  Globe,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AiToolsPanelProps {
  onCoverImage: (url: string) => void;
  coverImage: string;
  onStatusChange: (status: "draft" | "published") => void;
  onCategoryChange: (category: string) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  saving: boolean;
  status: string;
  category: string;
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
  "Stories",
];

export default function AiToolsPanel({
  onCoverImage,
  coverImage,
  onStatusChange,
  onCategoryChange,
  onPublish,
  onSaveDraft,
  saving,
  status,
  category,
}: AiToolsPanelProps) {
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleUploadFile = async (file: File) => {
    setUploadingCover(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "/blog/covers");
    try {
      const res = await fetch("/api/imagekit/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) onCoverImage(data.url);
    } catch {
      onCoverImage(URL.createObjectURL(file));
    } finally {
      setUploadingCover(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleUploadFile(file);
      }
    }
  };

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
            <Select value={status} onValueChange={(val) => onStatusChange(val as "draft" | "published")}>
              <SelectTrigger className="w-full bg-surface-container-low border-outline-variant/20 text-on-surface rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase">Visibility</label>
            <div className="flex items-center gap-2 text-sm text-on-surface px-3 py-2.5 bg-surface-container-low rounded-lg">
              <Globe size={14} className="text-tertiary" />
              <span>Public</span>
            </div>
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

      {/* Cover Image Card */}
      <section className="bg-surface-container-lowest rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Cover Image
          </h3>
        </div>
        <div
          className={`aspect-[16/10] w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center mb-3 overflow-hidden relative transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-outline-variant/30 bg-surface-container-low hover:border-outline-variant/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <p className="text-white text-xs font-semibold">Drag to replace</p>
              </div>
            </>
          ) : (
            <>
              <ImagePlus size={32} className={`${isDragActive ? "text-primary" : "text-outline-variant"}`} />
              <p className="text-[10px] text-on-surface-variant mt-2">
                {isDragActive ? "Drop image here" : "Drag image here or click to upload"}
              </p>
              <p className="text-[9px] text-on-surface-variant/60 mt-1">
                Landscape recommended (1920×1080)
              </p>
            </>
          )}
        </div>
        <div className="space-y-2">
          <label className="w-full bg-surface-container-low text-on-surface-variant py-2.5 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer hover:bg-surface-container transition-colors" style={{ pointerEvents: uploadingCover ? 'none' : 'auto', opacity: uploadingCover ? 0.6 : 1 }}>
            <Upload size={11} />
            {uploadingCover ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingCover}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  handleUploadFile(file);
                }
              }}
            />
          </label>
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
            <Select value={category} onValueChange={(val) => val && onCategoryChange(val)}>
              <SelectTrigger className="w-full bg-surface-container-low border-outline-variant/20 text-on-surface rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
}
