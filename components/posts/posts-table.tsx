"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { IPost } from "@/lib/models/post";

const CATEGORIES = ["All Categories", "Lifestyle", "Travel", "Style", "Wellness", "Food", "Mindfulness"];
const STATUSES = ["All Status", "published", "draft"];

interface PostsTableProps {
  posts: IPost[];
}

export default function PostsTable({ posts }: PostsTableProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = posts.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All Categories" || p.category === category;
    const matchStatus = status === "All Status" || p.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  async function handleDelete(slug: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(slug);
    try {
      await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      startTransition(() => {
        window.location.reload();
      });
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="bg-surface-container-low p-3 rounded-2xl flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/60"
            placeholder="Search posts, tags..."
          />
        </div>
        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-surface-container-lowest border-none rounded-xl text-xs font-bold uppercase tracking-wider py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-surface-container-lowest border-none rounded-xl text-xs font-bold uppercase tracking-wider py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant">
            <Search size={36} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No posts found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container/50">
                  {["Content", "Category", "Status", "Published", "Views", ""].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-[10px] uppercase tracking-[0.15em] font-extrabold text-on-surface-variant ${h === "" ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((post) => (
                  <tr
                    key={post._id}
                    className="group hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-surface-container flex-shrink-0" />
                        )}
                        <div className="max-w-xs">
                          <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm">
                            {post.title}
                          </h4>
                          {post.excerpt && (
                            <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-2 font-bold text-xs ${
                          post.status === "published"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.status === "published"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <span className="capitalize">{post.status ?? "draft"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">
                      {post.status === "published"
                        ? formatDate(post.publishedAt)
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">
                      {(post.views ?? 0) >= 1000
                        ? `${((post.views ?? 0) / 1000).toFixed(1)}k`
                        : post.views ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/posts/${post.slug}/edit`}
                          className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-white transition-all"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          disabled={deleting === post.slug}
                          className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-white transition-all disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
