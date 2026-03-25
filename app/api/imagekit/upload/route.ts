import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  // Handle base64 uploads (from AI-generated images)
  if (contentType.includes("application/json")) {
    const { base64, fileName, folder = "/blog" } = await req.json();
    if (!base64 || !fileName) {
      return NextResponse.json({ error: "base64 and fileName are required" }, { status: 400 });
    }
    try {
      const result = await imagekit.upload({
        file: base64,
        fileName,
        folder,
        useUniqueFileName: true,
      });
      return NextResponse.json({ url: result.url, fileId: result.fileId });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // Handle multipart file uploads (from file picker)
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "/blog";

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder,
        useUniqueFileName: true,
      });
      return NextResponse.json({ url: result.url, fileId: result.fileId });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
}
