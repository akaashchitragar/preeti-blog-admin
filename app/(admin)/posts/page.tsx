import Link from "next/link";
import { Plus } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Post, IPost } from "@/lib/models/post";
import { serializePosts } from "@/lib/serialize";
import PostsDataTable from "@/components/posts/posts-data-table";

async function getPosts(): Promise<IPost[]> {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return serializePosts(posts);
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Content Library
          </h2>
          <p className="text-on-surface-variant mt-1 text-sm">
            Manage and refine your editorial narrative across all channels.
          </p>
        </div>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] shadow-sm transition-all"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      <PostsDataTable posts={posts} />
    </div>
  );
}
