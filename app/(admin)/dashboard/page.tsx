import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/post";
import { PenSquare, Sparkles, ArrowRight, FileText } from "lucide-react";
import { serializePosts } from "@/lib/serialize";
import PostsDataTable from "@/components/posts/posts-data-table";

async function getDashboardData() {
  await connectDB();
  const recent = await Post.find().sort({ createdAt: -1 }).limit(8).lean();
  return { recent: serializePosts(recent) };
}

export default async function DashboardPage() {
  const { recent } = await getDashboardData();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Quick Actions */}
      <div className="bg-surface-container-low p-2 rounded-xl flex gap-3">
        <Link
          href="/posts/new"
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-lowest rounded-lg hover:bg-white transition-all shadow-sm font-semibold text-on-surface border border-outline-variant/20 active:scale-[0.98] text-sm"
        >
          <PenSquare size={18} className="text-primary" />
          Write New Post
        </Link>
        <Link
          href="/posts/new?mode=ai"
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-high rounded-lg hover:bg-surface-variant transition-all font-semibold text-on-surface active:scale-[0.98] text-sm"
        >
          <Sparkles size={18} className="text-tertiary" />
          Generate with AI
        </Link>
      </div>

      {/* Recent Posts */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-on-surface">Recent Editorial</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Latest {recent.length} contributions to the archive.
            </p>
          </div>
          <Link
            href="/posts"
            className="text-primary text-sm font-semibold hover:opacity-80 flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl py-20 text-center text-on-surface-variant border border-outline-variant/10">
            <FileText size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No posts yet</p>
            <p className="text-sm mt-1">Start writing to see your posts here.</p>
          </div>
        ) : (
          <PostsDataTable posts={recent} />
        )}
      </section>
    </div>
  );
}
