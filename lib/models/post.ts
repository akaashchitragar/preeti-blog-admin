import mongoose, { Schema, model, models } from "mongoose";

export interface IPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  readingTime: number;
  featured: boolean;
  status: "draft" | "published";
  views: number;
}

const PostSchema = new Schema<IPost>(
  {
    title:       { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    excerpt:     { type: String, default: "" },
    content:     { type: String, default: "" },
    coverImage:  { type: String, default: "" },
    category:    { type: String, default: "Lifestyle" },
    tags:        { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    readingTime: { type: Number, default: 5 },
    featured:    { type: Boolean, default: false },
    status:      { type: String, enum: ["draft", "published"], default: "draft" },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = models.Post ?? model<IPost>("Post", PostSchema);
