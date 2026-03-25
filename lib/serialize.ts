import { IPost } from "./models/post";

// Converts a Mongoose lean document to a plain serializable object
// safe to pass from Server Components → Client Components
export function serializePost(post: any): IPost {
  return {
    _id: post._id?.toString() ?? "",
    title: post.title ?? "",
    slug: post.slug ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    coverImage: post.coverImage ?? "",
    category: post.category ?? "",
    tags: post.tags ?? [],
    publishedAt: post.publishedAt instanceof Date
      ? post.publishedAt.toISOString() as unknown as Date
      : post.publishedAt ?? new Date().toISOString() as unknown as Date,
    readingTime: post.readingTime ?? 5,
    featured: post.featured ?? false,
    status: post.status ?? "draft",
    views: post.views ?? 0,
  };
}

export function serializePosts(posts: any[]): IPost[] {
  return posts.map(serializePost);
}
