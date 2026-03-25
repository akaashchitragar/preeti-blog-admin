import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/post";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (category) query.category = category;

  const posts = await Post.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  if (!body.title || !body.slug) {
    return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
  }

  try {
    const post = await Post.create({
      ...body,
      publishedAt: body.status === "published" ? new Date() : body.publishedAt,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "A post with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
