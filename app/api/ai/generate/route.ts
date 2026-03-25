import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 503 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

    const systemPrompt = `You are an editorial writer for "Preeti" – a warm, personal lifestyle blog about intentional living, wellness, travel, style, and everyday beauty.

Write engaging, conversational blog content in first person. Use a warm, thoughtful tone.
Structure the content as valid BlockNote JSON blocks array. Each block should have:
- "id": a unique string
- "type": one of "paragraph", "heading", "bulletListItem", "numberedListItem", "quote"
- "content": array of inline content objects with "type": "text", "text": "...", "styles": {}
- "children": [] (empty array)

Only return the JSON array, no other text.

User request: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text().trim();

    // Extract JSON if wrapped in markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text];
    const jsonStr = jsonMatch[1]?.trim() ?? text;

    try {
      JSON.parse(jsonStr); // validate
      return NextResponse.json({ content: jsonStr });
    } catch {
      // If not valid JSON, wrap the text as a single paragraph block
      const fallback = JSON.stringify([
        {
          id: "ai-1",
          type: "paragraph",
          content: [{ type: "text", text, styles: {} }],
          children: [],
        },
      ]);
      return NextResponse.json({ content: fallback });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
