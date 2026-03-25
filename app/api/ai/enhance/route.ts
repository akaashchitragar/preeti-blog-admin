import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(req: NextRequest) {
  const { prompt, currentContent } = await req.json();
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 503 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

    const systemPrompt = `You are an editorial writer for "Preeti" – a warm, personal lifestyle blog.

${currentContent ? `Here is the current post content:\n${currentContent}\n\n` : ""}
Enhancement request: ${prompt}

Rewrite or improve the content based on the request. Return the result as valid BlockNote JSON blocks array. Each block:
- "id": unique string
- "type": one of "paragraph", "heading", "bulletListItem", "numberedListItem", "quote"
- "content": [{"type": "text", "text": "...", "styles": {}}]
- "children": []

Return only the JSON array.`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text];
    const jsonStr = jsonMatch[1]?.trim() ?? text;

    try {
      JSON.parse(jsonStr);
      return NextResponse.json({ content: jsonStr });
    } catch {
      const fallback = JSON.stringify([
        { id: "ai-1", type: "paragraph", content: [{ type: "text", text, styles: {} }], children: [] },
      ]);
      return NextResponse.json({ content: fallback });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
