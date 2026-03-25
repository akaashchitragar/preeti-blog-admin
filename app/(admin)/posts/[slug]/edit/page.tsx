import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/post";
import PostEditorClient from "@/components/editor/post-editor-client";
import { notFound } from "next/navigation";
import { serializePost } from "@/lib/serialize";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const raw = await Post.findOne({ slug }).lean();
  if (!raw) notFound();

  const post = serializePost(raw);

  return (
    <PostEditorClient
      initialData={{
        _id: post._id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        status: post.status,
        featured: post.featured,
        excerpt: post.excerpt,
      }}
    />
  );
}
