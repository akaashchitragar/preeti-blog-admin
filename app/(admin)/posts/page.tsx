import { connectDB } from "@/lib/mongodb";
import { Post, IPost } from "@/lib/models/post";
import { serializePosts } from "@/lib/serialize";
import PostsDataTable from "@/components/posts/posts-data-table";

async function getPosts(page = 1, limit = 50): Promise<{ posts: IPost[], total: number }> {
  await connectDB();
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments(),
  ]);
  return { posts: serializePosts(posts), total };
}

export default async function PostsPage() {
  const { posts, total } = await getPosts();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
          Content Library
        </h2>
        <p className="text-on-surface-variant mt-1 text-sm">
          Manage and refine your editorial narrative across all channels.
        </p>
      </div>

      <PostsDataTable posts={posts} />
    </div>
  );
}
