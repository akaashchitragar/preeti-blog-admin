import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { imagekit } from "@/lib/imagekit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(req: NextRequest) {
  const { prompt, model: modelName = "nano-banana", folder = "/blog" } = await req.json();
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 503 });
  }

  // Model selection
  const modelMap: Record<string, string> = {
    "nano-banana": "gemini-2.5-flash-image",
    "nano-banana-2": "gemini-3.1-flash-image-preview",
    "nano-banana-pro": "nano-banana-pro-preview",
  };
  const selectedModel = modelMap[modelName] ?? "gemini-2.5-flash-image";

  try {
    const model = genAI.getGenerativeModel({
      model: selectedModel,
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] } as any,
    });

    const result = await model.generateContent(
      `Generate a high-quality, editorial-style photograph for a lifestyle blog: ${prompt}.
      Style: warm, natural lighting, clean composition, earthy tones.`
    );

    // Find the image part
    for (const part of result.response.candidates?.[0]?.content?.parts ?? []) {
      if ((part as any).inlineData) {
        const { mimeType, data } = (part as any).inlineData;
        const ext = mimeType.split("/")[1] ?? "png";
        const fileName = `ai-generated-${Date.now()}.${ext}`;

        // Upload to ImageKit
        const uploaded = await imagekit.upload({
          file: `data:${mimeType};base64,${data}`,
          fileName,
          folder,
          useUniqueFileName: true,
        });

        return NextResponse.json({ url: uploaded.url, fileId: uploaded.fileId });
      }
    }

    return NextResponse.json({ error: "No image generated in response" }, { status: 500 });
  } catch (err: any) {
    console.error("Image generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
